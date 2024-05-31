import type { GameStatus } from "@customTypes/game";

interface PlayerControlsProps {
  changeName: () => void;
  toggleReady: () => void;
  gameStatus: GameStatus
}

export default function PlayerControls({
  changeName,
  toggleReady,
  gameStatus,
} : PlayerControlsProps) {

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

  const PlayerTurnControls = () => {
    return (
      <div>
        <p>Player Turn</p>
      </div>
    )
  }

  return (
    <>
      {gameStatus === "notStarted" && <PreGameControls />}
      {gameStatus === "running" && <PlayerTurnControls />}
    </>
  )
}