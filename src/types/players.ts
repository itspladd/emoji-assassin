import type Player from "../classes/Player"

/** Shared types */
export type Article = 'a' | 'an'

export interface PlayerName {
  adjective: string,
  noun: string,
  adjectiveArticle: Article,
  nounArticle: Article
}

export type PlayerColorKey = 
  "red"
  |"green"
  |"blue"
  |"cyan"
  |"yellow"
  |"purple"
  |"black"
  |"white"

export type PlayerColorValue = string

export type PlayerColor = Record<PlayerColorKey, PlayerColorValue>

export type PlayerRole = "innocent" | "assassin" | null

/** Server-side types */
export type PlayerList = Record<string, Player>

/** Client-side types */
export interface ClientPlayerInfo {
  name: PlayerName,
  id: string,
  color: string,
  isReady: boolean
}

export interface ClientSelfInfo extends ClientPlayerInfo {
  role: PlayerRole
}

export type ClientPlayerList = Record<string, ClientPlayerInfo>