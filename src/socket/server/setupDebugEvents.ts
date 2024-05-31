import type { CustomServerSocket } from "@customTypes/socket";

import { RoomManager } from "../../classes/RoomManager";

export default function setupDebugEvents(
  socket:CustomServerSocket,
  // io:CustomServer,
  //room:Room,
  //player:Player
) {
  
  // Set all players to ready and attempt to start game
  function onDebugReadyAll(roomId: string) {
    const room = RoomManager.getRoom(roomId)
    room.playerArray.forEach(player => player._isReady = true)

    room.startGame()
  }

  socket.on("debug_readyAll", onDebugReadyAll)
}