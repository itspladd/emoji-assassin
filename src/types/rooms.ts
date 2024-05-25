import type { ClientPlayerInfo, ClientPlayerList } from "./players";

/** Client-side state management types */
export interface RoomState {
  roomId: string | null,
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
  joinRoom: (id:string) => void,
  addPlayer: (player:ClientPlayerInfo) => void,
  removePlayer: (id:string) => void,
  editPlayer: (id:string, newData:Partial<ClientPlayerInfo>) => void,
  changeName: () => void,
  setRoomState: (room:RoomState) => void
}
/** Server-side types */

/** Shared types */