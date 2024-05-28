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
    .map(({ name, id, color }) => (
      <li key={id} className={styles["player-name"]}>
        <span className={styles["color-square"] + " " + styles[color]}></span>
        <span className={styles["name"]}>{playerNameString(name)}</span>
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

        <div>
          <h3>Players</h3>
          <ul id={styles["player-list"]}>{playerNames}</ul>
        </div>

        <div>
          <h3>Player controls</h3>
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