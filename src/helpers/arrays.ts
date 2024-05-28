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

/**
 * "Yanks" a single item from an input array without mutating the input array.
 * Returns the item and a copy of the array with the item removed.
 * @param arr 
 * @returns 
 */
export const pullRandomFromArray = <T>(arr:Array<T>):[T, Array<T>] => {
  const indexToPull = getRandomArrayIndex(arr)
  const newArr = [...arr]
  const [pulledItem] = newArr.splice(indexToPull, 1)

  return [pulledItem, newArr]
}