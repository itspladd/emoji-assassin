import { getRandomInt } from "./math"

/**
 * Returns a random value from the input array
 * @param arr 
 * @returns 
 */
export const getRandomFromArray = <T>(arr:Array<T>):T => {
  const length = arr.length
  const index = getRandomInt(length)

  return arr[index]
}

/**
 * Returns a random index from the input array
 * @param arr 
 * @returns 
 */
export const getRandomArrayIndex = (arr:Array<any>):number => {
  const length = arr.length
  const index = getRandomInt(length)

  return index
}