import type { ClientPlayerList } from "@customTypes/players";
import type { EventLogItem } from "@customTypes/events";
import type { GameTile } from "@customTypes/game";

import { playerNameString } from "../helpers/names";

import styles from './GameRoom.module.css'
import EventLog from "./EventLog";

interface GameRoomProps {
  roomId: string,
  allPlayers: ClientPlayerList,
  eventLog: EventLogItem[],
  tiles: GameTile[],
  changeName: () => void
}

export default function GameRoom({
  roomId,
  allPlayers,
  eventLog,
  tiles,
  changeName
} : GameRoomProps) {
  console.log("rendering GameRoom")

  const playerNames = Object.values(allPlayers)
    .map(({ name, id }) => (
      <li key={id}>
        {playerNameString(name)}
      </li>
    ))



  const gameTiles = tiles.map(tile => {
    const {
      row,
      column,
      image
    } = tile

    return (
      <span
        key={`${row}${column}`}
        id={`${row}${column}`}
        className={styles["tile"]}
      >
        {image}
      </span>
    )
  })

  return (
    <main id={styles["game-room-wrapper"]}>
      <header>
        <h2>Room ID: {roomId}</h2>

      </header>
      <section id={styles["info-section"]}>

        <div id={styles["player-list"]}>
          <h3>Players</h3>
          <ul>{playerNames}</ul>
        </div>

        <div>
          <p>Player controls</p>
          <button onClick={changeName}>
            Change name
          </button>
        </div>

      </section>

      <section id={styles["game-board-section"]}>
        <div id={styles["board"]}>
          {gameTiles}
        </div>

      </section>

      <EventLog events={eventLog} />
    </main>
  )
}