import type { CustomServerSocket } from "@customTypes/socket";

import { RoomManager } from "../../classes/RoomManager";

export default function setupDebugEvents(
  socket:CustomServerSocket,
  // io:CustomServer,
  // room:Room,
  // player:Player
) {
  
  // Set all players to ready and attempt to start game
  function onDebugReadyAll(roomId: string) {
    try {
      const room = RoomManager.getRoom(roomId)
      if (!room) {
        throw new Error(`onDebugReadyAll atte`)
      }
      room.playerArray.forEach(player => player._isReady = true)

      room.startGame()
    } catch(e) {
      console.error(e)
    }
  }

  socket.on("debug_readyAll", onDebugReadyAll)
}