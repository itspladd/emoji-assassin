import type { StateAccessors, StateActions } from "@customTypes/stateManagement";

import { DebugReadyAllPlayers } from '../DebugControls'

interface PlayerControlsProps {
  actions: StateActions;
  accessors: StateAccessors;
}

export default function PlayerControls({
  actions,
  accessors
} : PlayerControlsProps) {

  const gameStarted = accessors.gameStarted()
  const gameStatus = accessors.gameStatus()
  const localPlayerRole = accessors.myRole()
  const isLocalPlayerTurn = accessors.localPlayerTurn()
  const playerInstructions = accessors.playerInstructions()
  const roomId = accessors.roomId()

  const {
    changeName,
    toggleReady,
  } = actions.room

  const {
    endTurn
  } = actions.game

  // Don't show turn order messages in the opening phase
  const showTurns = gameStarted && gameStatus !== "chooseFavoriteTiles"

  const PreGameControls = () => {
    return (
      <div>
        <DebugReadyAllPlayers readyAll={() => actions.debug.readyAll(roomId)} />
        <button onClick={changeName}>
          Change my name
        </button>
        <button onClick={toggleReady}>
          Ready!
        </button>
      </div>
    )
  }

  const LocalPlayerTurnControls = () => {
    return (
      <div>
        <p>Your turn!</p>
        <button onClick={endTurn}>End turn</button>
      </div>
    )
  }

  const OtherPlayerTurnControls = () => {
    return (
      <div>
        <p>Other player's turn!</p>
      </div>
    )
  }

  return (
    <>
      {gameStatus === "notStarted" && <PreGameControls />}
      {gameStarted && <p>Your role: {localPlayerRole}!</p>}
      <p>{playerInstructions}</p>
      {showTurns && isLocalPlayerTurn && <LocalPlayerTurnControls />}
      {showTurns && !isLocalPlayerTurn && <OtherPlayerTurnControls />}
    </>
  )
}