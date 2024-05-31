import type { CustomServer } from "@customTypes/socket"
import setupRoomMonitoring from "./setupRoomMonitoring"
import setupServerEvents from "./setupServerEvents"
import setupDebugEvents from "./setupDebugEvents"


export default function setupServerSocket(io:CustomServer) {
  setupRoomMonitoring(io)
  
  // When a new socket connects, populate all of the events
  io.on('connection', (socket) => {
    setupServerEvents(socket, io)
    setupDebugEvents(socket, io)
  })
}

