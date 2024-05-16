import type { Socket } from "socket.io"

export default function setupServerSocket(socket:Socket) {
  console.log("user connected:", socket.id)

  socket.on('disconnect', () => {
    console.log("user disconnected:", socket.id)
  })
}