import type { CustomServer, CustomServerSocket } from "@customTypes/socket"
import type { ClientPlayerInfo, PlayerColorKey, PlayerName } from "@customTypes/players"
import { makeRandomName } from "../helpers/names"


export default class Player {

  _id: string
  _name: PlayerName
  _socket: CustomServerSocket
  _color: PlayerColorKey

  constructor(
    socket:CustomServerSocket,
    io: CustomServer,
    roomId: string,
    colorKey: PlayerColorKey
  ) {
    this._id = socket.id
    this._socket = socket
    this._name = makeRandomName()
    this._color = colorKey

  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  set name(name:PlayerName) {
    this._name = name
  }

  get color() {
    return this._color
  }

  set color(color:PlayerColorKey) {
    this._color = color
  } 

  get clientState():ClientPlayerInfo {
    return {
      name: this.name,
      id: this._id,
      color: this.color
    }
  }

  /**
   * Sets the player's name to a unique name, given a list of names that are taken already
   * @param takenNames 
   */
  setRandomName():void {
    this.name = makeRandomName()
  }
}