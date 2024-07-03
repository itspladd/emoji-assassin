import type { AppState, StateManagerReturn } from "@customTypes/stateManagement";

import { useReducer } from "react";
import reducer from "./reducer";

import { socket } from '../../socket/client';
import { createRoomActions } from "./roomStateManager";
import { createSocketActions } from "./socketStateManager";
import { createEventLogActions } from "./eventLogStateManager";
import { createGameActions } from "./gameStateManager";
import { createDebugActions } from "./debugActions";
import { getPlayerInstructions } from "@helpers/instructions";

const initialState:AppState = {
  socket: {
    socketInstance: socket,
    connected: false
  },
  room: {
    roomId: null,
    status: "NOT_ENOUGH_PLAYERS",
    playersInRoom: {},
  },
  eventLog: [],
  game: {
    tiles: [],
    status: "notStarted",
    currentPlayerId: "",
    privateInfo: {
      myRole: null,
      myFavoriteTile: null,
      myKnownSafeTiles: null
    }
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
    game: createGameActions(dispatch, socket),
  }

  // Define access functions separately so they can refer to each other
  
  // Socket state data
  function getSocket() { return state.socket.socketInstance }
  function socketConnected() { return state.socket.connected }

  // Room data
  function roomId() { return state.room.roomId }
  function roomStatus() { return state.room.status }
  function allPlayers() { return state.room.playersInRoom }
  function getPlayer(id:string) { return state.room.playersInRoom[id] ?? null }
  function eventLog() { return state.eventLog }

  // Game state data
  function gameStatus() { return state.game.status }
  function gameStarted() { return gameStatus() !== "notStarted" }
  function currentPlayerId() { return state.game.currentPlayerId }
  function currentPlayer() { return getPlayer(currentPlayerId()) ?? null }
  function tiles() { return state.game.tiles }

  // Local player state data
  function localPlayerId() { return state.socket.socketInstance.id || ""}
  function localPlayerTurn() { return localPlayerId() === currentPlayerId() }
  function localPlayerReady() { return getPlayer(localPlayerId()).isReady}
  function myRole() { return state.game.privateInfo.myRole }
  function myFavoriteTile() { return state.game.privateInfo.myFavoriteTile }
  function myKnownSafeTiles() { return state.game.privateInfo.myKnownSafeTiles }
  function tileIsKnownSafe(rowIn:number, colIn:number) {
    const myKnownSafeTiles = state.game.privateInfo.myKnownSafeTiles
    return myKnownSafeTiles?.filter(([safeRow, safeCol]) => rowIn === safeRow && colIn === safeCol).length === 1
  }
  function playerInstructions() {
    return getPlayerInstructions({
      gameStatus: gameStatus(),
      playerRole: myRole(),
      isPlayerTurn: localPlayerTurn(),
      isPlayerReady: localPlayerReady()
    })
  }

  const accessors = {
    roomId,
    roomStatus,
    allPlayers,
    getPlayer,
    localPlayerId,
    localPlayerTurn,
    socketConnected,
    socket: getSocket,
    eventLog,
    tiles,
    gameStarted,
    gameStatus,
    currentPlayer,
    myRole,
    myFavoriteTile,
    tileIsKnownSafe,
    myKnownSafeTiles,
    playerInstructions,
  }

  return {
    actions,
    accessors
  }
}