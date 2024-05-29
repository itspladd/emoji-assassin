import type { ClientPlayerList } from "@customTypes/players";
import type { EventLogItem } from "@customTypes/events";
import type { GameTile } from "@customTypes/game";

import { playerNameString } from "../helpers/names";

import styles from './GameRoom.module.css'
import EventLog from "./EventLog";
import { StateAccessors, StateActions } from "@customTypes/stateManagement";

interface GameRoomProps {
  actions:StateActions,
  accessors:StateAccessors
}

export default function GameRoom({
  actions,
  accessors
} : GameRoomProps) {
  console.log("rendering GameRoom")

  const roomId = accessors.roomId()
  const allPlayers = accessors.allPlayers()
  const localPlayer = accessors.localPlayer()
  const tiles = accessors.tiles()
  const eventLog = accessors.eventLog()
  const connectionString = accessors.socketConnected() ? "Connected" : "Disconnected"

  const playerNames = Object.values(allPlayers)
    .map(({ name, id, color, isReady }) => (
      <li key={id} className={styles["player-name"]}>
        <span className={styles["color-square"] + " " + styles[color]}>{isReady ? "Y" : "N"}</span>
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
        <span>{connectionString}</span>
      </header>
      <section id={styles["info-section"]}>

        <div>
          <h3>Players</h3>
          <ul id={styles["player-list"]}>{playerNames}</ul>
        </div>

        <div>
          <h3>Player controls</h3>
          <button onClick={actions.room.changeName}>
            Change name
          </button>
          <button onClick={actions.room.toggleReady}>
            Ready!
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