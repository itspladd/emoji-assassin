import type { Express } from "express";
import type { Server } from "socket.io";
import { RoomManager } from "./classes/RoomManager";

export default function setupApi(app:Express, io:Server) {
  // Example route handler 
  //app.get("/message", (_, res) => res.send("Hello from express!"));

  /** GET /rooms/:id 
   * Returns whether that room exists on the server or not
  */
  app.get("/rooms/:id", (req, res) => {
    const { id } = req.params
    res.send({ roomIdValid: RoomManager.roomExists(id) })
  })

  /** POST /rooms
   * Creates a new Room and returns the Room info
   */
  app.post("/rooms", (_, res) => {
    console.debug("Creating a new room")
    const newRoom = RoomManager.makeUniqueRoom(io)
    RoomManager.addRoom(newRoom)
    res.json({newRoomId: newRoom.id})
  })
}