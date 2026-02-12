// Lazy-loads game controllers via dynamic import() for code splitting.
// Parcel automatically creates separate chunks for each import() call.

import { GameType } from './GameType';
import { debug } from './GameData';

export async function loadGameController(gameTypeId, gameContainerDiv, isMobile) {
	switch (gameTypeId) {
		case GameType.SkudPaiSho.id: {
			const { SkudPaiShoController } = await import("./skud-pai-sho/SkudPaiShoController");
			return new SkudPaiShoController(gameContainerDiv, isMobile);
		}
		case GameType.VagabondPaiSho.id: {
			const { VagabondController } = await import("./vagabond/VagabondController");
			return new VagabondController(gameContainerDiv, isMobile);
		}
		case GameType.SolitairePaiSho.id: {
			const { SolitaireController } = await import("./solitaire/SolitaireController");
			return new SolitaireController(gameContainerDiv, isMobile);
		}
		case GameType.CapturePaiSho.id: {
			const { CaptureController } = await import("./capture/CaptureController");
			return new CaptureController(gameContainerDiv, isMobile);
		}
		case GameType.SpiritPaiSho.id: {
			const { SpiritController } = await import("./spirit/SpiritController");
			return new SpiritController(gameContainerDiv, isMobile);
		}
		case GameType.StreetPaiSho.id: {
			const { StreetController } = await import("./street/StreetController");
			return new StreetController(gameContainerDiv, isMobile);
		}
		case GameType.Nick.id: {
			const { NickController } = await import("./nick/NickController");
			return new NickController(gameContainerDiv, isMobile);
		}
		case GameType.CoopSolitaire.id: {
			const { CoopSolitaireController } = await import("./cooperative-solitaire/CoopSolitaireController");
			return new CoopSolitaireController(gameContainerDiv, isMobile);
		}
		case GameType.Playground.id: {
			const { PlaygroundController } = await import("./playground/PlaygroundController");
			return new PlaygroundController(gameContainerDiv, isMobile);
		}
		case GameType.OvergrowthPaiSho.id: {
			const { OvergrowthController } = await import("./overgrowth/OvergrowthController");
			return new OvergrowthController(gameContainerDiv, isMobile);
		}
		case GameType.Undergrowth.id: {
			const { UndergrowthController } = await import("./undergrowth/UndergrowthController");
			return new UndergrowthController(gameContainerDiv, isMobile);
		}
		case GameType.Blooms.id: {
			const { BloomsController } = await import("./blooms/BloomsController");
			return new BloomsController(gameContainerDiv, isMobile);
		}
		case GameType.Meadow.id: {
			const { MeadowController } = await import("./meadow/MeadowController");
			return new MeadowController(gameContainerDiv, isMobile);
		}
		case GameType.Trifle.id: {
			const { TrifleController } = await import("./trifle/TrifleController");
			return new TrifleController(gameContainerDiv, isMobile);
		}
		case GameType.Hexentafl.id: {
			const { HexentaflController } = await import("./hexentafl/HexentaflController");
			return new HexentaflController(gameContainerDiv, isMobile);
		}
		case GameType.Adevar.id: {
			const { AdevarController } = await import("./adevar/AdevarController");
			return new AdevarController(gameContainerDiv, isMobile);
		}
		case GameType.Tumbleweed.id: {
			const { TumbleweedController } = await import("./tumbleweed/TumbleweedController");
			return new TumbleweedController(gameContainerDiv, isMobile);
		}
		case GameType.FirePaiSho.id: {
			const { FirePaiShoController } = await import("./fire-pai-sho/FirePaiShoController");
			return new FirePaiShoController(gameContainerDiv, isMobile);
		}
		case GameType.Ginseng.id: {
			const { GinsengController } = await import("./ginseng/GinsengController");
			return new GinsengController(gameContainerDiv, isMobile);
		}
		case GameType.GiniPaiSho.id: {
			const { GiniController } = await import("./gini/GiniController");
			return new GiniController(gameContainerDiv, isMobile);
		}
		case GameType.KeyPaiSho.id: {
			const { KeyPaiShoController } = await import("./key-pai-sho/KeyPaiShoController");
			return new KeyPaiShoController(gameContainerDiv, isMobile);
		}
		case GameType.BeyondTheMaps.id: {
			const { BeyondTheMapsController } = await import("./beyond-the-maps/BeyondTheMapsController");
			return new BeyondTheMapsController(gameContainerDiv, isMobile);
		}
		case GameType.GodaiPaiSho.id: {
			const { GodaiController } = await import("./godai/GodaiController");
			return new GodaiController(gameContainerDiv, isMobile);
		}
		case GameType.Yamma.id: {
			const { YammaController } = await import("./yamma/YammaController");
			return new YammaController(gameContainerDiv, isMobile);
		}
		case GameType.TicTacToe.id: {
			const { TicTacToeController } = await import("./tictactoe/TicTacToeController");
			return new TicTacToeController(gameContainerDiv, isMobile);
		}
		case GameType.Hex.id: {
			const { HexController } = await import("./hex/HexController");
			return new HexController(gameContainerDiv, isMobile);
		}
		case GameType.Paiko.id: {
			const { PaikoController } = await import("./paiko/PaikoController");
			return new PaikoController(gameContainerDiv, isMobile);
		}
		case GameType.Fanorona.id: {
			const { FanoronaController } = await import("./fanorona/FanoronaController");
			return new FanoronaController(gameContainerDiv, isMobile);
		}
		case GameType.UndergrowthBriar.id: {
			const { UndergrowthSimplicityController } = await import("./undergrowth-simplicity/UndergrowthSimplicityController");
			return new UndergrowthSimplicityController(gameContainerDiv, isMobile);
		}
		default:
			debug("Game Controller unavailable.");
			return undefined;
	}
}
