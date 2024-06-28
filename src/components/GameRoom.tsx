import type { StateAccessors, StateActions } from "@customTypes/stateManagement";

import EventLog from "./EventLog";
import PlayerControls from "./PlayerControls";
import PlayerName from "./PlayerName";

import styles from './GameRoom.module.css'
import { GameStatus } from "@customTypes/game";
import Tile from "./Tile";
import { MouseEvent, useCallback } from "react";

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

  // Click handler, callbackified so it doesn't change every render
  const handleClick = useCallback((event) => {
    event.preventDefault()
    const id = event.target.id
    console.log(event)
    if (!id) {
      return;
    }
    const [tileIdentifier, rowColumn] = id.split("_")
    if (tileIdentifier !== "tile") {
      return;
    }

    const [row, column] = Array.from(rowColumn).map(num => Number(num))
    console.log(row, column)
    actions.game.tileClick(row, column, gameStatus)
  }, [gameStatus])

  // Create the list of tiles for display
  const gameTiles = tiles.map(tile => {
    const { row, column } = tile

    const rowColString = `${row}${column}`
    const tileId = `tile_${rowColString}`
    // Boolean values for modifying how the tile is displayed
    const isDisabled = !tile.active
    const isFavorite = myFavoriteTile?.[0] === row && myFavoriteTile?.[1] === column
    const isSafe = accessors.tileIsKnownSafe(row, column)
    const isBomb = isFavorite && myRole === "assassin"


    return (
      <Tile
        key={`${row}${column}`}
        id={tileId}
        tile={tile} 
        isFavorite={isFavorite}
        isSafe={isSafe}
        isBomb={isBomb}
        isDisabled={isDisabled}
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
        <div className={styles["board"]}
        onClick={handleClick}>
          {gameTiles}
        </div>

      </section>

      <EventLog events={eventLog} />
    </main>
  )
}