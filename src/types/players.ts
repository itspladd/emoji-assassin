/** Shared types */
export type Article = 'a' | 'an'

export interface PlayerName {
  adjective: string,
  noun: string,
  adjectiveArticle: Article,
  nounArticle: Article
}

/** Server-side types */

/** Client-side types */
export interface ClientPlayerInfo {
  name: PlayerName,
  id: string
}

export type PlayerList = Record<string, ClientPlayerInfo>