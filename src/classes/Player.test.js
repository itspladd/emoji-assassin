import { describe, expect, it } from "vitest";
import Player from "./Player"

describe("Player class", () => {
  const testRoomId = "ABC123"

  it("can be instantiated and has the expected properties", () => {
    const newPlayer = new Player(serverSocket, io, testRoomId)

    expect(newPlayer).toBeInstanceOf(Player)
    expect(newPlayer._id).toEqual(serverSocket.id)
    expect(newPlayer.name.adjective).toBeTruthy()
  })
})