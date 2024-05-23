import type { AppState, StateActions } from "@customTypes/stateManagement";

import { playerNameString } from "../helpers/names";

import styles from './GameRoom.module.css'

interface GameRoomProps {
  state: AppState;
}

export default function GameRoom({
  state
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
    "❤️", "🍿", "🧂", "🥓", "🥞",
    "🕳️", "🎃", "🎁", "🎡", "🛒",
    "🎩", "🏀", "🎰", "🎮", "🪀",
    "🎷", "🪕", "🎻", "🪵", "🪜",
    "🪃", "⚰️", "💾", "🎥", "📺",
  ]

  const gameTiles = testEmojis.map((emoji:string, i:number) => {
    const row = Math.floor(i/5)
    const col = i % 5

    return (
      <span
        key={`${row}${col}`}
        id={`${row}${col}`}
        className={styles["tile"]}
      >
        {emoji}
      </span>
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

      <section id={styles["game-board-section"]}>
        <div id={styles["board"]}>
          {gameTiles}
        </div>

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