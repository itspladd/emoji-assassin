import type { ClientPlayerInfo, ClientPlayerList } from "./players";

/** Shared types */
export type RoomId = string | null

export type RoomStatus = 
  | "NOT_ENOUGH_PLAYERS"
  | "TOO_MANY_PLAYERS"
  | "NOT_ALL_PLAYERS_READY"
  | "GAME_CAN_START"
  | "GAME_RUNNING"

/** Client-side state management types */
export interface RoomState {
  roomId: RoomId;
  playersInRoom: ClientPlayerList;
  status: RoomStatus;
}

export type RoomStateDispatchType =
  "set_room_state" 
  |"set_room_id"
  | "add_player"
  | "remove_player"
  | "edit_player"
  | "set_room_status"

export interface RoomActions {
  leaveRoom: () => void,
  joinRoom: (id:RoomId) => void,
  addPlayer: (player:ClientPlayerInfo) => void,
  removePlayer: (id:string) => void,
  editPlayer: (id:string, newData:Partial<ClientPlayerInfo>) => void,
  changeName: () => void,
  toggleReady: () => void,
  setRoomState: (room:RoomState) => void,
  changeRoomStatus: (newStatus: RoomStatus) => void,
}

/** Server-side types */
