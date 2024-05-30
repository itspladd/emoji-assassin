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

  /***************************************
   * GET /rooms/debug
   * Returns the ID of the debugging room
   */
  // Init the debug room
  const debugRoom = RoomManager.makeUniqueRoom(io)
  RoomManager.addRoom(debugRoom)
  console.debug(`Created debug room with ID: ${debugRoom.id}`)

  // Define route
  app.get("/rooms/debug", (_, res) => {
    res.send({ debugRoomId: debugRoom.id })
  })
  /****************************************/

  /** GET /rooms/:id 
   * Returns whether that room exists on the server or not
  */
  app.get("/rooms/:id", (req, res) => {
    const { id } = req.params
    
    // Check if room exists
    if (!RoomManager.roomExists(id)) {
      return res.send({ roomIdValid: false, reason: `Room with id ${id} not found`})
    }

    // TODO: Check if players can currently join that room
    const [canJoin, reason] = RoomManager.getRoom(id).acceptingNewPlayers

    if(!canJoin) {
      return res.send({ roomIdValid: false, reason})
    }

    res.send({ roomIdValid: true })
  })


}