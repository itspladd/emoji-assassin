import type { DebugActions } from "@customTypes/debug";
import { RoomState } from "@customTypes/rooms";
import type { CustomClientSocket } from "@customTypes/socket";

import axios from "axios";

export function createDebugActions(
  // dispatch: Dispatch<ReducerActionPayload>,
  socket: CustomClientSocket
) : DebugActions {
  const readyAll = (roomId: RoomState['roomId']) => {
    socket.emit("debug_readyAll", roomId)
  }

  const joinDebugRoom = async () => {
    console.log("Joining debug room")
    const response:{data: {debugRoomId:string}} = await axios.get('/rooms/debug')
    const debugRoomId = response?.data?.debugRoomId

    if (!debugRoomId) {
      return console.error("Error: no debug room ID received. Response object: ", response)
    }

    if (!socket.connected) socket.connect()
    
    socket.emit("joinRoom", debugRoomId)
  }

  return {
    readyAll,
    joinDebugRoom
  }
}