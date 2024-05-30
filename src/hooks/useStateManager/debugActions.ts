import { CustomClientSocket } from "@customTypes/socket";
import { ReducerActionPayload } from "@customTypes/stateManagement";
import { Dispatch } from "react";

export function createDebugActions(
  dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) {
  const readyAll = (roomId: string) => {
    socket.emit("debug_readyAll", roomId)
  }
}