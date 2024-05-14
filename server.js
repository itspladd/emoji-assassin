import express from "express";
import ViteExpress from "vite-express";

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io'

const PORT = 3000
const HOST = 'localhost'

const app = express();
const server = createServer(app)
const io = new Server(server)

// Example route handler 
//app.get("/message", (_, res) => res.send("Hello from express!"));

const __dirname = dirname(fileURLToPath(import.meta.url));


io.on('connection', socket => {
  console.log("user connected")
})

server.listen(3000, () => {
  console.log(`--- 🥷🧨 Emoji Assassin server up and running at ${HOST}:${PORT} 🥷🧨--- `)
})


ViteExpress.bind(app, server);