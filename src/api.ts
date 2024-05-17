import type { Express } from "express";

export default function setupApi(app:Express) {
  // Example route handler 
  //app.get("/message", (_, res) => res.send("Hello from express!"));

  app.post("/rooms", (req, res) => {
    console.log("got request")

    res.json({room:"beans"})
  })
}