import type { StateAccessors, StateActions } from "@customTypes/stateManagement";


import styles from './DebugControls.module.css'

interface DebugControlsProps {
  actions: StateActions;
  accessors: StateAccessors;
}

export default function DebugControls({
  actions,
  accessors
} : DebugControlsProps
) {

  if (!import.meta.env.DEV) {
    return null
  }

  const socketConnected = accessors.socketConnected()
  const roomId = accessors.roomId()
  const gameStarted = accessors.gameStarted()

  return (
    <div className={styles["debug-controls"]}>
      <h3>Dev/debug controls</h3>
      <button 
        onClick={() => actions.debug.readyAll(roomId)}
        disabled={gameStarted}
      >
        Ready all players
      </button>
      <button 
        onClick={socketConnected ? actions.socket.disconnect : actions.socket.connect}
      >
        {socketConnected ? "Disconnect" : "Connect"} local socket
      </button>
    </div>
  )
}