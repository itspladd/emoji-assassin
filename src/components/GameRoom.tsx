import { type PlayerName } from "../types/players";

import { playerNameString } from "../helpers/names";

interface GameRoomProps {
  roomId: string;
  playerName: PlayerName;
}

export default function GameRoom({
  roomId,
  playerName
} : GameRoomProps) {

  const playerNames = [
    playerName
  ]

  return (
    <div>
      <h2>Room {roomId}</h2>
      <div>
        <h3>Players</h3>
        <ul>{playerNames.map(name => <li>{playerNameString(name)}</li>)}
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