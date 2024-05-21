export type Article = 'a' | 'an'

export interface PlayerName {
  adjective: string,
  noun: string,
  adjectiveArticle: Article,
  nounArticle: Article
}

export interface ClientPlayerInfo {
  name: PlayerName,
  id: string
}