import type { Socket, Server } from "socket.io"

import { SOCKET_EVENTS } from "./events"

export default function setupServerSocket(io:Server) {
  setupServerMiddleware(io)
  
  // When a new socket connects, populate all of the events
  io.on('connection', setupServerEvents)
}

function setupServerEvents(socket:Socket) {
  // Built-in events
  socket.on('disconnect', () => {
    console.log("user disconnected:", socket.id)
  })

  // Custom named events
  socket.on(SOCKET_EVENTS.JOIN_ROOM, roomId => {
    socket.join(roomId)
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