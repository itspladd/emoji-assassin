import { CustomServer } from "@customTypes/socket";

/**
 * Handlers for room-related events
 * (These are socket.io rooms, not necessarily game Rooms)
 * @param io 
 */
export default function setupRoomMonitoring(io:CustomServer) {
  io.of("/").adapter.on("create-room", (room) => {
    console.debug(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("delete-room", (room) => {
    console.debug(`room ${room} was deleted`);
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    console.debug(`Socket ${id} left room ${room}`);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    let message = "ROOM JOIN"
    if (room === id) {
      message += ` (SELF)`
    }
    message += `: socket ${id} has joined room ${room}`
    console.debug(message)
  });
}