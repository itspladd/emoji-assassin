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

/** Server-side types */

/** Client-side types */
export interface ClientPlayerInfo {
  name: PlayerName,
  id: string,
  color: string
}

export type ClientPlayerList = Record<string, ClientPlayerInfo>