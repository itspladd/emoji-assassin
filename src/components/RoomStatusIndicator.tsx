import type { RoomStatus } from "@customTypes/rooms";

const roomStatusMessages:Record<RoomStatus, string> = {
  "GAME_CAN_START": "Ready to begin the game!",
  "GAME_RUNNING": "",
  "NOT_ALL_PLAYERS_READY": "Waiting for all players to be ready...",
  "NOT_ENOUGH_PLAYERS": "Waiting for more players...",
  "TOO_MANY_PLAYERS": "Too many players in the room!",
}

export default function RoomStatusIndicator({
  status
 }:{
  status:RoomStatus
 }) {
  return (
    <p>{roomStatusMessages[status]}</p>
  )
}