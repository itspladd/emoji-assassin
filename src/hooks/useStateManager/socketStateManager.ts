import type { Dispatch } from "react";
import type { CustomClientSocket, SocketStateActions, SocketStateDispatchType } from "@customTypes/socket";
import type { AppState, ReducerActionPayload, ReducerDispatchFunctionList } from "@customTypes/stateManagement";

import { stateChangeError } from "../../helpers/logging";

const set_connection_status = (state:AppState, data?: { newStatus?: boolean }) => {
  if (typeof data?.newStatus !== 'boolean') {
    return stateChangeError("Attempted to set socket connection status with invalid payload.", state, data)
  }
  return {
    ...state,
    socket: {
      ...state.socket,
      connected: data.newStatus
    }
  }
}

// These functions actually go into the reducer.
export const SocketStateDispatchFunctions:ReducerDispatchFunctionList<SocketStateDispatchType> = {
  set_connection_status
}

// User-friendly state management functions so we don't have to use dispatch in components.
export const createSocketActions = (
  dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) : SocketStateActions => {

  // Open the socket connection and set the connection status.
  const connect = () => {
    if (!socket.connected) socket.connect()
    dispatch({ type: 'set_connection_status', data: { newStatus: true }})
  }

  // Disconnect the socket and set the connection status.
  const disconnect = () => {
    if (socket.connected) socket.disconnect()
    dispatch({ type: 'set_connection_status', data: { newStatus: false }})
  }

  return {
    connect,
    disconnect
  }
}

