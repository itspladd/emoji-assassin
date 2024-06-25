import type { TileContents } from "@customTypes/game"

export default class GameTile {

  _favoritedBy: string[]
  active: boolean
  contents: TileContents

  constructor(
    readonly image: string,
    readonly description: string,
    readonly row: number,
    readonly column: number
  ) {
    this._favoritedBy = []
    this.active = true
    this.contents = "empty"
  }

  addFavorite(playerId:string) {
    if (this._favoritedBy.includes(playerId)) {
      console.error(`ERROR in Tile.addFavorite: Attempted to favorite a tile for the same player twice`)
    }
    this._favoritedBy.push(playerId)
  }

  get favoritedBy() {
    return [...this._favoritedBy]
  }

  get isSafe() {
    return this.contents !== "bomb"
  }
}