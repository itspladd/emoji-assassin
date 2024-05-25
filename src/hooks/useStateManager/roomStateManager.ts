import type { ClientPlayerInfo } from "@customTypes/players";
import type { RoomActions, RoomState, RoomStateDispatchType } from "@customTypes/rooms";
import type { AppState, ReducerDispatchFunctionList, ReducerActionPayload } from "@customTypes/stateManagement";
import type { Dispatch } from "react";

import { stateChangeError } from "../../helpers/logging";
import { CustomClientSocket } from "@customTypes/socket";

const set_room_state = (state:AppState, data?: { room?:RoomState }) => {
  if (!data?.room) {
    return stateChangeError("Attempted to set room data with invalid data", state, data)
  }
  
  return {
    ...state,
    room: {
      ...data.room
    }
  }
}

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
  edit_player,
  set_room_state
}

// User-friendly state management functions so we don't have to use dispatch in components.
export const createRoomActions = (
  dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) : RoomActions => {

  const setRoomState = (room:RoomState) => {
    dispatch({type: 'set_room_state', data: {room}})
  }

  const joinRoom = (roomId: string) => {
    if (!socket.connected) socket.connect()
    socket.emit("joinRoom", roomId)
    dispatch({type: 'set_room_id', data: {roomId}})
  }

  const leaveRoom = () => {
    dispatch({type: 'set_room_id', data: {roomId: null}})
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

  const changeName = async () => {
    // The player's name doesn't change locally until the socket broadcasts the change to all players
    socket.emit("changeName")
  }

  return {
    leaveRoom,
    joinRoom,
    addPlayer,
    removePlayer,
    editPlayer,
    changeName,
    setRoomState
  }
}

