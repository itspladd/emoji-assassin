import type { Server, Socket } from "socket.io";
import { Player } from "./Player";
import { getRandomFromArray } from "../helpers/arrays";
import { SOCKET_EVENTS } from "../socket/socketEvents";

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
  _id: string;
  _io: Server;
  _createdAt: Date;
  _players: Record<string, Player>

  constructor(id:string, io:Server) {
    if (!id || typeof id !== "string") {
      throw new Error(`Attempted to create a room with bad id param: '${JSON.stringify(id)}'`)
    }
    if (!io) {
      throw new Error(`Attempted to create a room with no io param: '${JSON.stringify(io)}'`)
    }
    if (io.constructor.name !== "Server") {
      throw new Error(`Attempted to create a room with the wrong kind of io param. Expected 'Server', got ${io.constructor.name}`)
    }
    this._createdAt = new Date()
    this._id = id
    this._io = io
    this._players = {}
  }

  get id() {
    return this._id
  }

  addPlayer(socket:Socket) {
    socket.join(this.id)
    const newPlayer = new Player(socket, this._io)
    this._players[socket.id] = newPlayer
    this.broadcast("PLAYER_JOINED", { id: socket.id, name: newPlayer.name })
  }

  // Convenience function to send an event to all sockets in this room.
  broadcast(event:keyof typeof SOCKET_EVENTS, ...args:any[]) {
    this._io.to(this.id).emit(SOCKET_EVENTS[event], ...args)
  }
}