import type { CustomServerSocket, CustomServer } from "@customTypes/socket"

import { RoomManager } from "../../classes/RoomManager"
import { playerNameString } from "../../helpers/names"
import setupRoomEvents from "./setupRoomEvents"

/**
 * Configures the basic server-side listeners for a given socket.
 * @param socket 
 * @param io 
 */
export default function setupServerEvents(socket:CustomServerSocket, io:CustomServer) {
  console.debug("USER CONNECTED:", socket.id)

  function onDisconnecting() {
    socket.rooms.forEach(roomId => {
      const room = RoomManager.getRoom(roomId)
      if (room) {
        room.removePlayer(socket.id)
        socket.to(roomId).emit("playerLeft", socket.id)
      }
    })
  }

  function onDisconnect() {
    console.log("user disconnected:", socket.id)
  }

  function onJoinRoom(roomId: string) {
    const room = RoomManager.getRoom(roomId)

    if (room.hasPlayer(socket.id)) {
      console.debug(`Prevented player ${socket.id} from joining room ${room.id} twice`)
      return
    }

    const player = room.initNewPlayer(socket)
    setupRoomEvents(socket, /* io, */ room, player)

    // Tell the socket to join the room channel
    socket.join(room.id)

    // Tell everyone else in the room that this player joined
    socket.to(room.id).emit("playerJoined", player.clientState)

    // Tell the joining player to update their client state
    io.to(socket.id).emit("syncRoomAndGameState", room.clientRoomState, room._game.clientGameState)

    console.debug(`Created Player ${player._id} in room ${room._id} with name ${playerNameString(player.name)}`)
  }

  socket.on('disconnecting', onDisconnecting)
  socket.on('disconnect', onDisconnect)
  socket.on("joinRoom", onJoinRoom)
}