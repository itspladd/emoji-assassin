import type { StateAccessors, StateActions } from "@customTypes/stateManagement";

import EventLog from "./EventLog";
import PlayerControls from "./PlayerControls";
import PlayerName from "./PlayerName";

import styles from './GameRoom.module.css'
import { GameStatus } from "@customTypes/game";
import Tile from "./Tile";
import { useCallback } from "react";

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
  const currentPlayer = accessors.currentPlayer()
  const myRole = accessors.myRole()
  const myId = accessors.socket().id
  
  const tiles = accessors.tiles()
  const eventLog = accessors.eventLog()
  const connectionString = accessors.socketConnected() ? "Connected" : "Disconnected"
  const gameStatus = accessors.gameStatus()
  const myFavoriteTile = accessors.myFavoriteTile()
  const myKnownSafeTiles = accessors.myKnownSafeTiles()

  const gameRunning = gameStatus !== "notStarted"

  const statusMessages:Record<GameStatus, string> = {
    notStarted: "Not started yet",
    chooseFavoriteTiles: myRole === "assassin" ? "Place the bomb!" : "Choose your favorite emoji!",
    running: "Game running",
    gameOver: "Game ended"
  } 

  const playerNames = Object.values(allPlayers)
    .map(player => {
      return (
        <PlayerName
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayer?.id}
          isLocalPlayer={player.id === myId}
          gameRunning={gameRunning}
        />
      )
    })

  const gameTiles = tiles.map(tile => {
    const { row, column } = tile
    const isFavorite = myFavoriteTile?.[0] === row && myFavoriteTile?.[1] === column
    const isSafe = accessors.tileIsKnownSafe(row, column)
    const isBomb = isFavorite && myRole === "assassin"
    const handleClick = useCallback(() => actions.game.tileClick(row, column, gameStatus), [gameStatus])

    return (
      <Tile
        key={`${row}${column}`}
        tile={tile} 
        isFavorite={isFavorite}
        isSafe={isSafe}
        isBomb={isBomb}
        isDisabled={false}
        onClick={handleClick}
      />
    )
  })

  return (
    <main className={styles["game-room-wrapper"]}>
      <header>
        <h2>Room ID: {id}</h2>
        <span>{connectionString}</span>
      </header>
      
      <section className={styles["info-section"]}>

        <div>
          <div>
            <h3>Players</h3>
            { !gameRunning && (
              <button onClick={() => actions.debug.readyAll(id)}>Ready all players</button>
            )}
            
          </div>
          <ul className={styles["player-list"]}>{playerNames}</ul>
        </div>


        <PlayerControls
          gameStatus={gameStatus}
          changeName={actions.room.changeName}
          toggleReady={actions.room.toggleReady}
          localPlayerRole={myRole}
          isLocalPlayerTurn={myId === currentPlayer?.id}
          endTurn={actions.game.endTurn}
        />

      </section>

      <p>{statusMessages[gameStatus]}</p>

      <section className={styles["game-board-section"]}>
        <div className={styles["board"]}>
          {gameTiles}
        </div>

      </section>

      <EventLog events={eventLog} />
    </main>
  )
}