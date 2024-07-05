import type { ClientGameTileInfo, TileContents } from "@customTypes/game"

export default class GameTile {

  _favoritedBy: string[]
  active: boolean
  _contents: TileContents

  constructor(
    readonly image: string,
    readonly description: string,
    readonly row: number,
    readonly column: number
  ) {
    this._favoritedBy = []
    this.active = true
    this._contents = "empty"
  }

  addFavorite(playerId:string) {
    if (this._favoritedBy.includes(playerId)) {
      console.error(`ERROR in Tile.addFavorite: Attempted to favorite a tile for the same player twice`)
    }
    this._favoritedBy.push(playerId)
  }

  clearContents() {
    this._contents = "empty"
  }

  setBomb() {
    this._contents = "bomb"
  }

  get favoritedBy() {
    return [...this._favoritedBy]
  }

  get isSafe() {
    return this._contents !== "bomb"
  }

  get isBomb() {
    return this._contents === "bomb"
  }

  get location():[number, number] {
    return [this.row, this.column]
  }

  get clientInfo():ClientGameTileInfo {
    return {
      image: this.image,
      description: this.description,
      row: this.row,
      column: this.column,
      active: this.active
    }
  }
}