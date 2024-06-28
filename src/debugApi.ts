import type { Express } from "express";
import type { CustomServer } from "@customTypes/socket";

import { RoomManager } from "./classes/RoomManager"

export default function setupDebugApi(app:Express, io:CustomServer) {
  console.debug("Setting up debug API routes...")
  
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
}