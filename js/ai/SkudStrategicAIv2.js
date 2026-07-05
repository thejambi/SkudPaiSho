/**
 * SkudStrategicAIv2 - Enhanced Strategic AI for Skud Pai Sho
 *
 * A much stronger opponent than the "automatic opponent" (SkudAIv1):
 *
 * - Full legal move enumeration through the game's own move-reveal logic,
 *   so gates, Pond planting, trapped/drained tiles, disharmony ("clashing")
 *   restrictions, and Rock-blocked lines are all respected.
 * - Real Harmony Bonus play: bonus Basic/Special Flower plants (respecting
 *   the gate-control planting rule) and targeted Accent Tile placements
 *   (Knotweed drains, Rock line-blocks, Boat removal, Wheel rotations).
 * - Rich position evaluation centered on an angular "ring progress" metric:
 *   how much of a full circle around the board center a player's connected
 *   harmony chains cover. Also considers harmonies crossing midlines (the
 *   end-of-game tiebreaker), captures, drained/trapped tiles, and tile
 *   development.
 * - Two-ply search: each candidate move is tested against the opponent's
 *   best reply, with early pruning and a time budget.
 *
 * Every move is constructed as notation text and parsed with
 * SkudPaiShoNotationMove, so simulation and the real game always agree.
 */

import {
	ACCENT_TILE,
	BASIC_FLOWER,
	BOAT,
	KNOTWEED,
	ROCK,
	SPECIAL_FLOWER,
	WHEEL,
} from '../GameData';
import { newKnotweedRules, simpleCanonRules } from '../skud-pai-sho/SkudPaiShoRules';
import { GUEST, HOST, RowAndColumn } from '../CommonNotationObjects';
import { GATE, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { SkudPaiShoNotationMove } from '../skud-pai-sho/SkudPaiShoGameNotation';

const WIN_SCORE = 1000000;
const ALT_WIN_SCORE = 800000;
const TIE_SCORE = 100000;
const LOSS_THRESHOLD = -900000;

// A Harmony Bonus is worth roughly this much (used as a proxy when we don't
// expand the opponent's bonus options move-by-move).
const OPPONENT_BONUS_PENALTY = 45;

export function SkudStrategicAIv2(timeLimitMs) {
	this.player = null;
	this.moveNum = 0;
	this.timeLimitMs = timeLimitMs || 2800;
}

SkudStrategicAIv2.prototype.getName = function() {
	return "Skud Pai Sho Strategic AI";
};

SkudStrategicAIv2.prototype.getMessage = function() {
	return "A much stronger opponent that plans ahead: it builds toward Harmony Rings, "
		+ "uses Harmony Bonuses to plant and to disrupt with Accent Tiles, and considers "
		+ "your best reply to each of its moves. A real challenge!";
};

SkudStrategicAIv2.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

SkudStrategicAIv2.prototype.getOpponent = function() {
	return this.player === GUEST ? HOST : GUEST;
};

/* parameters are copies of the real game, so we can simulate freely. */
SkudStrategicAIv2.prototype.getMove = function(game, moveNum) {
	this.moveNum = moveNum;
	this.deadline = Date.now() + this.timeLimitMs;

	// Move 0: Accent tile selection
	if (moveNum === 0) {
		return this.selectAccentTiles(game);
	}

	// Phase A: enumerate and evaluate all base moves
	const candidates = [];
	const baseMoves = this.generateMoves(game, this.player, moveNum);

	for (const moveText of baseMoves) {
		const result = this.simulateAndEvaluate(game, moveText);
		if (!result) {
			continue;
		}
		if (result.score >= WIN_SCORE) {
			return result.move; // Immediate win
		}
		candidates.push(result);
	}

	if (candidates.length === 0) {
		return null;
	}

	candidates.sort((a, b) => b.score - a.score);

	// Phase A2: expand Harmony Bonus variants for the best bonus-eligible moves
	const bonusVariants = this.expandBonusVariants(game, candidates);
	for (const variant of bonusVariants) {
		if (variant.score >= WIN_SCORE) {
			return variant.move;
		}
		candidates.push(variant);
	}
	candidates.sort((a, b) => b.score - a.score);

	// Phase B: test top candidates against the opponent's best reply
	const best = this.searchOpponentReplies(game, candidates);

	return best ? best.move : candidates[0].move;
};

/** Simulate a notation move text; returns { move, sim, score, bonusAllowed } or null. */
SkudStrategicAIv2.prototype.simulateAndEvaluate = function(game, moveText) {
	const move = new SkudPaiShoNotationMove(moveText);
	if (!move.isValidNotation()) {
		return null;
	}

	const sim = game.getCopy();
	let bonusAllowed = false;
	try {
		bonusAllowed = sim.runNotationMove(move) === true;
	} catch (error) {
		return null; // Never let a bad simulation break the game
	}

	const score = this.evaluate(sim) + Math.random() * 0.5;
	return { move, sim, score, bonusAllowed, moveText };
};

/* ===================== ACCENT TILE SELECTION ===================== */

SkudStrategicAIv2.prototype.selectAccentTiles = function(game) {
	const tilePile = this.getTilePile(game, this.player);
	const available = [];
	for (const tile of tilePile) {
		if (tile.type === ACCENT_TILE) {
			available.push(tile.code);
		}
	}

	// Knotweed drains enemy harmonies, Rock denies whole lines, Boat answers
	// enemy Accent Tiles, and a second Knotweed keeps up the pressure.
	const preferenceOrder = ['K', 'R', 'B', 'K', 'W', 'W', 'B', 'R', 'M', 'P', 'T'];
	const numToSelect = simpleCanonRules ? 2 : 4;

	const chosen = [];
	for (const pref of preferenceOrder) {
		if (chosen.length >= numToSelect) break;
		const idx = available.indexOf(pref);
		if (idx >= 0) {
			chosen.push(pref);
			available.splice(idx, 1);
		}
	}
	while (chosen.length < numToSelect && available.length > 0) {
		chosen.push(available.splice(0, 1)[0]);
	}

	return new SkudPaiShoNotationMove("0" + this.player.charAt(0) + "." + chosen.join());
};

/* ===================== MOVE GENERATION ===================== */

/** All base move texts (plants + arranges) for a player. */
SkudStrategicAIv2.prototype.generateMoves = function(game, player, moveNum) {
	const moveTexts = [];
	this.addPlantMoveTexts(moveTexts, game, player, moveNum);
	this.addArrangeMoveTexts(moveTexts, game, player, moveNum);
	return moveTexts;
};

SkudStrategicAIv2.prototype.addPlantMoveTexts = function(moveTexts, game, player, moveNum) {
	const tilePile = this.getTilePile(game, player);
	const seenCodes = [];

	for (const tile of tilePile) {
		if (tile.type !== BASIC_FLOWER || seenCodes.includes(tile.code)) {
			continue;
		}
		seenCodes.push(tile.code);

		// Matches how the UI opens gates (moveNum * 2 handles the Guest's
		// first-plant restriction to the Guest gate).
		game.revealOpenGates(player, tile, moveNum * 2, true);
		const endPoints = this.collectPossibleMovePoints(game);
		game.hidePossibleMovePoints(true);

		for (const endPoint of endPoints) {
			const text = moveNum + player.charAt(0) + "." + tile.code
				+ "(" + this.pointText(endPoint) + ")";
			if (!moveTexts.includes(text)) {
				moveTexts.push(text);
			}
		}
	}
};

SkudStrategicAIv2.prototype.addArrangeMoveTexts = function(moveTexts, game, player, moveNum) {
	const startPoints = this.getMovableTilePoints(game, player);

	for (const startPoint of startPoints) {
		game.revealPossibleMovePoints(startPoint, true);
		const endPoints = this.collectPossibleMovePoints(game);
		game.hidePossibleMovePoints(true);

		for (const endPoint of endPoints) {
			const text = moveNum + player.charAt(0)
				+ ".(" + this.pointText(startPoint) + ")-(" + this.pointText(endPoint) + ")";
			if (!moveTexts.includes(text)) {
				moveTexts.push(text);
			}
		}
	}
};

/** Player's flower tiles that may move (trapped tiles cannot; drained tiles can under new Knotweed rules). */
SkudStrategicAIv2.prototype.getMovableTilePoints = function(game, player) {
	const points = [];
	const cells = game.board.cells;
	for (let row = 0; row < cells.length; row++) {
		for (let col = 0; col < cells[row].length; col++) {
			const point = cells[row][col];
			if (point.hasTile()
				&& point.tile.ownerName === player
				&& point.tile.type !== ACCENT_TILE
				&& !point.tile.trapped
				&& (newKnotweedRules || !point.tile.drained)) {
				points.push(point);
			}
		}
	}
	return points;
};

SkudStrategicAIv2.prototype.collectPossibleMovePoints = function(game) {
	const points = [];
	const cells = game.board.cells;
	for (let row = 0; row < cells.length; row++) {
		for (let col = 0; col < cells[row].length; col++) {
			if (cells[row][col].isType(POSSIBLE_MOVE)) {
				points.push(cells[row][col]);
			}
		}
	}
	return points;
};

SkudStrategicAIv2.prototype.pointText = function(boardPoint) {
	return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
};

/* ===================== HARMONY BONUS VARIANTS ===================== */

/**
 * For the strongest bonus-eligible arrange moves, build full move variants
 * with a Harmony Bonus attached (bonus plant or Accent Tile placement).
 */
SkudStrategicAIv2.prototype.expandBonusVariants = function(game, candidates) {
	const variants = [];
	let basesExpanded = 0;

	for (const candidate of candidates) {
		if (basesExpanded >= 5 || this.timeUp()) {
			break;
		}
		if (!candidate.bonusAllowed) {
			continue;
		}
		basesExpanded++;

		const bonusTexts = [];
		this.addBonusPlantTexts(bonusTexts, candidate);
		this.addBonusAccentTexts(bonusTexts, candidate);

		let variantSims = 0;
		for (const bonusText of bonusTexts) {
			if (variantSims >= 14 || this.timeUp()) {
				break;
			}
			const result = this.simulateAndEvaluate(game, candidate.moveText + bonusText);
			if (result && this.bonusTilePlaced(result)) {
				variants.push(result);
				variantSims++;
			}
		}
	}

	return variants;
};

/** Verify the bonus tile actually landed on the board (placement wasn't silently rejected). */
SkudStrategicAIv2.prototype.bonusTilePlaced = function(result) {
	const move = result.move;
	if (!move.hasHarmonyBonus() || !move.bonusEndPoint || !move.bonusEndPoint.rowAndColumn) {
		return true;
	}
	// Boat on an Accent Tile removes both tiles, so an empty point is expected
	if (move.bonusTileCode === 'B' && !move.boatBonusPoint) {
		return true;
	}
	const rowCol = move.bonusEndPoint.rowAndColumn;
	const point = result.sim.board.cells[rowCol.row][rowCol.col];
	return point.hasTile();
};

SkudStrategicAIv2.prototype.addBonusPlantTexts = function(bonusTexts, candidate) {
	const sim = candidate.sim;
	const pile = this.getTilePile(sim, this.player);
	const canPlantBasic = sim.playerCanBonusPlant(this.player);

	const codes = [];
	for (const tile of pile) {
		if (tile.type === BASIC_FLOWER && canPlantBasic && !codes.includes(tile.code)) {
			codes.push(tile.code);
		} else if (tile.code === 'L' && !codes.includes('L')) {
			// White Lotus harmonizes with every Basic Flower - premium bonus plant
			codes.push('L');
		}
	}
	if (codes.length === 0) {
		return;
	}

	// Open gates in the post-move position
	const sampleTile = pile.find(t => t.type === BASIC_FLOWER) || pile.find(t => t.code === 'L');
	sim.revealOpenGates(this.player, sampleTile, 99, true);
	const gatePoints = this.collectPossibleMovePoints(sim);
	sim.hidePossibleMovePoints(true);

	for (const code of codes) {
		for (const gatePoint of gatePoints) {
			bonusTexts.push("+" + code + "(" + this.pointText(gatePoint) + ")");
		}
	}
};

SkudStrategicAIv2.prototype.addBonusAccentTexts = function(bonusTexts, candidate) {
	const sim = candidate.sim;
	const pile = this.getTilePile(sim, this.player);
	const opponent = this.getOpponent();

	const accentCodes = [];
	for (const tile of pile) {
		if (tile.type === ACCENT_TILE && !accentCodes.includes(tile.code)) {
			accentCodes.push(tile.code);
		}
	}
	if (accentCodes.length === 0) {
		return;
	}

	const oppHarmonyPoints = this.getHarmonyTilePoints(sim, opponent);

	if (accentCodes.includes('K')) {
		for (const point of this.getKnotweedCandidatePoints(sim, oppHarmonyPoints, 6)) {
			bonusTexts.push("+K(" + this.pointText(point) + ")");
		}
	}
	if (accentCodes.includes('R')) {
		for (const point of this.getRockCandidatePoints(sim, oppHarmonyPoints, 6)) {
			bonusTexts.push("+R(" + this.pointText(point) + ")");
		}
	}
	if (accentCodes.includes('B')) {
		for (const point of this.getBoatCandidatePoints(sim, opponent, 4)) {
			bonusTexts.push("+B(" + this.pointText(point) + ")");
		}
	}
	if (accentCodes.includes('W')) {
		for (const point of this.getWheelCandidatePoints(sim, oppHarmonyPoints, 3)) {
			bonusTexts.push("+W(" + this.pointText(point) + ")");
		}
	}
};

/** Board points holding tiles that participate in the given player's harmonies. */
SkudStrategicAIv2.prototype.getHarmonyTilePoints = function(game, player) {
	const points = [];
	const seen = [];
	for (const harmony of game.board.harmonyManager.harmonies) {
		if (!harmony.hasOwner(player)) {
			continue;
		}
		for (const pos of [harmony.tile1Pos, harmony.tile2Pos]) {
			const key = pos.row * 17 + pos.col;
			if (!seen.includes(key)) {
				seen.push(key);
				points.push(game.board.cells[pos.row][pos.col]);
			}
		}
	}
	return points;
};

/** Knotweed: empty points draining the most opponent harmony tiles (and few of ours). */
SkudStrategicAIv2.prototype.getKnotweedCandidatePoints = function(game, oppHarmonyPoints, cap) {
	const board = game.board;
	const scored = [];
	const seen = [];

	for (const harmonyPoint of oppHarmonyPoints) {
		const rowCols = board.getSurroundingRowAndCols(harmonyPoint);
		for (const rowCol of rowCols) {
			const point = board.cells[rowCol.row][rowCol.col];
			const key = rowCol.row * 17 + rowCol.col;
			if (seen.includes(key) || !board.canPlaceKnotweed(point)) {
				continue;
			}
			seen.push(key);

			// Count flowers this would drain
			let value = 0;
			const around = board.getSurroundingRowAndCols(point);
			for (const aroundRowCol of around) {
				const aroundPoint = board.cells[aroundRowCol.row][aroundRowCol.col];
				if (aroundPoint.hasTile() && !aroundPoint.isType(GATE)
					&& aroundPoint.tile.type !== ACCENT_TILE) {
					value += aroundPoint.tile.ownerName === this.player ? -1 : 1;
				}
			}
			if (value > 0) {
				scored.push({ point, value });
			}
		}
	}

	scored.sort((a, b) => b.value - a.value);
	return scored.slice(0, cap).map(s => s.point);
};

/** Rock: empty points in the rows/columns with the most opponent harmonies. */
SkudStrategicAIv2.prototype.getRockCandidatePoints = function(game, oppHarmonyPoints, cap) {
	const board = game.board;
	const candidates = [];
	const seen = [];

	for (const harmonyPoint of oppHarmonyPoints) {
		// A Rock blocks every harmony in its row AND column, so points near
		// the opponent's harmony tiles are the strongest candidates.
		const tryPoints = [];
		for (let delta = -1; delta <= 1; delta += 2) {
			if (harmonyPoint.row + delta >= 0 && harmonyPoint.row + delta < 17) {
				tryPoints.push(board.cells[harmonyPoint.row + delta][harmonyPoint.col]);
			}
			if (harmonyPoint.col + delta >= 0 && harmonyPoint.col + delta < 17) {
				tryPoints.push(board.cells[harmonyPoint.row][harmonyPoint.col + delta]);
			}
		}
		for (const point of tryPoints) {
			const key = point.row * 17 + point.col;
			if (!seen.includes(key) && !point.isType(NON_PLAYABLE) && board.canPlaceRock(point)) {
				seen.push(key);
				candidates.push(point);
				if (candidates.length >= cap) {
					return candidates;
				}
			}
		}
	}

	return candidates;
};

/** Boat: opponent Accent Tiles on the board (both tiles get removed). */
SkudStrategicAIv2.prototype.getBoatCandidatePoints = function(game, opponent, cap) {
	const board = game.board;
	const candidates = [];
	const cells = board.cells;
	for (let row = 0; row < cells.length && candidates.length < cap; row++) {
		for (let col = 0; col < cells[row].length && candidates.length < cap; col++) {
			const point = cells[row][col];
			if (point.hasTile()
				&& point.tile.ownerName === opponent
				&& point.tile.type === ACCENT_TILE
				&& (point.tile.accentType === KNOTWEED || point.tile.accentType === ROCK)
				&& board.canPlaceBoat(point, { accentType: BOAT })) {
				candidates.push(point);
			}
		}
	}
	return candidates;
};

/** Wheel: playable points adjacent to opponent harmony tiles (rotation breaks lines). */
SkudStrategicAIv2.prototype.getWheelCandidatePoints = function(game, oppHarmonyPoints, cap) {
	const board = game.board;
	const candidates = [];
	const seen = [];

	for (const harmonyPoint of oppHarmonyPoints) {
		const rowCols = board.getSurroundingRowAndCols(harmonyPoint);
		for (const rowCol of rowCols) {
			const point = board.cells[rowCol.row][rowCol.col];
			const key = rowCol.row * 17 + rowCol.col;
			if (!seen.includes(key) && board.canPlaceWheel(point)) {
				seen.push(key);
				candidates.push(point);
				if (candidates.length >= cap) {
					return candidates;
				}
			}
		}
	}

	return candidates;
};

/* ===================== OPPONENT REPLY SEARCH ===================== */

/**
 * For the top candidates, find the opponent's best reply (worst case for us)
 * and pick the candidate with the best worst-case outcome.
 */
SkudStrategicAIv2.prototype.searchOpponentReplies = function(game, candidates) {
	const opponent = this.getOpponent();
	const maxCandidates = Math.min(candidates.length, 10);

	let best = null;

	for (let i = 0; i < maxCandidates; i++) {
		if (this.timeUp() && best) {
			break;
		}
		const candidate = candidates[i];

		const replyTexts = this.generateOpponentReplies(candidate.sim, opponent);
		let worstCase = Infinity;
		let refuted = false;

		for (const replyText of replyTexts) {
			if (this.timeUp() && best) {
				break;
			}
			const replyMove = new SkudPaiShoNotationMove(replyText);
			if (!replyMove.isValidNotation()) {
				continue;
			}

			const replySim = candidate.sim.getCopy();
			let replyBonus = false;
			try {
				replyBonus = replySim.runNotationMove(replyMove) === true;
			} catch (error) {
				continue;
			}

			let replyScore = this.evaluate(replySim);
			if (replyBonus) {
				// Opponent would also get a Harmony Bonus action
				replyScore -= OPPONENT_BONUS_PENALTY;
			}

			if (replyScore < worstCase) {
				worstCase = replyScore;
			}
			if (replyScore <= LOSS_THRESHOLD) {
				refuted = true;
				break; // Opponent wins after this candidate - abandon it
			}
			if (best && worstCase <= best.finalScore) {
				break; // Already worse than our best candidate - prune
			}
		}

		if (refuted) {
			continue;
		}
		if (worstCase === Infinity) {
			worstCase = candidate.score; // Opponent had no replies
		}

		const finalScore = worstCase + candidate.score * 0.0001; // Tiny tiebreak
		if (!best || finalScore > best.finalScore) {
			best = { move: candidate.move, finalScore };
		}
	}

	return best;
};

/**
 * Opponent replies: arranges only (plants can't create harmonies or captures,
 * so they're never the sharpest reply), ordered so that captures and moves
 * near our harmonies are simulated first for faster pruning.
 */
SkudStrategicAIv2.prototype.generateOpponentReplies = function(game, opponent) {
	const startPoints = this.getMovableTilePoints(game, opponent);
	const myHarmonyPoints = this.getHarmonyTilePoints(game, this.player);

	const myHarmonyRows = [];
	const myHarmonyCols = [];
	for (const point of myHarmonyPoints) {
		if (!myHarmonyRows.includes(point.row)) myHarmonyRows.push(point.row);
		if (!myHarmonyCols.includes(point.col)) myHarmonyCols.push(point.col);
	}

	const scored = [];
	for (const startPoint of startPoints) {
		game.revealPossibleMovePoints(startPoint, true);
		const endPoints = this.collectPossibleMovePoints(game);
		game.hidePossibleMovePoints(true);

		for (const endPoint of endPoints) {
			let order = 0;
			if (endPoint.hasTile()) {
				order = 2; // Captures first
			} else if (myHarmonyRows.includes(endPoint.row) || myHarmonyCols.includes(endPoint.col)) {
				order = 1; // Then moves onto our harmony lines
			}
			const text = "99" + opponent.charAt(0)
				+ ".(" + this.pointText(startPoint) + ")-(" + this.pointText(endPoint) + ")";
			scored.push({ text, order });
		}
	}

	scored.sort((a, b) => b.order - a.order);

	const capped = scored.slice(0, 140);
	return capped.map(s => s.text);
};

/* ===================== EVALUATION ===================== */

/** Score a game state from this AI's perspective. Higher is better for us. */
SkudStrategicAIv2.prototype.evaluate = function(game) {
	const me = this.player;
	const opponent = this.getOpponent();
	const board = game.board;
	const harmonyManager = board.harmonyManager;

	// Harmony Ring wins
	const iWin = board.winners.includes(me);
	const theyWin = board.winners.includes(opponent);
	if (iWin && !theyWin) return WIN_SCORE;
	if (theyWin && !iWin) return -WIN_SCORE;
	if (iWin && theyWin) return TIE_SCORE;

	// Out-of-tiles endgame (most harmonies crossing midlines)
	if (game.endGameWinners.length === 1) {
		return game.endGameWinners[0] === me ? ALT_WIN_SCORE : -ALT_WIN_SCORE;
	} else if (game.endGameWinners.length > 1) {
		return TIE_SCORE / 2;
	}

	let score = 0;

	// Harmonies
	const myHarmonies = harmonyManager.numHarmoniesForPlayer(me);
	const oppHarmonies = harmonyManager.numHarmoniesForPlayer(opponent);
	score += (myHarmonies - oppHarmonies) * 20;

	// Harmonies crossing midlines decide the out-of-tiles endgame
	const myMidline = harmonyManager.getNumCrossingMidlinesForPlayer(me);
	const oppMidline = harmonyManager.getNumCrossingMidlinesForPlayer(opponent);
	const myBasicsLeft = this.countBasicFlowers(this.getTilePile(game, me));
	const oppBasicsLeft = this.countBasicFlowers(this.getTilePile(game, opponent));
	const endgameNear = myBasicsLeft <= 2 || oppBasicsLeft <= 2;
	score += (myMidline - oppMidline) * (endgameNear ? 90 : 30);

	// Harmonies crossing the very center
	score += (harmonyManager.getNumCrossingCenterForPlayer(me)
		- harmonyManager.getNumCrossingCenterForPlayer(opponent)) * 8;

	// Ring progress: angular coverage around the center by harmony chains
	score += this.ringProgress(harmonyManager, me) * 1.5;
	score -= this.ringProgress(harmonyManager, opponent) * 1.6;

	// Board presence and tile states
	score += this.tilePresenceScore(board, me);
	score -= this.tilePresenceScore(board, opponent);

	// Harmony potential: compatible flower pairs close to each other
	score += this.harmonyPotential(board, me) * 1.0;
	score -= this.harmonyPotential(board, opponent) * 0.8;

	// Accent tiles in hand are future disruption/utility
	score += (this.countAccentTiles(this.getTilePile(game, me))
		- this.countAccentTiles(this.getTilePile(game, opponent))) * 6;

	return score;
};

/**
 * Angular coverage (in degrees, 0-360) of the player's best connected harmony
 * chain around the board center. A full ring around the center is the win
 * condition, so this measures literal progress toward winning.
 */
SkudStrategicAIv2.prototype.ringProgress = function(harmonyManager, player) {
	// Build connected components of the player's harmony graph (union-find)
	const parent = {};
	const find = (key) => {
		while (parent[key] !== key) {
			parent[key] = parent[parent[key]];
			key = parent[key];
		}
		return key;
	};
	const union = (a, b) => {
		const rootA = find(a);
		const rootB = find(b);
		if (rootA !== rootB) {
			parent[rootB] = rootA;
		}
	};

	const positions = {};
	for (const harmony of harmonyManager.harmonies) {
		if (!harmony.hasOwner(player)) {
			continue;
		}
		for (const pos of [harmony.tile1Pos, harmony.tile2Pos]) {
			const key = pos.row * 17 + pos.col;
			if (!(key in parent)) {
				parent[key] = key;
				positions[key] = pos;
			}
		}
		union(harmony.tile1Pos.row * 17 + harmony.tile1Pos.col,
			harmony.tile2Pos.row * 17 + harmony.tile2Pos.col);
	}

	// Group tile angles around the center by component
	const componentAngles = {};
	for (const key in positions) {
		const pos = positions[key];
		const x = pos.col - 8;
		const y = 8 - pos.row;
		if (x === 0 && y === 0) {
			continue; // Center point can't be part of a ring
		}
		const root = find(key);
		if (!componentAngles[root]) {
			componentAngles[root] = [];
		}
		componentAngles[root].push(Math.atan2(y, x) * 180 / Math.PI);
	}

	// Coverage = 360 minus the largest angular gap in the component
	let bestCoverage = 0;
	for (const root in componentAngles) {
		const angles = componentAngles[root];
		if (angles.length < 2) {
			continue;
		}
		angles.sort((a, b) => a - b);
		let maxGap = 360 - (angles[angles.length - 1] - angles[0]);
		for (let i = 1; i < angles.length; i++) {
			const gap = angles[i] - angles[i - 1];
			if (gap > maxGap) {
				maxGap = gap;
			}
		}
		const coverage = 360 - maxGap;
		if (coverage > bestCoverage) {
			bestCoverage = coverage;
		}
	}

	return bestCoverage;
};

/** Development, tile-state, and positioning score for one player's board tiles. */
SkudStrategicAIv2.prototype.tilePresenceScore = function(board, player) {
	let score = 0;
	const cells = board.cells;

	for (let row = 0; row < cells.length; row++) {
		for (let col = 0; col < cells[row].length; col++) {
			const point = cells[row][col];
			if (!point.hasTile() || point.tile.ownerName !== player) {
				continue;
			}
			const tile = point.tile;

			if (tile.type === ACCENT_TILE) {
				continue; // Accents scored via hand economy and their effects
			}

			if (point.isType(GATE)) {
				// Growing flowers do nothing and block bonus planting
				score += 1;
				continue;
			}

			score += 6; // A blooming flower on the board

			if (tile.drained) {
				score -= 8; // Drained flowers can't harmonize
			}
			if (tile.trapped) {
				score -= 10; // Trapped flowers can't move
			}

			// Mild pull toward the center, where midline crossings live
			const dist = Math.abs(row - 8) + Math.abs(col - 8);
			score += Math.max(0, (12 - dist)) * 0.3;
		}
	}

	return score;
};

/** Pairs of compatible (harmonizable) blooming flowers, weighted by proximity. */
SkudStrategicAIv2.prototype.harmonyPotential = function(board, player) {
	const flowers = [];
	const cells = board.cells;
	for (let row = 0; row < cells.length; row++) {
		for (let col = 0; col < cells[row].length; col++) {
			const point = cells[row][col];
			if (point.hasTile()
				&& point.tile.ownerName === player
				&& point.tile.type !== ACCENT_TILE
				&& !point.isType(GATE)
				&& !point.tile.drained) {
				flowers.push(point);
			}
		}
	}

	let potential = 0;
	for (let i = 0; i < flowers.length; i++) {
		for (let j = i + 1; j < flowers.length; j++) {
			if (flowers[i].tile.formsHarmonyWith(flowers[j].tile, false)) {
				const dist = Math.abs(flowers[i].row - flowers[j].row)
					+ Math.abs(flowers[i].col - flowers[j].col);
				potential += Math.max(0, 4 - dist * 0.25);
			}
		}
	}

	return potential;
};

/* ===================== HELPERS ===================== */

SkudStrategicAIv2.prototype.timeUp = function() {
	return Date.now() > this.deadline;
};

SkudStrategicAIv2.prototype.getTilePile = function(game, player) {
	return player === GUEST ? game.tileManager.guestTiles : game.tileManager.hostTiles;
};

SkudStrategicAIv2.prototype.countBasicFlowers = function(tilePile) {
	let count = 0;
	for (const tile of tilePile) {
		if (tile.type === BASIC_FLOWER) {
			count++;
		}
	}
	return count;
};

SkudStrategicAIv2.prototype.countAccentTiles = function(tilePile) {
	let count = 0;
	for (const tile of tilePile) {
		if (tile.type === ACCENT_TILE) {
			count++;
		}
	}
	return count;
};
