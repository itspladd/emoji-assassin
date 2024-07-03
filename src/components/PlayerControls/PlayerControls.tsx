import type { GameStatus } from "@customTypes/game";
import type { PlayerRole } from "@customTypes/players";

interface PlayerControlsProps {
  changeName: () => void;
  toggleReady: () => void;
  endTurn: () => void;
  gameStatus: GameStatus;
  localPlayerRole: PlayerRole;
  isLocalPlayerTurn: boolean;
  playerInstructions: string;
}

export default function PlayerControls({
  changeName,
  toggleReady,
  endTurn,
  gameStatus,
  localPlayerRole,
  isLocalPlayerTurn,
  playerInstructions,
} : PlayerControlsProps) {

  const gameStarted = gameStatus !== "notStarted"

  // Don't show turn order messages in the opening phase
  const showTurns = gameStarted && gameStatus !== "chooseFavoriteTiles"

  const PreGameControls = () => {
    return (
      <div>
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