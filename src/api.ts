import type { Express } from "express";
import type { CustomServer } from "@customTypes/socket";
import { RoomManager } from "./classes/RoomManager";

export default function setupApi(app:Express, io:CustomServer) {
  // Example route handler 
  //app.get("/message", (_, res) => res.send("Hello from express!"));

  app.get("/sockets", async (_, res) => {
    const sockets = await io.fetchSockets()
    const ids = sockets.map(socket => socket.id)
    res.json(ids)
  })

  app.get("/rooms", (_, res) => {
    const activeRooms = RoomManager.getAllActiveRooms()

    // Remove data the behaves badly with JSON
    // (the _io property causes a circular structure)
    const list = Object.values(activeRooms).map(room => ({ ...room, _io: undefined}))
    res.json(...list)
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

  /** GET /rooms/:id 
   * Returns whether that room exists on the server or not
  */
  app.get("/rooms/:id", (req, res) => {
    const { id } = req.params
    
    // Check if room exists
    const roomIdExists = RoomManager.roomExists(id)

    // TODO: Check if players can currently join that room

    res.send({ roomIdValid: RoomManager.roomExists(id) })
  })
}