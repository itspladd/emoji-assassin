import type { AppState, ReducerActionPayload, StateActions } from "@customTypes/stateManagement";
import type { Dispatch } from "react";

import { playerNameString } from "../helpers/names";

interface GameRoomProps {
  state: AppState;
  actions: StateActions;
}

export default function GameRoom({
  state,
  actions
} : GameRoomProps) {
  console.log("rendering GameRoom")
  const {
    room,
    eventLog
  } = state

  const playerNames = Object.values(room.playersInRoom)
    .map(({ name, id }) => (
      <li key={id}>
        {playerNameString(name)}
      </li>
    ))

  const eventLogItems = eventLog.map(({ message, timestamp }) => {
    return (
      <li key={timestamp}>
        {timestamp}: {message}
      </li>
    )
  })

  return (
    <div>
      <h2>Room {room.roomId}</h2>
      <div>
        <h3>Players</h3>
        <ul>{playerNames}
        </ul>
        <h3>Event Log</h3>
        <ul>
          {eventLogItems}
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