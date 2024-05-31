import type { CustomServerSocket } from "@customTypes/socket"
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
  // io:CustomServer,
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
}