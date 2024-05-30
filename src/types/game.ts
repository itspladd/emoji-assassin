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

export interface ClientGameState {
  tiles: GameTile[],
  status: GameStatus
}

export interface ClientGameStateActions {
  setTiles: (tiles: GameTile[]) => void,
  setGameState: (game:ClientGameState) => void,
}

export type ClientGameStateDispatchType = 
  "set_tiles"
  | "set_game_state"