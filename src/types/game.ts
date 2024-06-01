import { PlayerRole, PrivateClientPlayerInfo } from "./players"

export type GameStatus = 
  "notStarted"
  | "running"
  | "gameOver"

export interface GameTile {
  image: string,
  description: string,
  row: number,
  column: number
}

// Client-side game knowledge that all players have
export interface PublicClientGameState {
  tiles: GameTile[],
  status: GameStatus,
  currentPlayer: string,
}

// Client-side game knowledge that only the local player has
export interface LocalClientGameState {
  myRole: PlayerRole
}

export type ClientGameState = PublicClientGameState & {
  privateInfo: PrivateClientPlayerInfo
}

export interface ClientGameStateActions {
  setTiles: (tiles: GameTile[]) => void,
  setPublicGameState: (game:PublicClientGameState) => void,
  updateGameState: (game:Partial<ClientGameState>) => void,
  endTurn: () => void
}

export type ClientGameStateDispatchType = 
  "set_tiles"
  | "set_game_state"
  | "update_game_state"