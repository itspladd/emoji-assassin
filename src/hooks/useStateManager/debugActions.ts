import type { DebugActions } from "@customTypes/debug";
import type { CustomClientSocket } from "@customTypes/socket";

export function createDebugActions(
  // dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) : DebugActions {
  const readyAll = (roomId: string) => {
    socket.emit("debug_readyAll", roomId)
  }

  return {
    readyAll
  }
}