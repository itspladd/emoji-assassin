import styles from './DebugControls.module.css'

export default function DebugReadyAllPlayers({
  readyAll
} : {
  readyAll: () => void
}) {
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <button
      className={styles['debug-button']}
      onClick={readyAll}
    >[DEV] Ready all</button>
  )
}