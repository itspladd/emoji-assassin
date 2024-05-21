import { 
  USERNAME_ADJECTIVES,
  USERNAME_NOUNS
} from '../constants/names'

import { getRandomFromArray } from './arrays'

export type Article = 'a' | 'an'

export interface PlayerName {
  adjective: string,
  noun: string,
  adjectiveArticle: Article,
  nounArticle: Article
}

export function makeRandomName():PlayerName {
  const adjective = getRandomFromArray(USERNAME_ADJECTIVES)
  const noun = getRandomFromArray(USERNAME_NOUNS)
  const adjectiveArticle = getArticle(adjective)
  const nounArticle = getArticle(noun)

  return {
    adjective,
    noun,
    adjectiveArticle,
    nounArticle,
  }
}

export function getArticle(word:string):Article {
  const firstChar = word[0].toLocaleLowerCase()

  if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
    return 'an'
  }

  return 'a'
}

/**
 * Helper function for basic name display that gets reused a lot
 */
export function playerNameString({
  adjectiveArticle,
  adjective,
  noun
} : PlayerName, capitalize = true):string {
  let articleString:string = adjectiveArticle
  if (capitalize) {
    articleString = adjectiveArticle.replace('a', 'A')
  }
  return `${articleString} ${adjective} ${noun}`
}