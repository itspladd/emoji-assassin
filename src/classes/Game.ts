import type { ClientGameState, ClientGameTileInfo, GameStatus, GameStatusOrder, PublicClientGameState } from "@customTypes/game"
import type { PlayerList, PlayerRole } from "@customTypes/players"
import type Player from "./Player"
import type RoomEmitter from "./RoomEmitter"
import GameTile from "./GameTile"

import { getRandomTileEmojis } from "../helpers/emojis"
import { getRandomFromArray, pullRandomFromArray, pullRandomSetFromArray } from "../helpers/arrays"

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
      const tile = new GameTile(
        emoji,
        "default tile description",
        row,
        column
      )
      return tile
    })
  }

  // All of the players tracked for this game.
  _players: PlayerList
  // Array of player IDs representing turn order (index 0 is the current player)
  _turnOrder: string[]
  // Array of two numbers representing the row/column of the bomb.
  _bombLocation: [number, number] | null
  // Tracks tiles that have been favorited, and an array of players who have favorited each
  _favoritedTiles: Record<string, string[]>
  // The maximum number of known safe tiles each player can have
  _maxKnownSafeTilesPerPlayer: number


  // The list of tiles in the game
  tiles: GameTile[]
  // String indicating the current state of the game flow
  status: GameStatus


  // Zero-indexed dimensions of the game board. A 5x5 game board would have a value of 4.
  _boardSize: number
  
  

  constructor (
    private tellAllPlayers:RoomEmitter['emitToRoom'],
    private tellPlayer:RoomEmitter['emitToPlayer']
  ) {
    this.status = "notStarted"
    this.tiles = Game.makeTiles()
    this._players = {}
    this._turnOrder = []
    this._favoritedTiles = {}
    this._bombLocation = null
    this._maxKnownSafeTilesPerPlayer = 2
    this._boardSize = Math.ceil(Math.sqrt(Game.NUM_TILES)) - 1
  }

  get gameIsRunning() {
    return this.status !== "notStarted"
  }

  get publicClientGameState():PublicClientGameState {
    return {
      tiles: this.publicClientTileInfo,
      status: this.status,
      currentPlayerId: this.currentPlayerId,
    }
  }

  get publicClientTileInfo():ClientGameTileInfo[] {
    return this.tiles.map(tile => tile.clientInfo)
  }

  get currentPlayerId():string {
    return this._turnOrder[0]
  }

  get currentPlayer():Player {
    return this._players[this.currentPlayerId]
  }

  get innocentPlayers():Player[] {
    return Object.values(this._players).filter(player => player.isInnocent)
  }

  get bombIsPlaced():boolean {
    return this._bombLocation?.length === 2
  }

  // Tiles that are eligible to be clicked
  get activeTiles():GameTile[] {
    return this.tiles.filter(tile => tile.active)
  }

  // Safe (non-bomb) tiles that are eligible to be clicked
  get safeTiles():GameTile[] {
    return this.activeTiles.filter(tile => tile.isSafe)
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
  handleTileSelect(row:number, column:number, playerId:string) {
    if (this.status === "notStarted") {
      console.error("ERROR: Game.handleTileSelect called during bad status:", this.status)
      return
    }

    console.log(`Handling select for tile at ${row}, ${column}:`, this.getTileAt(row, column))

    const actingPlayer = this._players[playerId]
    const actingPlayerIsCurrentPlayer = actingPlayer.id === this.currentPlayerId
    const tile = this.getTileAt(row, column)

    if (this.status === "chooseFavoriteTiles") {
      this.favoriteTileSelect(tile, actingPlayer)
      this.attemptStateTransition("running")

      return
    }

    if (this.status === "running") {
      if (!tile.active) {
        throw new Error(`Attempted to handle selection of inactive tile at [${row}, ${column}] by ${playerId}. Tile found: ${tile}`)
      }

      // If the current active player clicked, we process their turn.
      if (actingPlayerIsCurrentPlayer) {
        tile.active = false
        if (tile.isBomb) {
          // Player is removed from round
        }
        this.endPlayerTurn(playerId)
        this.tellAllPlayers("gameStateChange", { currentPlayerId: this.currentPlayerId, tiles: this.publicClientTileInfo })
      }

      
      return 
    }
  }

  favoriteTileSelect(tile:GameTile, player:Player):void {
    const { row, column } = tile
    player.isAssassin ?
      this.placeBomb(row, column) : 
      this.getTileAt(row, column).favoritedBy.push(player.id)

    // Regardless of player role, set the player's favorite tile (the assassin's "favorite tile" is the bomb tile).
    player.setFavoriteTile(row, column)

    // Notify the player that their tile is selected.
    this.tellPlayer(player.id, "setFavoriteTile", row, column)
  }

  /**
   * Tell each innocent player tiles that they know are safe to click.
   */
  assignKnownSafeTiles():void {
    const totalSafeTiles = this.safeTiles.length

    // Find out how many safe tiles could be given to each player (e.g. 24 safe tiles / 3 innocent players = 8 tiles available for each)
    const availableSafeTilesPerPlayer = Math.floor(totalSafeTiles / this.innocentPlayers.length)

    // Coerce the number of known safe tiles per player to the max allowed by the game rules
    const actualSafeTilesPerPlayer = Math.min(availableSafeTilesPerPlayer, this._maxKnownSafeTilesPerPlayer)
    console.log(`Could assign ${availableSafeTilesPerPlayer} known safe tiles for each player, will actually assign ${actualSafeTilesPerPlayer}.`)

    // Pull different sets of known safe tiles for each innocent player
    let knownSafeTilePool = this.safeTiles
    this.innocentPlayers.forEach(player => {
      // Get this player's tiles from the pool
      const [knownSafeTilesForPlayer, remainingInPool] = pullRandomSetFromArray(knownSafeTilePool, actualSafeTilesPerPlayer)

      // Extract the locations from the tiles, set the player data, and notify the client
      player.knownSafeTiles = knownSafeTilesForPlayer.map(tile => tile.location)
      this.tellPlayer(player.id, "knownSafeTilesUpdate", player.knownSafeTiles)

      // Update the pool of safe tiles
      knownSafeTilePool = remainingInPool
    })
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
  // Returns true if successful, false otherwise
  endPlayerTurn(playerId:string):boolean {
    console.debug(`${playerId} ended their turn`)
    if (this.currentPlayerId !== playerId) {
      console.error(`${playerId} attempted to end their turn, but it is not their turn. It is currently ${this.currentPlayerId}'s turn`)
      return false
    }

    // Move current player ID to end of the turn order array
    const [current, ...others] = this._turnOrder
    this._turnOrder = [...others, current]
    console.debug(`it is now ${this.currentPlayerId}'s turn`)

    this.tellAllPlayers("gameStateChange", { currentPlayerId: this._turnOrder[0] })
    return true
  }

  /**
   * Attempts to transition the game from its current state to the next state.
   * @param currentStatus 
   * @returns {boolean} - True if the transition was successful, false otherwise.
   */
  attemptStateTransition(targetStatus:GameStatus):boolean {
    if (!targetStatus) {
      throw new Error("Attempted a status transition with no target status.")
    }

    // If conditions are not met, don't transition
    if (!this.canTransitionTo(targetStatus)) {
      return false
    }
    
    // If conditions are met, transition and notify everyone in the room.
    this.status = targetStatus
    targetStatus === "running" && this.transitionToRunningState()

    this.tellAllPlayers("gameStateChange", { status: targetStatus })
    return true
  }

  /**
   * Contains all of the actions to perform when transitioning into the "running" game state.
   */
  transitionToRunningState() {
    this.assignKnownSafeTiles()
  }

  /**
   * Returns true if the game can transition into the target state from the current state, given the current game data.
   * @param target 
   * @returns 
   */
  canTransitionTo(target:GameStatus):boolean {
    if (!target) {
      throw new Error("Attempted a status transition with no target status.")
    }

    const current = this.status

    // Make sure the specified transition is valid
    if(!Game.STATUS_ORDER[current].includes(target)) {
      throw new Error(`Attempted status transition from '${current}' to '${target}', but that status order is invalid`)
    }

    // If we are trying to leave the "place bomb/choose favorite" phase, make sure everyone has selected a tile.
    if(current === "chooseFavoriteTiles") {
      const allPlayersHaveChosen = Object.values(this._players).every(p => p.favoriteTile !== null)
      return this.bombIsPlaced && allPlayersHaveChosen
    }

    console.debug('canTransitionTo exited without finding a matching condition')
    return false
  }

  placeBomb(row:number, column:number) {
    this._bombLocation = [row, column]
    this.getTileAt(row, column).setBomb()
  }

  clearBomb() {
    // If there's no bomb, do nothing.
    if (!this._bombLocation) {
      return
    }

    // Clear the current bomb tile and location information.
    const [
      currentBombRow,
      currentBombCol
    ] = this._bombLocation
    this.getTileAt(currentBombRow, currentBombCol).clearContents()
    this._bombLocation = null
  }
 }