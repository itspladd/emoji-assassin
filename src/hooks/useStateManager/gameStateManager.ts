import type { Dispatch } from "react";
import type { AppState, ReducerDispatchFunctionList, ReducerActionPayload } from "@customTypes/stateManagement";
import type { ClientGameState, ClientGameStateActions, ClientGameStateDispatchType, GameStatus, PublicClientGameState } from "@customTypes/game";
import type { CustomClientSocket } from "@customTypes/socket";
import type GameTile from "../../classes/GameTile";

import { stateChangeError } from "../../helpers/logging";

const set_tiles = (state: AppState, data?: { tiles?: GameTile[] }) => {
  if (!data?.tiles) {
    return stateChangeError("Attempted to set tiles with invalid tile data.", state, data)
  }
  const newTiles = [...data.tiles]

  return {
    ...state,
    game: {
      ...state.game,
      tiles: newTiles
    }
  }
}

const set_game_state = (state: AppState, data?: { game?: ClientGameState }) => {
  if (!data?.game) {
    return stateChangeError("Attempted to set game state with invalid game data.", state, data)
  }

  return {
    ...state,
    game: {
      ...data.game
    }
  }
}

/**
 * Very similar to set_game_state, but does not overwrite fields that aren't specified in the input data.
 * @param state 
 * @param data 
 * @returns 
 */
const update_game_state = (state: AppState, data?: { game?: Partial<ClientGameState> }) => {
  if (!data?.game) {
    return stateChangeError("Attempted to update game state with invalid game data.", state, data)
  }

  return {
    ...state,
    game: {
      ...state.game,
      ...data.game
    }
  }
}

const set_favorite_tile = (state: AppState, data?: {row?:number, column?: number}) => {
  if (!data) {
    return stateChangeError("Attempted to set favorite tile with bad data.", state, data)
  }

  const {row, column} = data
  if (typeof row === "undefined" || typeof column === "undefined") {
    return stateChangeError("Attempted to set favorite tile with bad data.", state, data)
  }

  const newFavoriteTile:[number, number] = [row, column]

  return {
    ...state,
    game: {
      ...state.game,
      privateInfo: {
        ...state.game.privateInfo,
        myFavoriteTile: newFavoriteTile
      }
    }
  }
}

const set_known_safe_tiles = (state: AppState, data?: {locations?:[number,number][]}) => {
  if (!data) {
    return stateChangeError("Attempted to set known safe tiles with bad data.", state, data)
  }
  const { locations } = data 
  const locationValid = (loc:unknown) => Array.isArray(loc) && loc.length === 2 && typeof loc[0] === "number" && typeof loc[1] === "number" 
  if (!Array.isArray(locations) || !locations.every(locationValid)) {
    return stateChangeError("Attempted to set known safe tiles with bad data.", state, data)
  }


  return {
    ...state,
    game: {
      ...state.game,
      privateInfo: {
        ...state.game.privateInfo,
        myKnownSafeTiles: [...locations]
      }
    }
  }
}

// These functions actually go into the reducer.
export const GameStateDispatchFunctions:ReducerDispatchFunctionList<ClientGameStateDispatchType> = {
  set_tiles,
  set_game_state,
  update_game_state,
  set_favorite_tile,
  set_known_safe_tiles,
}

// User-friendly state management functions so we don't have to use dispatch in components.
export const createGameActions = (
  dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) : ClientGameStateActions => {

  const setTiles = (tiles:GameTile[]) => {
    dispatch({type: 'set_tiles', data: {tiles}})
  }

  const setPublicGameState = (game:PublicClientGameState) => {
    console.log("setting game state")
    dispatch({type: 'set_game_state', data: {game}})
  }

  const updateGameState = (game:Partial<ClientGameState>) => {
    console.log("Updating game state with:", game)
    dispatch({type: 'update_game_state', data: {game}})
  }
  
  const setFavoriteTile = (row:number, column:number) => {
    dispatch({type: 'set_favorite_tile', data: {row, column}})
  }

  const setKnownSafeTiles = (locations: [number, number][]) => {
    dispatch({type: 'set_known_safe_tiles', data: {locations}})
  }

  const endTurn = () => {
    socket.emit("endTurn")
  }

  const tileClick = (row:number, column:number, gameStatus:GameStatus) => {
    const canClickTiles = gameStatus === "chooseFavoriteTiles" || gameStatus === "running"
    canClickTiles && socket.emit("tileClick", row, column)
  }

  return {
    setTiles,
    setPublicGameState,
    updateGameState,
    endTurn,
    tileClick,
    setFavoriteTile,
    setKnownSafeTiles,
  }
}

