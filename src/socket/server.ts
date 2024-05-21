import type { Socket, Server } from "socket.io"

import { SOCKET_EVENTS } from "./socketEvents"
import { RoomManager } from "../classes/RoomManager"

export default function setupServerSocket(io:Server) {
  setupServerMiddleware(io)
  
  // When a new socket connects, populate all of the events
  io.on('connection', (socket) => setupServerEvents(socket, io))
}

/**
 * Configures all of the server-side listeners for a given socket.
 * @param socket 
 * @param io 
 */
function setupServerEvents(socket:Socket, io:Server) {
  // Built-in events
  socket.on('disconnect', () => {
    console.log("user disconnected:", socket.id)
  })

  // Custom named events
  socket.on(SOCKET_EVENTS.JOIN_ROOM, roomId => {
    const room = RoomManager.getRoom(roomId)
    room.addPlayer(socket)
  })
}

function setupServerMiddleware(io:Server) {
  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
}