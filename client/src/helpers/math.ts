/**
 * Returns a random integer less than the maximum and greater than or equal to the minimum.
 */
export const getRandomInt = (max:number, min = 0) => {
  if (max <= min) {
    throw new Error(`getRandomInt must be called with a max value greater than the min value. Values supplied: max: ${max}, min: ${min}`)
  }

  const span = max - min
  const baseNumber = Math.floor(Math.random() * span)
  
  return baseNumber + min
}