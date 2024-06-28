import express from "express";
import ViteExpress from "vite-express";

import { createServer } from 'node:http';
import { Server } from 'socket.io'

import setupServerSocket from "./src/socket/server/server.js";
import setupApi from "./src/api.js";
import setupDebugApi from "./src/debugApi.js";

const PORT = process.env.PORT
const HOST = process.env.HOST
const environment = process.env.NODE_ENV

const app = express();
const server = createServer(app)
const io = new Server(server)


// Logging middleware
app.use((req, _, next) => {
  const pathsToExclude = /\/@|\/src|\/node_modules/gmi
  if (!req.path.match(pathsToExclude)) {
    console.debug(`${req.method} ${req.path}`)
  }
  
  next()
})


environment === "development" && setupDebugApi(app,io)

setupApi(app, io)

setupServerSocket(io)

server.listen(PORT, () => {
  console.log(`--- 🥷🧨 Emoji Assassin server up and running at ${HOST}:${PORT} 🥷🧨--- `)
})

ViteExpress.bind(app, server);