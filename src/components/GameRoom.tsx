import type { AppState, ReducerActionPayload, StateActions } from "@customTypes/stateManagement";
import type { Dispatch } from "react";

import styles from './GameRoom.module.css'

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
        {message}
      </li>
    )
  })

  const testEmojis = [
    "❤️🍿🧂🥓🥞",
    "🕳️🎃🎁🎡🛒",
    "🎩🏀🎰🎮🪀",
    "🎷🪕🎻🪵🪜",
    "🪃⚰️💾🎥📺",
  ]

  const gameTiles = testEmojis.map((row:string, i:number) => {
    return (
      <li>
        {Array.from(row).map((emoji, k) => {
          return (
            <span key={`${i}${k}`}>
              {emoji}
            </span>
          )
        })}
      </li>
    )
  })

  return (
    <main id={styles["game-room-wrapper"]}>
      <header>
        <h2>Room ID: {room.roomId}</h2>

      </header>
      <section>
        <section id={styles["info-section"]}>
          <div id={styles["player-list"]}>
            <h3>Players</h3>
            <ul>{playerNames}</ul>
          </div>

          <div>
            <p>Player controls</p>
          </div>
        </section>

      </section>

      <section id={styles["game-board"]}>
        <p>Game board</p>
        {gameTiles}
      </section>

      <section id={styles["event-log"]}>
        <h3>Event Log</h3>
        <ul>
          {eventLogItems}
        </ul>
      </section>
    </main>
  )
}