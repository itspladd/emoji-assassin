import type { CustomServerSocket, CustomServer } from "@customTypes/socket"

import { RoomManager } from "../../classes/RoomManager"
import { playerNameString } from "../../helpers/names"
import setupRoomEvents from "./setupRoomEvents"
import { RoomId } from "@customTypes/rooms"

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

  // Event emitted when a player attempts to join a game room.
  function onJoinRoom(roomId: RoomId) {
    if (!roomId) {
      return console.debug(`Player ${socket.id} attempted to use a falsy roomId ('${roomId}')to join a room`)
    }

    const room = RoomManager.getRoom(roomId)

    if (!room) {
      return console.debug(`Player ${socket.id} attempted to join nonexistent room using ID ${roomId}`)
    }

    if (room.hasPlayer(socket.id)) {
      return console.debug(`Prevented player ${socket.id} from joining room ${room.id} twice`)
    }

    const player = room.initNewPlayer(socket)

    console.debug(`Created Player ${player.id} in room ${room._id} with name ${playerNameString(player.name)}`)
  }

  socket.on('disconnecting', onDisconnecting)
  socket.on('disconnect', onDisconnect)
  socket.on('joinRoom', onJoinRoom)
}