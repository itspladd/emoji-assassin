import { ClientGameState, GameStatus, GameTile } from "@customTypes/game"
import { getRandomTileEmojis } from "../helpers/emojis"

export default class Game {

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
}