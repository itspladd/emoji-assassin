import type { ClientPlayerInfo, PlayerColorKey, PlayerName, PlayerRole, PrivateClientPlayerInfo } from "@customTypes/players"
import { makeRandomName } from "../helpers/names"
import RoomEmitter from "./RoomEmitter"
import { CustomServerSocket } from "@customTypes/socket"
import { RoomId } from "@customTypes/rooms"


export default class Player {

  private _id: string
  _name: PlayerName
  _color: PlayerColorKey
  _isReady: boolean
  _role: PlayerRole
  score: number
  _favoriteTile: [number, number] | null
  knownSafeTiles: [number, number][] | null

  constructor(
    private socket: CustomServerSocket,
    private tellOtherPlayers:ReturnType<RoomEmitter['emitToOtherPlayersFactory']>,
    colorKey: PlayerColorKey
  ) {
    this._id = socket.id
    this._name = makeRandomName()
    this._color = colorKey
    this._isReady = false
    this._role = null
    this.score = 0
    this._favoriteTile = null
    this.knownSafeTiles = null
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  set name(name:PlayerName) {
    this._name = name
  }

  get color() {
    return this._color
  }

  set color(color:PlayerColorKey) {
    this._color = color
  } 

  get isReady() {
    return this._isReady
  }

  set isReady(newVal:boolean) {
    this._isReady = newVal
  }

  get isAssassin() {
    return this._role === "assassin"
  }
  
  get isInnocent() {
    return this._role !== "assassin"
  }

  get role() {
    return this._role
  }

  set role(newRole:PlayerRole) {
    this._role = newRole
  }

  get favoriteTile() {
    return this._favoriteTile
  }

  joinRoom(id:Exclude<RoomId, null>) {
    this.socket.join(id)
    this.tellOtherPlayers("playerJoined", this.clientState)
  }
  
  setFavoriteTile(row:number, column:number) {
    this._favoriteTile = [row, column]
  }

  toggleReady():boolean {
    this._isReady = !this._isReady
    return this._isReady
  }

  /**
   * Returns an object representing the public client-side app state for this Player.
   */
  get clientState():ClientPlayerInfo {
    return {
      name: this.name,
      id: this._id,
      color: this.color,
      isReady: this.isReady
    }
  }

  get privateClientState():PrivateClientPlayerInfo {
    return {
      myRole: this.role,
      myFavoriteTile: this.favoriteTile,
      myKnownSafeTiles: this.knownSafeTiles
    }
  }

  /**
   * Sets the player's name to a random name
   */
  setRandomName():void {
    this.name = makeRandomName()
  }
}