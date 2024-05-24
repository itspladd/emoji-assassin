import { expect, describe, it, afterEach } from 'vitest'
import { TestableRoomManager, RoomManager } from "./RoomManager"
import Room from './Room'

describe("RoomManager singleton", () => {

  it("exists", () => {
      expect(RoomManager).toBeDefined()
  })

  describe("Private methods", () => {
    describe("_roomIdIsValid", () => {
      it("returns false if the input ID is not a string", () => {
        const badIdTypes = [1, null, undefined, {'a': 'b'}, ['a', 'b']]
        const results = badIdTypes.map(TestableRoomManager._roomIdIsValid)

        expect(results.every(r => r === false)).toBe(true)
      })

      it("returns false if the input ID is not 6 characters long", () => {
        const badIds = ["abc12", "", "abc1234"]
        const results = badIds.map(TestableRoomManager._roomIdIsValid)
        expect(results.every(r => r === false)).toBe(true)
      })

      it("returns false if any of the input ID characters are not alphanumeric", () => {
        const badIds = ["abc12-", ";", "-abc12"]
        const results = badIds.map(TestableRoomManager._roomIdIsValid)
        expect(results.every(r => r === false)).toBe(true)
      })

      it("returns true for IDs consisting of 6 lower-case alphanumeric characters", () => {
        const goodIds = ["abc123", "123xyz", "111111", "1q4e2c", "TASERS", "123456", "7890cz"]
        const results = goodIds.map(TestableRoomManager._roomIdIsValid)
        expect(results.every(r => r === true)).toBe(true)
      })
    })

    describe("_roomIdIsUnique", () => {
      it("throws an error if not provided with a string ID and an activeRooms object", () => {
        const badParams1 = () => TestableRoomManager._roomIdIsUnique()
        const badParams2 = () => TestableRoomManager._roomIdIsUnique("abc123")
        const badParams3 = () => TestableRoomManager._roomIdIsUnique(123456, {})
        const badParams4 = () => TestableRoomManager._roomIdIsUnique("abc123", [])
        const badParams5 = () => TestableRoomManager._roomIdIsUnique(undefined, [])
        const goodParams = () => TestableRoomManager._roomIdIsUnique("abc123", {})

        expect(badParams1).toThrow(/_roomIdIsUnique/)
        expect(badParams2).toThrow(/_roomIdIsUnique/)
        expect(badParams3).toThrow(/_roomIdIsUnique/)
        expect(badParams4).toThrow(/_roomIdIsUnique/)
        expect(badParams5).toThrow(/_roomIdIsUnique/)
        expect(goodParams).not.toThrow()
      })
      it("returns true if the input room ID is not tracked in the input list yet, and false otherwise", () => {
        const testList = {}
        const testRoom1 = new Room("ABC123", io)
        const testRoom2 = new Room("ABC123", io)
        expect(TestableRoomManager._roomIdIsUnique(testRoom1.id, testList)).toBe(true)

        testList[testRoom1.id] = testRoom1

        expect(TestableRoomManager._roomIdIsUnique(testRoom2.id, testList)).toBe(false)
      })
    })
  })

  describe("Public methods", () => {

    // Clean up rooms after each test
    afterEach(() => RoomManager.resetAllActiveRooms())
    
    describe("addRoom", () => {
      it("throws an error if given invalid parameters, a Room with a bad ID, or an already-tracked Room", () => {
        const bad1 = () => RoomManager.addRoom()
        const bad2 = () => RoomManager.addRoom(new Room("-abc12", io))
        const good = () => RoomManager.addRoom(new Room("abc123", io))
        const repeated = () => RoomManager.addRoom(new Room("abc123", io))

        expect(bad1).toThrow(/addRoom/)
        expect(bad2).toThrow(/addRoom/)
        expect(good).not.toThrow()
        expect(repeated).toThrow(/abc123/)
      })
      it("adds the input Room to the _activeRooms list", () => {
        const newRoom = new Room("abc123", io)
        const newRoom2 = new Room("123abc", io)

        RoomManager.addRoom(newRoom)
        expect(RoomManager.getAllActiveRooms()).toEqual({ abc123: newRoom })
        
        RoomManager.addRoom(newRoom2)
        expect(RoomManager.getAllActiveRooms()).toEqual({ 
          abc123: newRoom,
          '123abc': newRoom2
        })
      })
    })

    describe("removeRoom", () => {
      it("removes the input ID from the tracked room list", () => {
        RoomManager.addRoom(new Room("abc123", io))
        RoomManager.removeRoom("abc123")

        expect(RoomManager.getAllActiveRooms()).toEqual({})
      })
      it("does not affect other rooms in the list", () => {
        const rooms = [
          new Room("abc123", io),
          new Room("abc456", io),
          new Room("abc789", io)
        ]

        rooms.forEach(RoomManager.addRoom)

        RoomManager.removeRoom("abc456")

        expect(RoomManager.getAllActiveRooms()).toEqual({
          abc123: rooms[0],
          abc789: rooms[2]
        })
      })
    })

    describe("makeUniqueRoom", () => {
      it("returns multiple unique Rooms without hanging", () => {
        const uniqueRooms = [1,2,3,4,5].map(() => RoomManager.makeUniqueRoom(io))

        uniqueRooms.forEach(RoomManager.addRoom)
        expect(Object.keys(RoomManager.getAllActiveRooms())).toHaveLength(5)
      })
    })
  })
})