import type { CustomServer, CustomServerSocket } from "@customTypes/socket"
import type Room from "../../classes/Room"
import type Player from "../../classes/Player"

/**
 * Configures the Room-specific event listeners for a socket.
 * @param socket
 * @param io 
 * @param room 
 * @param player 
 */
export default function setupRoomEvents(
  socket:CustomServerSocket,
  io:CustomServer,
  room:Room,
  player:Player
) {
  /**
   * Event fired when a player clicks the "change name" button
   */
  socket.on("changeName", () => {
    console.debug(`${player.id} requested name change`)
    room.setUniquePlayerName(player.id, true)
  })

  /**
   * Event fired when a player clicks the "ready" or "unready" button
   */
  socket.on("toggleReady", () => {
    console.debug(`${player.id} toggled ready state`)
    player.toggleReady()
    
    room.afterPlayerReady(player.id)
  })

  /**
   * Event fired when a player's turn is over
   */
  socket.on("nextPlayer", () => {
    console.debug(`${player.id} ended their turn`)
    const newCurrentPlayerId = room._game.nextPlayer()
    console.debug(`it is now ${newCurrentPlayerId}'s turn`)

    io.to(room.id).emit("gameStateChange", { currentPlayer: newCurrentPlayerId })
  })

  /**
   * Event fired when a player clicks a tile
   */
  socket.on("tileClick", (row:number, column:number) => {
    room._game.handleTileSelect(row, column, player.id)
    if (room._game.status === "chooseFavoriteTiles") {
      io.to(socket.id).emit("setFavoriteTile", row, column)
      if(room._game.transitionTo("running")) {
        io.to(room.id).emit("gameStateChange", { status: "running" })
      }
    }

    if (room._game.status === "running") {
      io.to(room.id).emit("gameStateChange", { currentPlayer: room._game.currentPlayerId, tiles: room._game.tiles })
    }

  })
}