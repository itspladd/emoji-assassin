import type { Express } from "express";
import { RoomManager } from "./classes/RoomManager";

export default function setupApi(app:Express) {
  // Example route handler 
  //app.get("/message", (_, res) => res.send("Hello from express!"));

  /** POST /rooms
   * Creates a new Room and returns the Room info
   */
  app.post("/rooms", (_, res) => {
    console.debug("Creating a new room")
    const newRoom = RoomManager.makeUniqueRoom()
    RoomManager.addRoom(newRoom)
    res.json({newRoomId: newRoom.id})
  })
}