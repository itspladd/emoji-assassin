import type { CustomServerSocket } from "@customTypes/socket"
import type { ClientPlayerInfo, PlayerColorKey, PlayerName, PlayerRole, PrivateClientPlayerInfo } from "@customTypes/players"
import { makeRandomName } from "../helpers/names"


export default class Player {

  _id: string
  _name: PlayerName
  _socket: CustomServerSocket
  _color: PlayerColorKey
  _isReady: boolean
  _role: PlayerRole
  score: number
  favoriteTile: [number, number] | null
  knownSafeTiles: [number, number][] | null

  constructor(
    socket:CustomServerSocket,
    colorKey: PlayerColorKey
  ) {
    this._id = socket.id
    this._socket = socket
    this._name = makeRandomName()
    this._color = colorKey
    this._isReady = false
    this._role = null
    this.score = 0
    this.favoriteTile = null
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