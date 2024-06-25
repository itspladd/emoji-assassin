import type { PrivateClientPlayerInfo } from "./players"
import type GameTile from "../classes/GameTile";

/** Shared types */
export type GameStatus = 
  "notStarted"
  | "chooseFavoriteTiles"
  | "running"
  | "gameOver"

export type TileContents = 
  "empty"
  | "bomb"

// Client-side game knowledge that all players have
export interface PublicClientGameState {
  tiles: GameTile[];
  status: GameStatus;
  currentPlayer: string;
}

// Full client-side game state, including public and private info
export type ClientGameState = PublicClientGameState & {
  privateInfo: PrivateClientPlayerInfo
}

/** Server-side-only types */
export type GameStatusOrder = Record<GameStatus, GameStatus[]>

/** Client-side-only types */
export interface ClientGameStateActions {
  setTiles: (tiles: GameTile[]) => void;
  setPublicGameState: (game:PublicClientGameState) => void;
  updateGameState: (game:Partial<ClientGameState>) => void;
  setFavoriteTile: (row:number, column:number) => void
  endTurn: () => void;
  tileClick: (row:number, column: number, gameStatus:GameStatus) => void;
}

export type ClientGameStateDispatchType = 
  "set_tiles"
  | "set_game_state"
  | "update_game_state"
  | "set_favorite_tile"