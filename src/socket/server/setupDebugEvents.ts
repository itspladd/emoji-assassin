import type { CustomServerSocket } from "@customTypes/socket";

import { RoomManager } from "../../classes/RoomManager";
import { RoomState } from "@customTypes/rooms";

export default function setupDebugEvents(
  socket:CustomServerSocket,
  // io:CustomServer,
  // room:Room,
  // player:Player
) {
  
  // Set all players to ready and attempt to start game
  function onDebugReadyAll(roomId: RoomState['roomId']) {
    try {
      const room = RoomManager.getRoom(roomId)
      if (!room) {
        throw new Error(`onDebugReadyAll attempted to ready all players in a nonexistent room (ID ${roomId})`)
      }
      room.playerArray.forEach(player => player._isReady = true)

      room.startGame()
    } catch(e) {
      console.error(e)
    }
  }

  socket.on("debug_readyAll", onDebugReadyAll)
}