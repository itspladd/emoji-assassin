import express from "express";
import ViteExpress from "vite-express";

import { createServer } from 'node:http';
import { Server } from 'socket.io'

import setupServerSocket from "./src/socket/server.js";
import setupApi from "./src/api.js";

const PORT = 3000
const HOST = 'localhost'

const app = express();
const server = createServer(app)
const io = new Server(server)

// Logging middleware
app.use((req, _, next) => {
  console.debug(`${req.method} ${req.path}`)
  
  next()
})

setupApi(app)

io.on('connection', setupServerSocket)

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

server.listen(3000, () => {
  console.log(`--- 🥷🧨 Emoji Assassin server up and running at ${HOST}:${PORT} 🥷🧨--- `)
})


ViteExpress.bind(app, server);