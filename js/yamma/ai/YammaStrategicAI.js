/**
 * Yamma Strategic AI
 *
 * Iterative-deepening negamax search with alpha-beta pruning over the full
 * move space (position + cube rotation).
 *
 * Key ideas:
 * - Projected views are maintained incrementally as flat integer arrays
 *   (0 = empty, 1 = white, 2 = blue). A newly placed cube is always the
 *   topmost cube along its viewing ray in all three views (support rules
 *   guarantee contiguous stacking along each ray), so each placement changes
 *   exactly one cell per view. This makes make/unmake and win detection
 *   cheap compared to rebuilding views from scratch.
 * - The list of playable positions is also maintained incrementally: a
 *   placement removes its own position and can open up to three positions
 *   on the level above.
 * - Win detection after a placement only scans the lines through the three
 *   changed view cells, with the placed color taking priority when both
 *   colors complete a line (matching YammaGameManager's checkWinner(color)).
 * - Evaluation counts 4-cell windows in the two winnable directions only
 *   (horizontal lines cannot win in Yamma). Windows containing both colors
 *   are dead and score nothing.
 * - Move ordering: killer moves and a history heuristic, plus a static
 *   centrality preference; root moves are re-ordered by score between
 *   deepening iterations.
 * - Supports the Swap Opening Rule (first two placements belong to the
 *   opponent) and the Pie Rule (as Guest, considers claiming Host's first
 *   cube by comparing searched values of swapping vs. playing on).
 */

import { YammaNotationBuilder, YammaNotationMove } from '../YammaGameNotation';
import { PLAYER, YammaCube } from '../YammaBoard';
import { GUEST, HOST } from '../../CommonNotationObjects';
import { gameOptionEnabled, YAMMA_PIE_RULE, YAMMA_SWAP_RULE } from '../../GameOptions';

const WIN_SCORE = 100000;
const DECISIVE_SCORE = 90000;
const TEMPO_BONUS = 20;

// Score for a 4-cell window containing only one player's color,
// indexed by how many of that player's cells are visible in the window.
const WINDOW_SCORES = [0, 1, 12, 160, 5000];

const KILLER_ORDER_BONUS = 100000;
const HISTORY_ORDER_CAP = 50000;

// Integer color encoding for the hot path
const EMPTY = 0;
const WHITE = 1;
const BLUE = 2;

function colorToInt(color) {
	if (color === PLAYER.WHITE) return WHITE;
	if (color === PLAYER.BLUE) return BLUE;
	return EMPTY;
}

function intToColor(colorInt) {
	if (colorInt === WHITE) return PLAYER.WHITE;
	if (colorInt === BLUE) return PLAYER.BLUE;
	return null;
}

// Only these two directions can form a winning 4-in-a-row.
const WIN_DIRECTIONS = [
	{ dRow: 1, dCol: 0 },   // Down-left diagonal
	{ dRow: 1, dCol: 1 },   // Down-right diagonal
];

const windowsCache = {};

/**
 * All 4-cell windows in the two winnable directions, as flat cell indices
 * (index = row * (row + 1) / 2 + col), packed 4 per window.
 */
function getWindowsFlat(baseRows) {
	if (windowsCache[baseRows]) {
		return windowsCache[baseRows];
	}
	const quads = [];
	for (const dir of WIN_DIRECTIONS) {
		for (let row = 0; row + 3 * dir.dRow < baseRows; row++) {
			for (let col = 0; col <= row; col++) {
				const cells = [];
				let valid = true;
				for (let k = 0; k < 4; k++) {
					const r = row + k * dir.dRow;
					const c = col + k * dir.dCol;
					if (r >= baseRows || c < 0 || c > r) {
						valid = false;
						break;
					}
					cells.push((r * (r + 1)) / 2 + c);
				}
				if (valid) {
					quads.push(...cells);
				}
			}
		}
	}
	const flat = Int16Array.from(quads);
	windowsCache[baseRows] = flat;
	return flat;
}

// Shared cube instances per (color, rotation): search placements never need
// per-cube coordinates, only owner/rotation/face colors.
const CUBE_SINGLETONS = {
	[PLAYER.WHITE]: [0, 1, 2].map(rot => new YammaCube(PLAYER.WHITE, 0, 0, 0, rot)),
	[PLAYER.BLUE]: [0, 1, 2].map(rot => new YammaCube(PLAYER.BLUE, 0, 0, 0, rot))
};

// FACE_INT[colorInt][rotation][viewAngle] = color int visible from that view
const FACE_INT = [null, [], []];
for (const color of [PLAYER.WHITE, PLAYER.BLUE]) {
	FACE_INT[colorToInt(color)] = [0, 1, 2].map(rot =>
		[0, 1, 2].map(v => colorToInt(CUBE_SINGLETONS[color][rot].getFaceColor((v + 2) % 3)))
	);
}

export function YammaSearch(board, startMoveCount, swapRuleActive) {
	this.board = board;
	this.baseRows = board.baseRows;
	this.levels = board.levels;
	this.startMoveCount = startMoveCount;
	this.swapRuleActive = swapRuleActive;
	this.windowsFlat = getWindowsFlat(this.baseRows);

	// Triangle row offsets: cell index = triRow[r] + c
	this.triRow = [];
	for (let r = 0; r < this.baseRows; r++) {
		this.triRow[r] = (r * (r + 1)) / 2;
	}
	const cellCount = this.triRow[this.baseRows - 1] + this.baseRows;

	// Flat integer projected views
	this.views = [new Int8Array(cellCount), new Int8Array(cellCount), new Int8Array(cellCount)];
	for (let v = 0; v < 3; v++) {
		const grid = board.buildProjectedView(v);
		for (let r = 0; r < this.baseRows; r++) {
			for (let c = 0; c <= r; c++) {
				this.views[v][this.triRow[r] + c] = colorToInt(grid[r][c]);
			}
		}
	}

	this.buildPositionTable();

	// Playable positions, maintained incrementally by place/unplace
	this.open = [];
	for (const move of board.getPossibleMoves()) {
		const pos = this.posByCoord[move.level][move.row][move.col];
		pos.openIdx = this.open.length;
		this.open.push(pos);
	}

	this.killers = [];
	this.history = new Float64Array(this.positions.length * 3);
	this.undoSlots = [];
	for (let i = 0; i < 64; i++) {
		this.undoSlots.push({ pos: null, code: 0, removedIdx: 0, added: 0, prev0: 0, prev1: 0, prev2: 0 });
	}
	this.nodeCount = 0;
	this.stopped = false;
	this.deadline = Infinity;
}

/** Static per-position data: projections, supports, positions above, ordering. */
YammaSearch.prototype.buildPositionTable = function() {
	this.positions = [];
	this.posByCoord = [];

	for (let level = 0; level < this.board.maxLevels; level++) {
		this.posByCoord[level] = [];
		const rows = this.board.getRowsAtLevel(level);
		for (let row = 0; row < rows; row++) {
			this.posByCoord[level][row] = [];
			for (let col = 0; col <= row; col++) {
				const maxRow = this.baseRows - level - 1;
				// Projected view cell (row, col) for each viewing angle
				const proj = [
					[row, col],
					[maxRow - col, row - col],
					[maxRow - row + col, maxRow - row]
				];
				const pos = {
					row, col, level,
					stableIdx: this.positions.length,
					openIdx: -1,
					proj,
					projIdx: proj.map(([pr, pc]) => this.triRow[pr] + pc),
					supports: null,
					above: [],
					// Static move-ordering preference: central, low positions first
					staticOrder: Math.max(0, Math.round(8 + 4 * (row / 2 - Math.abs(col - row / 2)) - level))
				};
				if (level > 0) {
					pos.supports = [
						[row, col, level - 1],
						[row + 1, col, level - 1],
						[row + 1, col + 1, level - 1]
					];
				}
				this.positions.push(pos);
				this.posByCoord[level][row][col] = pos;
			}
		}
	}

	// Positions on the level above that use each position as support
	for (const pos of this.positions) {
		if (pos.level === 0) continue;
		for (const [r, c, l] of pos.supports) {
			this.posByCoord[l][r][c].above.push(pos);
		}
	}
};

/** Hot-path placement. Writes into the given undo slot. colorInt is 1 or 2. */
YammaSearch.prototype._place = function(pos, rotation, colorInt, undo) {
	this.levels[pos.level][pos.row][pos.col] = CUBE_SINGLETONS[intToColor(colorInt)][rotation];

	const faces = FACE_INT[colorInt][rotation];
	undo.pos = pos;
	undo.code = pos.stableIdx * 3 + rotation;
	undo.prev0 = this.views[0][pos.projIdx[0]];
	undo.prev1 = this.views[1][pos.projIdx[1]];
	undo.prev2 = this.views[2][pos.projIdx[2]];
	this.views[0][pos.projIdx[0]] = faces[0];
	this.views[1][pos.projIdx[1]] = faces[1];
	this.views[2][pos.projIdx[2]] = faces[2];

	// Remove this position from the open list (swap-remove)
	const i = pos.openIdx;
	const last = this.open.length - 1;
	undo.removedIdx = i;
	this.open[i] = this.open[last];
	this.open[i].openIdx = i;
	this.open.pop();
	pos.openIdx = -1;

	// Newly supported positions on the level above become playable
	undo.added = 0;
	for (const cand of pos.above) {
		if (this.levels[cand.level][cand.row][cand.col] !== null || cand.openIdx !== -1) {
			continue;
		}
		const s = cand.supports;
		if (this.levels[s[0][2]][s[0][0]][s[0][1]] !== null &&
			this.levels[s[1][2]][s[1][0]][s[1][1]] !== null &&
			this.levels[s[2][2]][s[2][0]][s[2][1]] !== null) {
			cand.openIdx = this.open.length;
			this.open.push(cand);
			undo.added++;
		}
	}

	return undo;
};

/** Test/compat entry point: place by {row, col, level, rotation} and color name. */
YammaSearch.prototype.place = function(child, color) {
	const pos = this.posByCoord[child.level][child.row][child.col];
	const undo = { pos: null, code: 0, removedIdx: 0, added: 0, prev0: 0, prev1: 0, prev2: 0 };
	return this._place(pos, child.rotation, colorToInt(color), undo);
};

YammaSearch.prototype.unplace = function(undo) {
	const pos = undo.pos;
	this.levels[pos.level][pos.row][pos.col] = null;
	this.views[0][pos.projIdx[0]] = undo.prev0;
	this.views[1][pos.projIdx[1]] = undo.prev1;
	this.views[2][pos.projIdx[2]] = undo.prev2;

	// Remove positions that this placement opened (they were pushed last)
	for (let k = 0; k < undo.added; k++) {
		const cand = this.open.pop();
		cand.openIdx = -1;
	}

	// Re-insert this position at its previous index
	const i = undo.removedIdx;
	if (i < this.open.length) {
		const moved = this.open[i];
		this.open.push(moved);
		moved.openIdx = this.open.length - 1;
		this.open[i] = pos;
	} else {
		this.open.push(pos);
	}
	pos.openIdx = i;
};

/** Current projected view as a 2D grid of color names (for tests/debugging). */
YammaSearch.prototype.getViewGrid = function(viewAngle) {
	const grid = [];
	for (let r = 0; r < this.baseRows; r++) {
		grid[r] = [];
		for (let c = 0; c <= r; c++) {
			grid[r][c] = intToColor(this.views[viewAngle][this.triRow[r] + c]);
		}
	}
	return grid;
};

/**
 * Check for a 4-in-a-row through a single view cell in the two winnable
 * directions. Returns the winning color int, or 0.
 */
YammaSearch.prototype.lineWinAt = function(viewAngle, pr, pc) {
	const view = this.views[viewAngle];
	const triRow = this.triRow;
	const color = view[triRow[pr] + pc];
	if (color === EMPTY) {
		return EMPTY;
	}

	// Down-left diagonal (dRow 1, dCol 0): column stays, row changes
	let count = 1;
	let r = pr - 1;
	while (r >= 0 && pc <= r && view[triRow[r] + pc] === color) {
		count++;
		r--;
	}
	r = pr + 1;
	while (r < this.baseRows && view[triRow[r] + pc] === color) {
		count++;
		r++;
	}
	if (count >= 4) {
		return color;
	}

	// Down-right diagonal (dRow 1, dCol 1): row and column change together
	count = 1;
	r = pr - 1;
	let c = pc - 1;
	while (r >= 0 && c >= 0 && view[triRow[r] + c] === color) {
		count++;
		r--;
		c--;
	}
	r = pr + 1;
	c = pc + 1;
	while (r < this.baseRows && view[triRow[r] + c] === color) {
		count++;
		r++;
		c++;
	}
	if (count >= 4) {
		return color;
	}

	return EMPTY;
};

/**
 * Winner created by the placement described in the undo record (color int,
 * 0 if none). Only lines through the changed view cells can be new; the
 * placed color has priority if both colors complete a line (matches game
 * rules).
 */
YammaSearch.prototype.winnerAfterPlacement = function(undo, placedColorInt) {
	let other = EMPTY;
	const proj = undo.pos.proj;
	for (let v = 0; v < 3; v++) {
		const winColor = this.lineWinAt(v, proj[v][0], proj[v][1]);
		if (winColor === placedColorInt) {
			return winColor;
		}
		if (winColor !== EMPTY) {
			other = winColor;
		}
	}
	return other;
};

/** Test/compat wrapper: color-name in, color-name (or null) out. */
YammaSearch.prototype.winnerAfterPlacementColor = function(undo, placedColor) {
	return intToColor(this.winnerAfterPlacement(undo, colorToInt(placedColor)));
};

/** Color int the moving side places at a given ply (handles the Swap Opening Rule). */
YammaSearch.prototype.placementColorAt = function(ply, sideColorInt) {
	if (this.swapRuleActive && (this.startMoveCount + ply) < 2) {
		return 3 - sideColorInt;
	}
	return sideColorInt;
};

/** Static evaluation from the perspective of the side to move. */
YammaSearch.prototype.evaluate = function(sideColorInt) {
	let whiteScore = 0;
	let blueScore = 0;
	const windows = this.windowsFlat;
	for (let v = 0; v < 3; v++) {
		const view = this.views[v];
		for (let i = 0; i < windows.length; i += 4) {
			const c0 = view[windows[i]];
			const c1 = view[windows[i + 1]];
			const c2 = view[windows[i + 2]];
			const c3 = view[windows[i + 3]];
			const whiteCount = (c0 === WHITE) + (c1 === WHITE) + (c2 === WHITE) + (c3 === WHITE);
			const blueCount = (c0 === BLUE) + (c1 === BLUE) + (c2 === BLUE) + (c3 === BLUE);
			if (whiteCount === 0) {
				blueScore += WINDOW_SCORES[blueCount];
			} else if (blueCount === 0) {
				whiteScore += WINDOW_SCORES[whiteCount];
			}
		}
	}
	const diff = whiteScore - blueScore;
	return (sideColorInt === WHITE ? diff : -diff) + TEMPO_BONUS;
};

/**
 * Children as packed ints (orderValue * 256 + code), sorted best-first.
 * code = stableIdx * 3 + rotation.
 */
YammaSearch.prototype.genChildren = function(ply) {
	const killers = this.killers[ply];
	const k0 = killers ? killers[0] : -1;
	const k1 = killers && killers.length > 1 ? killers[1] : -1;
	const children = [];
	for (const pos of this.open) {
		const base = pos.staticOrder;
		const codeBase = pos.stableIdx * 3;
		for (let rotation = 0; rotation < 3; rotation++) {
			const code = codeBase + rotation;
			let order = base + Math.min(this.history[code], HISTORY_ORDER_CAP);
			if (code === k0 || code === k1) {
				order += KILLER_ORDER_BONUS;
			}
			children.push((order | 0) * 256 + code);
		}
	}
	children.sort((a, b) => b - a);
	return children;
};

YammaSearch.prototype.recordCutoff = function(ply, code, depth) {
	this.history[code] += depth * depth;
	let killers = this.killers[ply];
	if (!killers) {
		killers = this.killers[ply] = [];
	}
	if (killers[0] !== code) {
		killers[1] = killers[0];
		killers[0] = code;
	}
};

YammaSearch.prototype.negamax = function(sideColorInt, ply, depth, alpha, beta) {
	this.nodeCount++;
	if ((this.nodeCount & 1023) === 0 && Date.now() > this.deadline) {
		this.stopped = true;
	}
	if (this.stopped) {
		return 0;
	}

	if (this.open.length === 0) {
		return 0; // Board full: draw
	}

	const oppColorInt = 3 - sideColorInt;
	const effColorInt = this.placementColorAt(ply, sideColorInt);
	const undo = this.undoSlots[ply];
	let best = -Infinity;

	if (depth <= 1) {
		// Leaf parent: every child is terminal-checked + evaluated; move
		// ordering doesn't pay for itself here, so skip sorting entirely.
		const snapshot = this.open.slice();
		for (const pos of snapshot) {
			for (let rotation = 0; rotation < 3; rotation++) {
				this._place(pos, rotation, effColorInt, undo);
				const winnerColorInt = this.winnerAfterPlacement(undo, effColorInt);
				let score;
				if (winnerColorInt !== EMPTY) {
					score = winnerColorInt === sideColorInt ? WIN_SCORE - ply : -(WIN_SCORE - ply);
				} else {
					score = -this.evaluate(oppColorInt);
				}
				this.unplace(undo);

				if (score > best) {
					best = score;
				}
				if (best > alpha) {
					alpha = best;
				}
				if (alpha >= beta) {
					return best;
				}
			}
		}
		return best;
	}

	const children = this.genChildren(ply);

	for (const packed of children) {
		const code = packed & 255;
		const posIdx = (code / 3) | 0;
		const rotation = code - posIdx * 3;
		const pos = this.positions[posIdx];

		this._place(pos, rotation, effColorInt, undo);
		const winnerColorInt = this.winnerAfterPlacement(undo, effColorInt);
		let score;
		if (winnerColorInt !== EMPTY) {
			score = winnerColorInt === sideColorInt ? WIN_SCORE - ply : -(WIN_SCORE - ply);
		} else {
			score = -this.negamax(oppColorInt, ply + 1, depth - 1, -beta, -alpha);
		}
		this.unplace(undo);

		if (this.stopped) {
			return best === -Infinity ? 0 : best;
		}
		if (score > best) {
			best = score;
		}
		if (best > alpha) {
			alpha = best;
		}
		if (alpha >= beta) {
			this.recordCutoff(ply, code, depth);
			break;
		}
	}

	return best;
};

/**
 * Iterative-deepening search. Returns { move, score, depth } or null if no
 * moves. Scores are from myColor's perspective; >= DECISIVE_SCORE means a
 * forced win. myColor is a color name (PLAYER.WHITE / PLAYER.BLUE).
 */
YammaSearch.prototype.findBest = function(myColor, timeLimitMs, maxDepth) {
	this.deadline = Date.now() + timeLimitMs;
	this.stopped = false;

	if (this.open.length === 0) {
		return null;
	}

	const myColorInt = colorToInt(myColor);
	const effColorInt = this.placementColorAt(0, myColorInt);
	const oppColorInt = 3 - myColorInt;

	// Root children as objects so scores persist across iterations
	const rootChildren = [];
	for (const pos of this.open.slice()) {
		for (let rotation = 0; rotation < 3; rotation++) {
			rootChildren.push({
				move: { row: pos.row, col: pos.col, level: pos.level, rotation },
				pos,
				rotation,
				score: pos.staticOrder
			});
		}
	}
	rootChildren.sort((a, b) => b.score - a.score);

	const rootUndo = this.undoSlots[0];

	// Immediate win shortcut
	for (const child of rootChildren) {
		this._place(child.pos, child.rotation, effColorInt, rootUndo);
		const winnerColorInt = this.winnerAfterPlacement(rootUndo, effColorInt);
		this.unplace(rootUndo);
		if (winnerColorInt === myColorInt) {
			return { move: child.move, score: WIN_SCORE, depth: 1 };
		}
	}

	const depthLimit = Math.min(maxDepth, this.countEmptyCells());

	let best = null;
	let completedDepth = 0;

	for (let depth = 1; depth <= depthLimit; depth++) {
		let iterBest = null;
		let alpha = -Infinity;

		for (const child of rootChildren) {
			this._place(child.pos, child.rotation, effColorInt, rootUndo);
			const winnerColorInt = this.winnerAfterPlacement(rootUndo, effColorInt);
			let score;
			if (winnerColorInt !== EMPTY) {
				score = winnerColorInt === myColorInt ? WIN_SCORE - 1 : -(WIN_SCORE - 1);
			} else if (depth === 1) {
				score = -this.evaluate(oppColorInt);
			} else {
				score = -this.negamax(oppColorInt, 1, depth - 1, -Infinity, -alpha);
			}
			this.unplace(rootUndo);

			if (this.stopped && depth > 1) {
				break; // Discard the partially searched child
			}
			child.score = score;
			if (!iterBest || score > iterBest.score) {
				iterBest = { move: child.move, score, depth };
			}
			if (score > alpha) {
				alpha = score;
			}
		}

		if (!this.stopped) {
			best = iterBest;
			completedDepth = depth;
			// Order the next iteration by this iteration's scores
			rootChildren.sort((a, b) => b.score - a.score);
			if (Math.abs(best.score) >= DECISIVE_SCORE) {
				break; // Forced result found; no need to search deeper
			}
		} else {
			// Accept a partial result only if it found a forced win,
			// or if we have nothing at all yet.
			if (iterBest && (best === null || iterBest.score >= DECISIVE_SCORE)) {
				best = iterBest;
			}
			break;
		}
	}

	if (best) {
		best.depth = completedDepth || best.depth;
	}
	return best;
};

YammaSearch.prototype.countEmptyCells = function() {
	let total = 0;
	for (let level = 0; level < this.board.maxLevels; level++) {
		const rows = this.board.getRowsAtLevel(level);
		total += (rows * (rows + 1)) / 2;
	}
	return total - this.board.getAllCubes().length;
};

export function YammaStrategicAI(timeLimitMs, maxDepth) {
	this.timeLimitMs = timeLimitMs || 1500;
	this.maxDepth = maxDepth || 20;
}

YammaStrategicAI.prototype.getName = function() {
	return "Yamma Strategic AI";
};

YammaStrategicAI.prototype.getMessage = function() {
	return "This AI searches several moves ahead across all three viewing angles, "
		+ "spotting wins, forced blocks, and double threats. A challenging opponent!";
};

YammaStrategicAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

YammaStrategicAI.prototype.getMove = function(game, moveNum) {
	const myColor = this.player === HOST ? PLAYER.WHITE : PLAYER.BLUE;
	const swapRuleActive = gameOptionEnabled(YAMMA_SWAP_RULE);
	const moveCount = game.moveCount || 0;

	const pieRuleAvailable = this.player === GUEST
		&& gameOptionEnabled(YAMMA_PIE_RULE)
		&& moveCount === 1
		&& !!game.firstCubePos;

	const mainBudget = pieRuleAvailable ? Math.floor(this.timeLimitMs * 0.6) : this.timeLimitMs;

	const search = new YammaSearch(game.board.getCopy(), moveCount, swapRuleActive);
	const result = search.findBest(myColor, mainBudget, this.maxDepth);
	if (!result) {
		return null;
	}

	// Pie Rule: compare claiming Host's first cube against our best normal move.
	if (pieRuleAvailable && result.score < DECISIVE_SCORE) {
		const swappedBoard = game.board.getCopy();
		swappedBoard.swapCubeOwner(game.firstCubePos.row, game.firstCubePos.col, game.firstCubePos.level);
		const swapSearch = new YammaSearch(swappedBoard, moveCount + 1, swapRuleActive);
		const hostResult = swapSearch.findBest(PLAYER.WHITE, this.timeLimitMs - mainBudget, this.maxDepth);
		if (hostResult && -hostResult.score > result.score) {
			return new YammaNotationMove('G:SWAP');
		}
	}

	const notationBuilder = new YammaNotationBuilder();
	notationBuilder.setPoint(result.move.row, result.move.col, result.move.level, result.move.rotation);
	return notationBuilder.getMove(this.player);
};
