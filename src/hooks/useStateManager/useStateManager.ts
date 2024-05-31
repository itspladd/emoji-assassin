import type { AppState, StateManagerReturn } from "@customTypes/stateManagement";

import { useReducer } from "react";
import reducer from "./reducer";

import { socket } from '../../socket/client';
import { createRoomActions } from "./roomStateManager";
import { createSocketActions } from "./socketStateManager";
import { createEventLogActions } from "./eventLogStateManager";
import { createGameActions } from "./gameStateManager";
import { createDebugActions } from "./debugActions";

const initialState:AppState = {
  socket: {
    socketInstance: socket,
    connected: false
  },
  room: {
    roomId: null,
    playersInRoom: {},
  },
  eventLog: [],
  game: {
    tiles: [],
    status: "notStarted",
    currentPlayer: ""
  }
}

/**
 * A hook that abstracts state management away from the components.
 * Within the hook, we define actions that manipulate the state and accessors to retrieve information from state.
 * The state itself is not returned, so components don't access the state directly.
 * @returns 
 */
export default function useStateManager():StateManagerReturn {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const actions = {
    debug: createDebugActions(/* dispatch, */ socket),
    room: createRoomActions(dispatch, socket),
    socket: createSocketActions(dispatch, socket),
    eventLog: createEventLogActions(dispatch),
    game: createGameActions(dispatch, /* socket */),
  }
  
  const accessors = {
    roomId: () => state.room.roomId,
    allPlayers: () => state.room.playersInRoom,
    localPlayer: () => state.room.playersInRoom[state.socket.socketInstance.id || ""],
    player: (id: string) => state.room.playersInRoom[id] ?? null,
    socketConnected: () => state.socket.connected,
    socket: () => state.socket.socketInstance,
    eventLog: () => state.eventLog,
    tiles: () => state.game.tiles,
    gameStarted: () => state.game.status !== "notStarted",
    gameStatus: () => state.game.status,
    currentPlayer: () => state.game.currentPlayer
  }

  return {
    actions,
    accessors
  }
}