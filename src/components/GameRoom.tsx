import type { PlayerName } from "@customTypes/players";
import type { EventLogItem } from "@customTypes/events";

import { playerNameString } from "../helpers/names";
import { PlayerList } from "../hooks/useSocket";

interface GameRoomProps {
  roomId: string;
  playersInRoom: PlayerList;
  eventLog: EventLogItem[];
}

export default function GameRoom({
  roomId,
  playersInRoom,
  eventLog
} : GameRoomProps) {

  const playerNames = Object.values(playersInRoom)
    .map(({ name, id }) => (
      <li key={id}>
        {playerNameString(name)}
      </li>
    ))

  return (
    <div>
      <h2>Room {roomId}</h2>
      <div>
        <h3>Players</h3>
        <ul>{playerNames}
        </ul>
        <h3>Event Log</h3>
        <ul>

        </ul>
      </div>
      <div>
        <p>Game board</p>
      </div>
      <div>
        <p>Player controls</p>
      </div>
    </div>
  )
}