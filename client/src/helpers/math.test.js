import { expect, test, describe, it } from 'vitest'

import { getRandomInt } from './math'

describe("getRandomInt", () => {
  const actualNoMinResults = []
  const actualWithMinResults = []
  const validWithMinResults = []
  const validNoMinResults = []
  const maxNum = 20
  const minNum = 5

  for (let i = 0; i < maxNum; i++) {
    validNoMinResults.push(i)
  }

  for (let i = minNum; i < maxNum; i++) {
    validWithMinResults.push(i)
  }

  for (let i = 0; i < 1000; i++) {
    actualNoMinResults.push(getRandomInt(maxNum))
    actualWithMinResults.push(getRandomInt(maxNum, minNum))
  }

  it("never returns less than 0", () => {
    expect(actualNoMinResults.some(val => val < 0)).toBe(false)
    expect(actualWithMinResults.some(val => val < 0)).toBe(false)
  })

  it("never meets the maximum value", () => {
    expect(actualNoMinResults.some(val => val === maxNum)).toBe(false)
    expect(actualWithMinResults.some(val => val === maxNum)).toBe(false)
  })

  it("never falls below the minimum value if supplied", () => {
    expect(actualWithMinResults.some(val => val < minNum)).toBe(false)
  })

  it("can return exactly the maximum (minus one) or minimum value", () => {
    expect(actualNoMinResults.some(val => val === 0)).toBe(true)
    expect(actualNoMinResults.some(val => val === maxNum - 1)).toBe(true)
    expect(actualWithMinResults.some(val => val === minNum)).toBe(true)
    expect(actualWithMinResults.some(val => val === maxNum - 1)).toBe(true)
  })

  it("can return all numbers in the provided span", () => {
    // Convenience function to test that every one of the valid results exists at least once
    const containsAll = (actualResults, validResults) => validResults.every(val => actualResults.includes(val))

    expect(containsAll(actualNoMinResults, validNoMinResults)).toBe(true)
    expect(containsAll(actualWithMinResults, validWithMinResults)).toBe(true)
  })
})