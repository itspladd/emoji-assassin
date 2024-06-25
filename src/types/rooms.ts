import type { ClientPlayerInfo, ClientPlayerList } from "./players";

/** Shared types */
export type RoomId = string | null

/** Client-side state management types */
export interface RoomState {
  roomId: RoomId,
  playersInRoom: ClientPlayerList,
}

export type RoomStateDispatchType =
  "set_room_state" 
  |"set_room_id"
  | "add_player"
  | "remove_player"
  | "edit_player"

export interface RoomActions {
  leaveRoom: () => void,
  joinRoom: (id:RoomId) => void,
  addPlayer: (player:ClientPlayerInfo) => void,
  removePlayer: (id:string) => void,
  editPlayer: (id:string, newData:Partial<ClientPlayerInfo>) => void,
  changeName: () => void,
  toggleReady: () => void,
  setRoomState: (room:RoomState) => void
}
/** Server-side types */
