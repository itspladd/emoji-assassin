import { expect, test, describe, it } from 'vitest'
import Room from "./Room"

describe("Room class", () => {
  
  const TEST_ROOM_ID = "ABC123"

  it("Can be instantiated", () => {
    const testRoom = new Room(TEST_ROOM_ID)

    expect(testRoom).toBeInstanceOf(Room)
  })

  describe("Static methods", () => {
    describe("makeId", () => {
      it("returns a six-character alphanumeric string", () => {
        const result = Room.makeId()

        expect(result).toBeTypeOf("string")
        expect(result).toHaveLength(6)
      })
    })
  })

  describe("Instanced methods", () => {

  })
})