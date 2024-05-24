import type { CustomServer, CustomServerSocket } from "@customTypes/socket";

import { Player } from "./Player";
import { getRandomFromArray } from "../helpers/arrays";
import { playerNameString } from "../helpers/names";

/**
 * Room Class
 * 
 * The Room class represents a lobby where a Game takes place.
 */
export default class Room {

  /******** Static properties and methods ********/

  static RoomIdCharacters = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    //"I",
    "J",
    "K",
    "L",
    "M",
    "N",
    //"O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]

  /**
   * Returns a randomized valid room ID.
   * @returns id: A six-character alphanumeric string
   */
  static makeId() {
    let newId = ""

    for (let i = 0; i < 6; i++) {
      newId += getRandomFromArray(this.RoomIdCharacters)
    }

    return newId
  }

  
  /******** Instance properties and methods ********/
  _createdAt: Date;
  _id: string;
  _io: CustomServer;
  _players: Record<string, Player>

  constructor(id:string, io:CustomServer) {
    this._createdAt = new Date()
    this._id = id
    this._io = io
    this._players = {}
  }

  get id() {
    return this._id
  }

  addPlayer(socket:CustomServerSocket) {
    socket.join(this.id)
    const newPlayer = new Player(socket, this._io, this._id)
    this._players[socket.id] = newPlayer
    this._io.to(this.id).emit("playerJoined", { id: socket.id, name: newPlayer.name})
    console.debug(`Created Player ${newPlayer._id} in room ${this._id} with name ${playerNameString(newPlayer.name)}`)
  }
}