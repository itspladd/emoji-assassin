import type { Dispatch } from "react";
import type { AppState, ReducerDispatchFunctionList, ReducerActionPayload } from "@customTypes/stateManagement";
import type { ClientGameState, ClientGameStateActions, ClientGameStateDispatchType, GameTile } from "@customTypes/game";

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

// These functions actually go into the reducer.
export const GameStateDispatchFunctions:ReducerDispatchFunctionList<ClientGameStateDispatchType> = {
  set_tiles,
  set_game_state,
  update_game_state
}

// User-friendly state management functions so we don't have to use dispatch in components.
export const createGameActions = (
  dispatch: Dispatch<ReducerActionPayload>,
  // socket: CustomClientSocket
) : ClientGameStateActions => {

  const setTiles = (tiles:GameTile[]) => {
    dispatch({type: 'set_tiles', data: {tiles}})
  }

  const setGameState = (game:ClientGameState) => {
    console.log("setting game state")
    dispatch({type: 'set_game_state', data: {game}})
  }

  const updateGameState = (game:Partial<ClientGameState>) => {
    console.log("Updating game state with:", game)
    dispatch({type: 'update_game_state', data: {game}})
  }

  return {
    setTiles,
    setGameState,
    updateGameState
  }
}

