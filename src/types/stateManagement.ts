import type { SocketStateActions, SocketState, SocketStateDispatchType } from "./socket"
import type { RoomActions, RoomState, RoomStateDispatchType } from "./rooms"
import type { EventLogActions, EventLogItem, EventLogStateDispatchType } from "./events"
import type { ClientGameState, ClientGameStateActions, ClientGameStateDispatchType } from "./game"
import type { DebugActions } from "./debug"
import type { ClientPlayerInfo, PrivateClientPlayerInfo } from "./players"

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
  debug: DebugActions,
  room: RoomActions,
  eventLog: EventLogActions,
  socket: SocketStateActions,
  game: ClientGameStateActions
}

export interface StateAccessors {
  socket: () => SocketState['socketInstance'];
  socketConnected: () => SocketState['connected'];
  roomId: () => RoomState['roomId'];
  roomStatus: () => RoomState['status'];
  allPlayers: () => RoomState['playersInRoom'];
  getPlayer: (id: string) => ClientPlayerInfo | null;
  currentPlayer: () => ClientPlayerInfo | null;
  playerInstructions: () => string;
  eventLog: () => AppState['eventLog'];
  tiles: () => ClientGameState['tiles'];
  gameStarted: () => boolean;
  gameStatus: () => ClientGameState['status'];
  myRole: () => PrivateClientPlayerInfo['myRole'];
  myFavoriteTile: () => PrivateClientPlayerInfo['myFavoriteTile'];
  localPlayerTurn: () => boolean;
  localPlayerActive: () => boolean;
  tileIsKnownSafe: (rowIn:number, colIn:number) => boolean;
  myKnownSafeTiles: () => PrivateClientPlayerInfo['myKnownSafeTiles'];
}

export type StateManagerReturn = {
  actions: StateActions,
  accessors: StateAccessors
}