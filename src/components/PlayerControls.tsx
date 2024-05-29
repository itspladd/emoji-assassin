interface PlayerControlsProps {
  changeName: () => void;
  toggleReady: () => void;
}

export default function PlayerControls({
  changeName,
  toggleReady
} : PlayerControlsProps) {
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