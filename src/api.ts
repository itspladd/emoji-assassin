import type { Express } from "express";
import Room from "./classes/Room";

export default function setupApi(app:Express) {
  // Example route handler 
  //app.get("/message", (_, res) => res.send("Hello from express!"));

  /** POST /rooms
   * Creates a new Room and returns the Room info
   */
  app.post("/rooms", (_, res) => {
    const id = Room.makeId()
    const room = new Room(id)
    console.debug("Creating a new room")
    res.json({room:"beans"})
  })
}