import type { CustomServer, CustomServerSocket } from "@customTypes/socket";

import Player from "./Player";
import { getRandomFromArray, pullRandomFromArray } from "../helpers/arrays";
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

  /**
   * Retrieves the publicly-known data for all players (including the local player).
   */
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

  get playerArray():Player[] {
    return Object.values(this._players)
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

  /**
   * Returns true if new players can join the room, false otherwise.
   */
  get acceptingNewPlayers():[result: boolean, reason: string | null] {
    if (this.roomIsFull) {
      return [false, "Room full"]
    }

    return [true, null]
  }

  /**
   * Returns true if the room is at its maximum player capacity, false otherwise.
   */
  get roomIsFull():boolean {
    return Object.keys(this._players).length >= Game.MAX_PLAYERS
  }

  hasPlayer(id:string):boolean {
    return !!this._players[id]
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

  /**
   * Given a player ID, checks to make sure that player's name is unique in this room.
   * @param id 
   * @returns 
   */
  playerNameIsUnique(id:string):boolean {
    const playerName = this._players[id].name
    const otherPlayers = {...this._players }
    delete otherPlayers[id]
    const otherPlayerNames = Object.values(otherPlayers).map(p => p.name)
    return otherPlayerNames
      .filter(({adjective, noun}:PlayerName) => {
        return playerName.adjective === adjective && playerName.noun === noun
      }).length === 0
  }

  /**
   * Given a player ID, sets a unique random name for that player.
   * @param playerId The ID of the player to check.
   * @param forceChangeCurrentName If true, the player will get a new unique name even if their current name is unique.
   */
  setUniquePlayerName(playerId:string, forceChangeCurrentName?:boolean) {
    const player = this._players[playerId]
    forceChangeCurrentName && player.setRandomName()
    while(!this.playerNameIsUnique(player.id)) {
      player.setRandomName()
    }

    this._io.to(this.id).emit("playerChangedName", player._id, player.name)
  }

  initNewPlayer(socket:CustomServerSocket):Player {
    // Instantiate the player and add it to the room's tracker
    const newPlayer = new Player(socket, this.randomAvailableColor)
    this._players[socket.id] = newPlayer

    this.setUniquePlayerName(newPlayer.id)

    return newPlayer
  }

  removePlayer(id:string) {
    console.log('removing player', id)
    const player = this._players[id]

    if (!player) {
      console.debug('player not found')
      return
    }

    this.makeColorAvailable(player.color)
    delete this._players[player.id]
  }

  afterPlayerReady(playerId:string) {
    // Notify the room about this player's new ready status
    this._io.to(this.id).emit("playerToggledReady", playerId, this._players[playerId].isReady)

    // Try to start the game
    this.startGame()
  }

  startGame():[result:boolean, reason: string | null] {
    // Check if game should start or not
    if(!this._game.gameCanBegin(this._players)) {
      return [false, "Game cannot start"]
    }

    // Initialize the game with the player list
    this._game.initNewGame(this._players)

    // Send each player their local game state, including private info about themselves
    this.playerArray.forEach(player => {
      this._io.to(player.id).emit("gameStateChange", this._game.gameStateForPlayer(player.id))
    })
    return [true, null]
  }
}