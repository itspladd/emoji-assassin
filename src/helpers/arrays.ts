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

/**
 * "Yanks" any number of items from an input array without mutating the input array.
 * Returns an array containing the yanked items and a copy of the initial array with the items removed.
 * @param arr 
 * @returns 
 */
export const pullRandomSetFromArray = <T>(arr:Array<T>, size:number = 1):[Array<T>, Array<T>] => {
  if (size < 1) {
    throw new Error(`Cannot pull a random set of size ${size} from an array (size must be at least 1)`)
  }
  if (size > arr.length) {
    throw new Error(`Attempted to pull a random set larger than the input array. Size: ${size}, array length: ${arr.length}`)
  }

  // Shallow copy of input array to avoid mutation
  let itemPool = [...arr]

  // Init empty return array
  const returnArr = []

  for (let i = 0; i < size; i++) {
    const [pulledItem, remainingItems] = pullRandomFromArray(itemPool)

    // Add pulled item to return array and update item pool
    returnArr.push(pulledItem)
    itemPool = remainingItems
  }

  return [returnArr, itemPool]
}