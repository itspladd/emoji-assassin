import type { GameStatus } from "@customTypes/game";
import { PlayerRole } from "@customTypes/players";

interface PlayerControlsProps {
  changeName: () => void;
  toggleReady: () => void;
  gameStatus: GameStatus;
  localPlayerRole: PlayerRole;
  isLocalPlayerTurn: boolean;
}

export default function PlayerControls({
  changeName,
  toggleReady,
  gameStatus,
  localPlayerRole,
  isLocalPlayerTurn
} : PlayerControlsProps) {

  const gameStarted = gameStatus === "running"

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
      {gameStarted && isLocalPlayerTurn && <LocalPlayerTurnControls />}
      {gameStarted && !isLocalPlayerTurn && <OtherPlayerTurnControls />}
    </>
  )
}