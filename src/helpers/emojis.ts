import { TILE_EMOJIS } from "../constants/emojis"
import { getRandomArrayIndex } from "./arrays"

export function getRandomTileEmojis(amount:number):string[] {
  // Create copy of emoji array
  const availableEmojis = [...TILE_EMOJIS]
  const results = []

  for (let i = 0; i < amount; i++) {
    const index = getRandomArrayIndex(availableEmojis)
    results.push(...availableEmojis.splice(index, 1))
  }

  console.log("emojis gotten:", results)
  console.log("emojis remaining:",availableEmojis)
  return results
}