import type { Socket as ServerSocket, Server } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client"
import type { ClientPlayerInfo, PlayerName } from "./players";
import type { RoomState } from "./rooms";
import { ClientGameState } from "./game";

/** Socket.IO event maps */
export interface ClientToServerEvents {
  connect: () => void;
  joinRoom: (id:string) => void;
  changeName: () => void;
  toggleReady: () => void
}

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  playerJoined: (player:ClientPlayerInfo) => void;
  playerLeft: (playerId:string) => void;
  playerChangedName: (playerId:string, name:PlayerName) => void;
  syncRoomAndGameState: (room:RoomState, game:ClientGameState) => void;
  playerToggledReady: (playerId: string, readyState: boolean) => void;
  gameStart: (game:ClientGameState) => void
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