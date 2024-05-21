import Room from "./Room";

type RoomList = Record<string, Room>

export interface RoomManager {
  addRoom: (room:Room) => void,
  removeRoom: (id:string) => void,
  getRoom: (id:string) => Room,
  makeUniqueRoom: () => Room,
  getAllActiveRooms: () => RoomList,
  resetAllActiveRooms: () => void
}

// Private functions for the singleton.
// Defined outside the singleton so they can be tested.

/**
 * Check an input room ID to see if it is formatted correctly.
 * @param {string} id
 * @returns {boolean} True if the ID is formatted properly, false otherwise
 */
function _roomIdIsValid(id:string):boolean {
  if (typeof id !== "string") {
    return false
  }

  if (id.length !== 6) {
    return false
  }

  for (let char of Array.from(id)) {
    if (!Room.RoomIdCharacters.includes(char.toLowerCase())) {
      return false
    }
  }

  return true
}

/**
 * Check an input room ID to see if we already have a room with that ID.
 * @param {string} id 
 * @param {RoomList} activeRooms
 * @returns {boolean} True if the room ID is unique, false otherwise
 */
function _roomIdIsUnique(id:string, activeRooms:RoomList):boolean {
  if (typeof id !== "string" || typeof activeRooms !== "object" || Array.isArray(activeRooms)) {
    throw new Error(`RoomManager._roomIdIsUnique(id:string, activeRooms:RoomList) called with invalid parameter(s):
    id: '${id}'
    activeRooms: '${activeRooms}'`)
  }

  if (activeRooms[id]) {
    return false
  }

  return true
}

/**
 * Creates the context for a RoomManager object and returns a RoomManager interface
 * @returns {RoomManager} The room manager object
 */
const RoomManagerFactory = function ():RoomManager {
  
  const _activeRooms:RoomList = {}

  /**
   * Returns a shallow copy of the active room list.
   * @returns {RoomList} A shallow copy of the _activeRooms object.
   */
  function getAllActiveRooms():RoomList {
    return {..._activeRooms}
  }

  function makeUniqueRoom():Room {
    let newRoomId = Room.makeId()

    while(!_roomIdIsUnique(newRoomId, _activeRooms)) {
      newRoomId = Room.makeId()
    }

    console.debug(`Creating new Room: ${newRoomId}`)
    return new Room(newRoomId)
  }

  /**
   * Validates and adds a Room to the list of active Rooms.
   * @param {Room} room 
   */
  function addRoom(room:Room):void {
    if (!room?.id) {
      throw new Error(`RoomManager.addRoom called with invalid room parameter: ${room}`)
    }

    const { id } = room

    if (!_roomIdIsValid(id)) {
      throw new Error(`RoomManager.addRoom tried to add a room with an invalid ID: '${id}'`)
    }

    if (!_roomIdIsUnique(id, _activeRooms)) {
      throw new Error(`RoomManager.addRoom tried to add room ID '${id}', but that room is already tracked.`)
    }

    _activeRooms[id] = room
    console.debug(`Room ${id} added to active rooms list.`)
  }

  /**
   * Removes the Room with the given ID from the list of active rooms, if it is tracked.
   */
  function removeRoom(id:string) {
    if (!_activeRooms[id]) {
      console.debug(`RoomManager.removeRoom tried to remove room '${id}', but that room wasn't in the list.`)
      return
    }
    delete _activeRooms[id]
    console.debug(`Room ${id} removed from active rooms list.`)
  }

  function resetAllActiveRooms() {
    console.debug("Removing all rooms from the active rooms list...")
    for (let id in _activeRooms) {
      removeRoom(id)
    }
  }

  function getRoom(id:string) {
    return _activeRooms[id]
  }

  return {
    addRoom,
    removeRoom,
    getRoom,
    makeUniqueRoom,
    getAllActiveRooms,
    resetAllActiveRooms,
  }
}

// Singleton RoomManager for the server to use
export const RoomManager = RoomManagerFactory()

// Singleton RoomManager with private functions included, for testing
export const TestableRoomManager = function() {
  const BaseManager = RoomManagerFactory()

  return {
    ...BaseManager,
    _roomIdIsUnique,
    _roomIdIsValid
  }
}()