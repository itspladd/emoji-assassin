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
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
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
  _players: Record<string, Player>

  constructor(id:string, io:Server) {
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

  broadcast(event:keyof typeof SOCKET_EVENTS, ...args:any[]) {
    this._io.to(this.id).emit(SOCKET_EVENTS[event], ...args)
  }
}