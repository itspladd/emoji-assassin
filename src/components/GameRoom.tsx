import type { StateAccessors, StateActions } from "@customTypes/stateManagement";
import { playerNameString } from "../helpers/names";

import EventLog from "./EventLog";
import PlayerControls from "./PlayerControls";

import styles from './GameRoom.module.css'

interface GameRoomProps {
  id:string,
  actions:StateActions,
  accessors:StateAccessors
}

export default function GameRoom({
  id,
  actions,
  accessors
} : GameRoomProps) {
  console.log("rendering GameRoom")

  const allPlayers = accessors.allPlayers()
  const localPlayer = accessors.localPlayer()
  const tiles = accessors.tiles()
  const eventLog = accessors.eventLog()
  const connectionString = accessors.socketConnected() ? "Connected" : "Disconnected"
  const gameStarted = accessors.gameStarted()

  const playerNames = Object.values(allPlayers)
    .map(({ name, id, color, isReady }) => {
      const isClientPlayerString = (id === localPlayer.id) ? " (me)" : ""
      const completePlayerNameString = playerNameString(name) + isClientPlayerString

      // TODO: show connection status here once player leave/rejoin is implemented
      let playerIndicator = 
        gameStarted ? "" :
        isReady ? "Y" :
        "N"
      
      return (
        <li key={id} className={styles["player-name"]}>
          <span className={styles["color-square"] + " " + styles[color]}>{playerIndicator}</span>
          <span className={styles["name"]}>{completePlayerNameString}</span>
        </li>
      )
    })

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
        <h2>Room ID: {id}</h2>
        <span>{connectionString}</span>
      </header>
      <section id={styles["info-section"]}>

        <div>
          <div>
            <h3>Players</h3>
            <button onClick={() => actions.debug.readyAll(id)}>Ready all players</button>
          </div>
          <ul id={styles["player-list"]}>{playerNames}</ul>
        </div>


        <PlayerControls
          changeName={actions.room.changeName}
          toggleReady={actions.room.toggleReady}
          />

        <p>{gameStarted ? "Game Running" : "Waiting for everyone to be ready..."}</p>
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