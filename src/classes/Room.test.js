import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { createServer } from 'node:http';
import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc, Socket as ClientSocket } from "socket.io-client";
import Room from "./Room"


describe("Room class", () => {
  const TEST_ROOM_ID = "ABC123"

  it("Can be instantiated", () => {
    const testRoom = new Room(TEST_ROOM_ID, io)

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

  describe.todo("Instanced methods", () => {
  })
})