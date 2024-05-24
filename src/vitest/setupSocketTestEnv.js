import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { createServer } from 'node:http';
import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc, Socket as ClientSocket } from "socket.io-client";

console.log("************PERFORMING SETUP**************")

beforeAll(() => {
  return new Promise((resolve, reject) => {
    const httpServer = createServer();
    global.io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address()).port;
      global.clientSocket = ioc(`http://localhost:${port}`);
      global.io.on("connection", (socket) => {
        global.serverSocket = socket;
        resolve()
      });
    });
  })

});

afterAll(() => {
  global.io.close();
  global.clientSocket.disconnect();

  delete global.io
  delete global.serverSocket
  delete global.clientSocket
});