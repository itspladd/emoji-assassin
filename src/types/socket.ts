import type { Socket } from "socket.io-client";

/** Client-side state management types */
export interface SocketState {
  connected: boolean,
  socketInstance: Socket,
}

export type SocketStateDispatchType = 
  "set_connection_status"

export interface SocketActions {
  connect: () => void,
  disconnect: () => void
}
/** Server-side types */

/** Shared types */