import type { CustomServerSocket, CustomServer } from "@customTypes/socket"
import { RoomManager } from "../classes/RoomManager"

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

  socket.on('disconnect', () => {
    console.log("user disconnected:", socket.id)
  })
  
  socket.on("joinRoom", roomId => {
    const room = RoomManager.getRoom(roomId)
    room.addPlayer(socket)
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