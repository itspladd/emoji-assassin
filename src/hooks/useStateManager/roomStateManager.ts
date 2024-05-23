import type { ClientPlayerInfo } from "@customTypes/players";
import type { RoomActions, RoomStateDispatchType } from "@customTypes/rooms";
import type { AppState, ReducerDispatchFunctionList, ReducerActionPayload } from "@customTypes/stateManagement";

import { stateChangeError } from "../../helpers/logging";
import type { Dispatch } from "react";

const set_room_id = (state:AppState, data?: { roomId?: string | null}) => {
  if (!data?.roomId && data?.roomId !== null && typeof data?.roomId !== "string") {
    return stateChangeError("Attempted to set room ID to invalid value", state, data)
  }
  return {
    ...state,
    room: {
      ...state.room,
      roomId: data.roomId
    }
  }
}

const add_player = (state:AppState, data?: { player?: ClientPlayerInfo}) => {
  if (!state?.room?.roomId) {
    return stateChangeError("Attempted to add a player to a room while no room ID is set.", state)
  }
  if (!data?.player?.id) {
    return stateChangeError("Attempted to add a player to a room with bad input data.", state, data)
  }
  return {
    ...state,
    room: {
      ...state.room,
      playersInRoom: {
        ...state.room.playersInRoom,
        [data.player.id]: data.player
      }
    }
  }
}

const remove_player = (state:AppState, data?: { playerId?: string}) => {
  if (!state?.room?.roomId) {
    return stateChangeError("Attempted to remove a player from a room while no room ID is set.", state)
  }
  if (!data?.playerId) {
    return stateChangeError("Attempted to remove a player from a room, but no ID was provided.", state, data)
  }
  if (!state.room.playersInRoom?.[data.playerId]) {
    return stateChangeError("Attempted to remove a player from a room, but the player is not in the room.", state, data)
  }
  const playersInRoom = { ...state.room.playersInRoom }
  delete playersInRoom[data.playerId]
  return {
    ...state,
    room: {
      ...state.room,
      playersInRoom
    }
  }
}

const edit_player = (state:AppState, data?: { playerId?: string, newPlayerData?: Partial<ClientPlayerInfo>}) => {
  if (!state?.room?.roomId) {
    return stateChangeError("Attempted to edit a player in a room while no room ID is set.", state)
  }
  if (!data?.playerId) {
    return stateChangeError("Attempted to edit a player, but no ID was provided.", state, data)
  }
  if (!state.room.playersInRoom?.[data.playerId]) {
    return stateChangeError("Attempted to edit a player, but the player is not in the room.", state, data)
  }

  const playerData = { 
    ...state.room.playersInRoom[data.playerId],
    ...data.newPlayerData
  }

  const playersInRoom = {
    ...state.room.playersInRoom,
    [data.playerId]: playerData
  }

  return {
    ...state,
    room: {
      ...state.room,
      playersInRoom
    }
  }
}

// These functions actually go into the reducer.
export const RoomStateDispatchFunctions:ReducerDispatchFunctionList<RoomStateDispatchType> = {
  set_room_id,
  add_player,
  remove_player,
  edit_player
}

// User-friendly state management functions so we don't have to use dispatch in components.
export const createRoomActions = (dispatch: Dispatch<ReducerActionPayload>):RoomActions => {
  const leaveRoom = () => {
    dispatch({type: 'set_room_id', data: {roomId: null}})
  }
  
  const joinRoom = (roomId: string) => {
    dispatch({type: 'set_room_id', data: {roomId}})
  }

  const addPlayer = (player: ClientPlayerInfo) => {
    dispatch({type: 'add_player', data: { player }})
  }

  const removePlayer = (playerId: string) => {
    dispatch({type: 'remove_player', data: { playerId }})
  }

  const editPlayer = (playerId: string, newPlayerData: Partial<ClientPlayerInfo>) => {
    dispatch({type: 'edit_player', data: { playerId, newPlayerData}})
  }

  return {
    leaveRoom,
    joinRoom,
    addPlayer,
    removePlayer,
    editPlayer
  }
}
