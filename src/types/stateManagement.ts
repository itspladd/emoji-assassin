import type { SocketStateActions, SocketState, SocketStateDispatchType } from "./socket"
import type { RoomActions, RoomState, RoomStateDispatchType } from "./rooms"
import type { EventLogActions, EventLogItem, EventLogStateActionType } from "./events"

/** All types here should be client-side only. */
export type ReducerDispatchType = 
  SocketStateDispatchType |
  RoomStateDispatchType |
  EventLogStateActionType

type ReducerDispatchFunction = (state:AppState, data?:Record<string, any>) => AppState

// Use this type to bundle actions by category (e.g. an object containing all of the room actions by name)
export type ReducerDispatchFunctionList<DispatchType> = Record<Extract<DispatchType, ReducerDispatchType>, ReducerDispatchFunction>

export interface AppState {
  socket: SocketState,
  room: RoomState,
  eventLog: EventLogItem[]
}

export interface ReducerActionPayload {
  data?: Record<string, any>
  type: ReducerDispatchType
}

export interface StateActions {
  room: RoomActions,
  eventLog: EventLogActions,
  socket: SocketStateActions
}