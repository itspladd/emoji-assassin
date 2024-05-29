import type { ClientGameState, GameStatus, GameTile } from "@customTypes/game"
import type { PlayerList } from "@customTypes/players"

import { getRandomTileEmojis } from "../helpers/emojis"

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

  tiles: GameTile[]
  state: GameStatus

  constructor () {
    this.state = "notStarted"
    this.tiles = Game.makeTiles()
  }

  get clientGameState():ClientGameState {
    return {
      tiles: this.tiles
    }
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
}