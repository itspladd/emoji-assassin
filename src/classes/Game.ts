import type { ClientGameState, GameStatus, GameTile } from "@customTypes/game"
import type { PlayerList, PlayerRole } from "@customTypes/players"
import type Player from "./Player"

import { getRandomTileEmojis } from "../helpers/emojis"
import { getRandomFromArray, pullRandomFromArray } from "../helpers/arrays"

export default class Game {

  static MIN_PLAYERS = 4
  static MAX_PLAYERS = 10
  static NUM_TILES = 25

  static makeTiles():GameTile[] {
    const emojis = getRandomTileEmojis(Game.NUM_TILES)

    return emojis.map((emoji, i) => {
      const row = Math.floor(i/5)
      const column = i % 5

      return {
        image: emoji,
        description: "tile",
        row,
        column
      }

    })
  }

  _players: PlayerList
  _turnOrder: string[]
  tiles: GameTile[]
  status: GameStatus
  

  constructor () {
    this.status = "notStarted"
    this.tiles = Game.makeTiles()
    this._players = {}
    this._turnOrder = []
  }

  get clientGameState():ClientGameState {
    return {
      tiles: this.tiles,
      status: this.status
    }
  }

  get currentPlayerId():string {
    return this._turnOrder[0]
  }

  get currentPlayer():Player {
    return this._players[this.currentPlayerId]
  }

  /**
   * Returns true if the game could begin with the input player data.
   */
  gameCanBegin(players:PlayerList):boolean {
    const playerDataArr = Object.values(players)

    const enoughPlayers = playerDataArr.length >= Game.MIN_PLAYERS
    const tooManyPlayers = playerDataArr.length > Game.MAX_PLAYERS
    
    if (!enoughPlayers || tooManyPlayers) {
      return false
    }

    const allPlayersReady = playerDataArr.filter(player => !player.isReady).length === 0

    return allPlayersReady
  }

  initNewGame(players:PlayerList) {
    this._players = players

    this.assignPlayerRoles()
    this.setPlayerOrder()
    this.status = "running"
  }

  assignPlayerRoles() {
    const assassinId = getRandomFromArray(Object.keys(this._players))
    Object.values(this._players).forEach(player => {
      const playerIsAssassin = player.id === assassinId
      const role:PlayerRole = playerIsAssassin ? "innocent" : "assassin"

      player.role = role
    })
  }

  // Choose a random order for the players to take turns in
  setPlayerOrder() {
    let playerIds = Object.keys(this._players)
    const playerOrder = []

    while(playerIds.length) {
      const [nextPlayerId, remainingPlayerIds] = pullRandomFromArray(playerIds)
      playerOrder.push(nextPlayerId)
      playerIds = [...remainingPlayerIds]
    }

    this._turnOrder = playerOrder
  }

  // End the current player's turn and start the next player's turn
  nextPlayer() {
    // Move current player ID to end of the turn order array
    const [current, ...others] = this._turnOrder
    this._turnOrder = [...others, current]
  }
 }