import type { StateAccessors, StateActions } from "@customTypes/stateManagement";

import EventLog from "./EventLog";
import PlayerControls from "./PlayerControls";
import PlayerName from "./PlayerName";

import styles from './GameRoom.module.css'
import { GameStatus } from "@customTypes/game";

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
  const currentPlayer = accessors.currentPlayer()
  
  const tiles = accessors.tiles()
  const eventLog = accessors.eventLog()
  const connectionString = accessors.socketConnected() ? "Connected" : "Disconnected"
  const gameStatus = accessors.gameStatus()

  const gameRunning = gameStatus === "running"

  const statusMessages:Record<GameStatus, string> = {
    notStarted: "Not started yet",
    running: "Game running",
    gameOver: "Game ended"
  } 

  const playerNames = Object.values(allPlayers)
    .map(player => {
      return (
        <PlayerName 
          player={player}
          isCurrentPlayer={player.id === currentPlayer?.id}
          isLocalPlayer={player.id === localPlayer.id}
          gameRunning={gameRunning}
        />
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
          gameStatus={gameStatus}
          changeName={actions.room.changeName}
          toggleReady={actions.room.toggleReady}
        />

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