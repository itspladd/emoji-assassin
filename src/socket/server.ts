import type { CustomServerSocket, CustomServer } from "@customTypes/socket"
import type Room from "../classes/Room"
import type Player from "../classes/Player"

import { RoomManager } from "../classes/RoomManager"
import { playerNameString } from "../helpers/names"

export default function setupServerSocket(io:CustomServer) {
  setupServerMiddleware(io)
  
  // When a new socket connects, populate all of the events
  io.on('connection', (socket) => setupServerEvents(socket, io))
}

/**
 * Configures all of the server-side listeners for a given socket.
 * @param socket 
 * @param io 
 */
function setupServerEvents(socket:CustomServerSocket, io:CustomServer) {
  socket.on('connect', () => {
    console.log("user connected:", socket.id)
  })

  socket.on('disconnecting', () => {
    socket.rooms.forEach(roomId => {
      const room = RoomManager.getRoom(roomId)
      if (room) {
        room.removePlayer(socket.id)
        socket.to(roomId).emit("playerLeft", socket.id)
      }
    })
  })

  socket.on('disconnect', () => {
    console.log("user disconnected:", socket.id)
  })
  
  socket.on("joinRoom", roomId => {
    const room = RoomManager.getRoom(roomId)

    if (room.hasPlayer(socket.id)) {
      console.debug(`Prevented player ${socket.id} from joining room ${room.id} twice`)
      return
    }

    const player = room.initNewPlayer(socket)
    setupRoomEvents(socket, io, room, player)

    // Tell the socket to join the room channel
    socket.join(room.id)

    // Tell everyone else in the room that this player joined
    socket.to(room.id).emit("playerJoined", player.clientState)

    // Tell the joining player to update their client state
    io.to(socket.id).emit("syncRoomAndGameState", room.clientRoomState, room._game.clientGameState)

    console.debug(`Created Player ${player._id} in room ${room._id} with name ${playerNameString(player.name)}`)
  })
}

/**
 * Configures the Room-specific event listeners for a socket.
 * @param socket
 * @param io 
 * @param room 
 * @param player 
 */
function setupRoomEvents(socket:CustomServerSocket, io:CustomServer, room:Room, player:Player) {
  /**
   * Event fired when a player clicks the "change name" button
   */
  socket.on("changeName", () => {
    console.debug(`${player.id} requested name change`)
    room.setUniquePlayerName(player.id, true)

    io.to(room.id).emit("playerChangedName", player._id, player.name)
  })

  /**
   * Event fired when a player clicks the "ready" or "unready" button
   */
  socket.on("toggleReady", () => {
    console.debug(`${player.id} toggled ready state`)
    player.toggleReady()
    
    // Check if game should start or not
    const gameCanBegin = room._game.gameCanBegin(room._players)

    // If game shouldn't start, just notify the room about this player's new ready status
    if (!gameCanBegin) {
      io.to(room.id).emit("playerToggledReady", player._id, player.isReady)
      return 
    }

    io.to(room.id).emit("gameStart", room._game.clientGameState)
    room._game.initNewGame(room._players)
  })
}

function setupServerMiddleware(io:CustomServer) {
  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    let message = "ROOM JOIN"
    if (room === id) {
      message += ` (SELF)`
    }
    message += `: socket ${id} has joined room ${room}`
    console.log(message)
  });
}