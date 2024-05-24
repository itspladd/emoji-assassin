import type { CustomServer, CustomServerSocket } from "@customTypes/socket"
import type { PlayerName } from "@customTypes/players"
import { makeRandomName } from "../helpers/names"


export class Player {
  _id: string
  _name: PlayerName
  _socket: CustomServerSocket

  constructor(
    socket:CustomServerSocket,
    io: CustomServer,
    roomId: string
  ) {
    this._id = socket.id
    this._socket = socket
    this._name = makeRandomName()

    socket.on("changeName", () => {
      console.debug(`${this._id} requested name change`)
      this.name = makeRandomName()

      io.to(roomId).emit("playerChangedName", this._id, this.name)
    })
  }

  get name() {
    return this._name
  }

  set name(name:PlayerName) {
    this._name = name
  }
}