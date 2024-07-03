import type { CustomServer, CustomServerSocket, } from "@customTypes/socket";
import type { ClientPlayerList, PlayerColorKey, PlayerName } from "@customTypes/players";
import type { RoomId, RoomState, RoomStatus } from "@customTypes/rooms";

import { getRandomFromArray, pullRandomFromArray } from "../helpers/arrays";
import { playerColors } from "../constants/colors"

import Player from "./Player";
import Game from "./Game";
import RoomEmitter from "./RoomEmitter";
import setupRoomEvents from "../socket/server/setupRoomEvents";

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
   * @returns roomId: A six-character alphanumeric string
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
  _id: Exclude<RoomId, null>;
  _players: Record<string, Player>
  _game: Game;
  _availableColors: PlayerColorKey[];
  _roomStatus: RoomStatus;
  emitter: RoomEmitter;
  tellAllPlayers: RoomEmitter['emitToRoom'];
  tellPlayer: RoomEmitter['emitToPlayer'];

  constructor(id:RoomId, io:CustomServer) {
    if (!id) {
      throw new Error(`Attempted to create a RoomEmitter with no room ID.
        roomId parameter: ${id}
        `)
    }
    this.emitter = new RoomEmitter(io, id)
    this.tellAllPlayers = this.emitter.emitToRoom
    this.tellPlayer = this.emitter.emitToPlayer
    this._createdAt = new Date()
    this._id = id
    this._players = {}
    this._availableColors = [ ...Object.keys(playerColors) as Array<keyof typeof playerColors> ]
    this._game = new Game(this.tellAllPlayers, this.tellPlayer)
    this._roomStatus = "NOT_ENOUGH_PLAYERS"
  }

  get id() {
    return this._id
  }

  get clientRoomState():RoomState {
    const playersInRoom = this.clientPlayerList

    return {
      roomId: this.id,
      status: this.roomStatus,
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

  get roomStatus():RoomStatus {
    return this._roomStatus
  }

  // Note that when we change the room status on the server-side, we send the status to the client.
  set roomStatus(newStatus:RoomStatus) {
    // Don't update if the status is unchanged (don't want to send a message to the client if not necessary)
    if (this.roomStatus === newStatus) {
      return;
    }

    this._roomStatus = newStatus
    this.tellAllPlayers("roomStatusChange", newStatus)
  }

  // Simple wrapper function that calls the room status setter with calculated results. 
  updateRoomStatus() {
    this.roomStatus = this.calculateRoomStatus()
  }

  // Determine the room's status and return it
  calculateRoomStatus():RoomStatus {
    const numPlayers = this.playerArray.length
    const enoughPlayers = numPlayers >= Game.MIN_PLAYERS
    const tooManyPlayers = numPlayers > Game.MAX_PLAYERS

    // Check if all players have readied up and return the result.
    const allPlayersReady = this.playerArray.filter(player => !player.isReady).length === 0

    if (this._game.gameIsRunning) {
      return "GAME_RUNNING" 
    }
    
    if (!enoughPlayers) {
      return "NOT_ENOUGH_PLAYERS"
    }

    if (tooManyPlayers) {
      return "TOO_MANY_PLAYERS"
    }

    if (!allPlayersReady) {
      return "NOT_ALL_PLAYERS_READY"
    }

    return "GAME_CAN_START"
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

  changePlayerName(playerId: string) {
    const player = this._players[playerId]

    this.setUniquePlayerName(playerId, true)

    this.tellAllPlayers("playerChangedName", player.id, player.name)
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
  }

  initNewPlayer(socket:CustomServerSocket):Player {
    // Instantiate the player and add it to the room's tracker
    const newPlayer = new Player(
      socket,
      this.emitter.emitToOtherPlayersFactory(socket),
      this.randomAvailableColor
    )
    this._players[socket.id] = newPlayer
    this.setUniquePlayerName(newPlayer.id)

    // Set up the listeners for the player socket
    setupRoomEvents(socket, this, newPlayer)
    
    // Tell the player's socket to join this room
    newPlayer.joinRoom(this.id)

    // Update the room's status
    this.updateRoomStatus()

    // Tell the joining player to update their client state
    this.tellPlayer(newPlayer.id, "syncRoomAndGameState", this.clientRoomState, this._game.gameStateForPlayer(socket.id))

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
    this.updateRoomStatus()
  }

  afterPlayerReady(playerId:string) {
    // Notify the room about this player's new ready status
    this.tellAllPlayers("playerToggledReady", playerId, this._players[playerId].isReady)

    // Try to start the game
    this.startGame()
  }

  /**
 * Returns true if the game could begin with current state.
 */
  gameCanBegin():boolean {
    return this.roomStatus === "GAME_CAN_START"
  }

  startGame():boolean {
    // Update the room's status
    this.updateRoomStatus()

    // Check if game should start or not
    const gameCanBegin = this.gameCanBegin()
    if(!gameCanBegin) {
      return false
    }

    // Initialize the game with the player list
    this._game.initNewGame(this._players)

    // Update the room's status again (since the game is now running)
    this.updateRoomStatus()

    // Send each player their local game state, including private info about themselves
    this.playerArray.forEach(player => {
      this.tellPlayer(player.id, "gameStateChange", this._game.gameStateForPlayer(player.id))
    })
    return true
  }
}