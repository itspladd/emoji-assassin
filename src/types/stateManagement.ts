import type { SocketStateActions, SocketState, SocketStateDispatchType } from "./socket"
import type { RoomActions, RoomState, RoomStateDispatchType } from "./rooms"
import type { EventLogActions, EventLogItem, EventLogStateDispatchType } from "./events"
import type { ClientGameState, ClientGameStateActions, ClientGameStateDispatchType } from "./game"
import { ClientPlayerInfo } from "./players"

/** All types here should be client-side only. */
export type ReducerDispatchType = 
  SocketStateDispatchType |
  RoomStateDispatchType |
  EventLogStateDispatchType |
  ClientGameStateDispatchType

type ReducerDispatchFunction = (state:AppState, data?:Record<string, any>) => AppState

// Use this type to bundle actions by category (e.g. an object containing all of the room actions by name)
export type ReducerDispatchFunctionList<DispatchType> = Record<Extract<DispatchType, ReducerDispatchType>, ReducerDispatchFunction>

export interface AppState {
  socket: SocketState,
  room: RoomState,
  eventLog: EventLogItem[],
  game: ClientGameState
}

export interface ReducerActionPayload {
  data?: Record<string, any>
  type: ReducerDispatchType
}

export interface StateActions {
  room: RoomActions,
  eventLog: EventLogActions,
  socket: SocketStateActions,
  game: ClientGameStateActions
}

export interface StateAccessors {
  roomId: () => RoomState['roomId'];
  allPlayers: () => RoomState['playersInRoom'];
  localPlayer: () => RoomState['playersInRoom'][string]
  player: (id: string) => ClientPlayerInfo | null;
  socketConnected: () => SocketState['connected'];
  socket: () => SocketState['socketInstance'];
  eventLog: () => AppState['eventLog'];
  tiles: () => ClientGameState['tiles'];
  gameStarted: () => boolean
}

export type StateManagerReturn = {
  actions: StateActions,
  accessors: StateAccessors
}