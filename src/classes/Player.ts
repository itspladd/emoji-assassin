import type { PlayerName } from "@customTypes/players"
import type { Server, Socket } from "socket.io"
import { makeRandomName, playerNameString } from "../helpers/names"
import { SOCKET_EVENTS } from "../socket/socketEvents"

export class Player {
  _id: string
  _name: PlayerName
  _roomId: string

  constructor(socket:Socket, io:Server) {
    this._id = socket.id
    this._name = makeRandomName()
    this._roomId = socket.id

    socket.on(SOCKET_EVENTS.CHANGE_NAME, () => {
      console.debug(`${this._id} requested name change`)
      this.name = makeRandomName()

      io.to(this._roomId).emit(SOCKET_EVENTS.PLAYER_NAME_CHANGED, this._id, this.name)
    })
    console.debug(`Created Player ${this._id} in room ${this._roomId} with name ${playerNameString(this.name)}`)
  }

  get name() {
    return this._name
  }

  set name(name:PlayerName) {
    this._name = name
  }
}