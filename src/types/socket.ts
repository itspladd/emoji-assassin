import type { Socket as ServerSocket, Server } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client"
import type { ClientPlayerInfo, PlayerName } from "./players";
import type { RoomId, RoomState, RoomStatus } from "./rooms";
import type { ClientGameState } from "./game";

/** Socket.IO event maps */
interface ClientToServerDebugEvents {
  debug_readyAll: (roomId: RoomState['roomId']) => void;
}

export interface ClientToServerEvents extends ClientToServerDebugEvents {
  connect: () => void;
  joinRoom: (roomId:RoomId) => void;
  changeName: () => void;
  toggleReady: () => void;
  endTurn: () => void;
  tileClick: (row:number, column: number) => void;
}

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  playerJoined: (player:ClientPlayerInfo) => void;
  playerLeft: (playerId:string) => void;
  playerChangedName: (playerId:string, name:PlayerName) => void;
  playerHitBomb: (playerId:string, location:[number, number] | null) => void;
  syncRoomAndGameState: (room:RoomState, game:ClientGameState) => void;
  roomStatusChange: (status: RoomStatus) => void;
  playerToggledReady: (playerId: string, readyState: boolean) => void;
  gameStart: (game:ClientGameState) => void;
  gameStateChange: (game:Partial<ClientGameState>) => void;
  setFavoriteTile: (row:number, column: number) => void;
  knownSafeTilesUpdate: (locations: [number, number][]) => void;
}

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents>
export type CustomServerSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents>
export type CustomClientSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>

/** Client-side state management types */
export interface SocketState {
  connected: boolean,
  socketInstance: CustomClientSocket,
}

export type SocketStateDispatchType = 
  "set_connection_status"

export interface SocketStateActions {
  connect: () => void,
  disconnect: () => void
}

/** Server-side types */

/** Shared types */