import type { ClientGameState, GameStatus, GameStatusOrder, GameTile, PublicClientGameState } from "@customTypes/game"
import type { PlayerList, PlayerRole } from "@customTypes/players"
import type Player from "./Player"

import { getRandomTileEmojis } from "../helpers/emojis"
import { getRandomFromArray, pullRandomFromArray } from "../helpers/arrays"

export default class Game {

  static MIN_PLAYERS = 4
  static MAX_PLAYERS = 10
  static NUM_TILES = 25

  static STATUS_ORDER:GameStatusOrder = {
    "notStarted": ["chooseFavoriteTiles"],
    "chooseFavoriteTiles": ["running"],
    "running": ["chooseFavoriteTiles", "gameOver"],
    "gameOver": []
  }

  static makeTiles():GameTile[] {
    const emojis = getRandomTileEmojis(Game.NUM_TILES)
    const numRowsAndCols = Math.ceil(Math.sqrt(Game.NUM_TILES))

    return emojis.map((emoji, i) => {
      const row = Math.floor(i/numRowsAndCols)
      const column = i % numRowsAndCols

      return {
        image: emoji,
        description: "tile",
        row,
        column,
        favoritedBy: [],
        active: true
      }

    })
  }

  // All of the player classes tracked for this game.
  _players: PlayerList
  // Array of player IDs representing turn order (index 0 is the current player)
  _turnOrder: string[]
  // Array of two numbers representing the row/column of the bomb.
  _bombLocation: [number, number] | null
  // Tracks tiles that have been favorited, and an array of players who have favorited each
  _favoritedTiles: Record<string, string[]>
  tiles: GameTile[]
  status: GameStatus

  // Zero-indexed dimensions of the game board. A 5x5 game board would have a value of 4.
  _boardSize: number
  

  constructor () {
    this.status = "notStarted"
    this.tiles = Game.makeTiles()
    this._players = {}
    this._turnOrder = []
    this._favoritedTiles = {}
    this._bombLocation = null

    this._boardSize = Math.ceil(Math.sqrt(Game.NUM_TILES)) - 1
  }

  get publicClientGameState():PublicClientGameState {
    return {
      tiles: this.tiles,
      status: this.status,
      currentPlayer: this.currentPlayerId
    }
  }

  get currentPlayerId():string {
    return this._turnOrder[0]
  }

  get currentPlayer():Player {
    return this._players[this.currentPlayerId]
  }

  get bombIsPlaced():boolean {
    return this._bombLocation?.length === 2
  }

  // Tiles are stored as a single-dimension array; use row/column to grab the correct one
  getTileAt(row: number, col: number):GameTile {
    if (row > this._boardSize || col > this._boardSize) {
      throw new Error(`Attempted to get out-of-bounds tile for board of size ${this._boardSize}: [${row}, ${col}]`)
    }

    const rowIndexComponent = row * (this._boardSize + 1)
    const colIndexComponent = col

    return this.tiles[rowIndexComponent + colIndexComponent]
  }

  /**
   * Pseudo-getter that retrieves the full client-side game state for a given player.
   * Includes that player's private information.
   * @param playerId 
   * @returns 
   */
  gameStateForPlayer(playerId:string):ClientGameState {
    const publicState = this.publicClientGameState
    const privateState = this._players[playerId]?.privateClientState

    return {
      ...publicState,
      privateInfo: { ...privateState }
    }
  }

  /**
   * Top-level function for handling incoming tile selection events.
   * @param row 
   * @param column 
   * @param playerId 
   * @returns 
   */
  handleTileSelect(row:number, column:number, playerId:string):void {
    if (this.status === "notStarted") {
      console.error("ERROR: Game.handleTileSelect called during bad status:", this.status)
      return
    }

    console.log(`Handling select for tile at ${row}, ${column}:`, this.getTileAt(row, column))

    const player = this._players[playerId]
    const tile = this.getTileAt(row, column)

    if (this.status === "chooseFavoriteTiles") {
      this.favoriteTileSelect(tile, player)
    }

    if (this.status === "running") {
      if (!tile.active) {
        throw new Error(`Attempted to handle selection of inactive tile at [${row}, ${column}] by ${playerId}. Tile found: ${tile}`)
      }

      this.nextPlayer()
    }
  }

  favoriteTileSelect(tile:GameTile, player:Player):void {
    const { row, column } = tile
    player.isAssassin ?
      this.placeBomb(row, column) : 
      this.getTileAt(row, column).favoritedBy.push(player.id)
    // The assassin's "favorite tile" is the bomb tile.
    player.setFavoriteTile(row, column)
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
    this.status = "chooseFavoriteTiles"
  }

  assignPlayerRoles() {
    const assassinId = getRandomFromArray(Object.keys(this._players))
    Object.values(this._players).forEach(player => {
      const playerIsAssassin = player.id === assassinId
      const role:PlayerRole = playerIsAssassin ? "assassin" : "innocent"

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
  nextPlayer():string {
    // Move current player ID to end of the turn order array
    const [current, ...others] = this._turnOrder
    this._turnOrder = [...others, current]

    return this.currentPlayerId
  }

  /**
   * Attempts to transition the game from its current state to the next state.
   * @param currentStatus 
   * @returns {boolean} - True if the transition was successful, false otherwise.
   */
  transitionTo(targetStatus:GameStatus):boolean {
    if (!targetStatus) {
      throw new Error("Attempted a status transition with no target status.")
    }

    // If conditions are not met, don't transition
    if (!this.canTransitionTo(targetStatus)) {
      return false
    }
    
    this.status = targetStatus
    return true
  }

  canTransitionTo(target:GameStatus):boolean {
    if (!target) {
      throw new Error("Attempted a status transition with no target status.")
    }

    const current = this.status

    // Make sure the specified transition is valid
    if(!Game.STATUS_ORDER[current].includes(target)) {
      throw new Error(`Attempted status transition from '${current}' to '${target}', but that status order is invalid`)
    }

    // If we are trying to leave the "place bomb/choose favorite" phase, make sure everyone has placed theirs
    if(current === "chooseFavoriteTiles") {
      const allPlayersHaveChosen = Object.values(this._players).every(p => p.favoriteTile !== null)
      return this.bombIsPlaced && allPlayersHaveChosen
    }

    console.debug('canTransitionTo exited without finding a matching condition')
    return false
  }

  placeBomb(row:number, column:number) {
    this._bombLocation = [row, column]
  }

  clearBomb() {
    this._bombLocation = null
  }
 }