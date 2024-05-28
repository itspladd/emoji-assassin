import type { CustomServer, CustomServerSocket } from "@customTypes/socket";

import Player from "./Player";
import { getRandomFromArray, pullRandomFromArray } from "../helpers/arrays";
import { playerNameString } from "../helpers/names";
import { RoomState } from "@customTypes/rooms";
import { ClientPlayerList, PlayerColorKey, PlayerName } from "@customTypes/players";
import { playerColors } from "../constants/colors"
import Game from "./Game";

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
  _game: Game;
  _availableColors: PlayerColorKey[];

  constructor(id:string, io:CustomServer) {
    this._createdAt = new Date()
    this._id = id
    this._io = io
    this._players = {}
    this._availableColors = [ ...Object.keys(playerColors) as Array<keyof typeof playerColors> ]

    this._game = new Game()
  }

  get id() {
    return this._id
  }

  get clientRoomState():RoomState {
    const playersInRoom = this.clientPlayerList

    return {
      roomId: this.id,
      playersInRoom
    }
  }

  get clientPlayerList() {
    const results:ClientPlayerList = {}

    Object.keys(this._players).forEach(id => {
      results[id] = this._players[id].clientState
    })

    return results
  }

  get allPlayerNames():PlayerName[] {
    return Object.values(this._players).map(p => p.name)
  }

  // Returns an available player color key and removes it from the list of available keys.
  get randomAvailableColor():PlayerColorKey {
    if (!Object.values(this._availableColors).length) {
      throw new Error(`Room ${this._id} ran out of available player colors somehow`)
    }

    const [colorKey, remainingColors] = pullRandomFromArray(this._availableColors)
    console.log("remaining colors: ", remainingColors)
    this._availableColors = remainingColors
    return colorKey
  }

  makeColorAvailable(color:PlayerColorKey) {
    this._availableColors.push(color)
  }

  changePlayerColor(id:string) {
    const player = this._players[id]
    const oldColor = player.color
    const newColor = this.randomAvailableColor

    // Set player color to new color
    player.color = newColor
    this.makeColorAvailable(oldColor)
  }

  playerNameIsUnique(id:string):boolean {
    console.log("checking uniqueness")
    const playerName = this._players[id].name
    const otherPlayers = {...this._players }
    delete otherPlayers[id]
    const otherPlayerNames = Object.values(otherPlayers).map(p => p.name)
    return otherPlayerNames
      .filter(({adjective, noun}:PlayerName) => {
        return playerName.adjective === adjective && playerName.noun === noun
      }).length === 0
  }

  setUniquePlayerName(playerId:string, forceChangeCurrentName?:boolean) {
    const player = this._players[playerId]
    forceChangeCurrentName && player.setRandomName()
    while(!this.playerNameIsUnique(player.id)) {
      player.setRandomName()
    }
  }

  initNewPlayer(socket:CustomServerSocket):Player {
    // Instantiate the player and add it to the room's tracker
    const newPlayer = new Player(socket, this._io, this._id, this.randomAvailableColor)
    this._players[socket.id] = newPlayer

    this.setUniquePlayerName(newPlayer.id)

    return newPlayer
  }

  addPlayer(socket:CustomServerSocket) {
    const player = this.initNewPlayer(socket)

    socket.on("changeName", () => {
      console.debug(`${player.id} requested name change`)
      this.setUniquePlayerName(player.id, true)

      this._io.to(this._id).emit("playerChangedName", player._id, player.name)
    })

    socket.on("toggleReady", () => {
      console.debug(`${player.id} toggled ready stat`)
      player.toggleReady()

      this._io.to(this._id).emit("playerToggledReady", player._id, player.isReady)
    })

    // Tell the socket to join the room channel
    socket.join(this.id)

    // Tell everyone else in the room that this player joined
    socket.to(this.id).emit("playerJoined", player.clientState)

    // Tell the joining player to update their client state
    this._io.to(socket.id).emit("syncRoomAndGameState", this.clientRoomState, this._game.clientGameState)

    console.debug(`Created Player ${player._id} in room ${this._id} with name ${playerNameString(player.name)}`)
  }
}