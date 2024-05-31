import type { ClientPlayerInfo, PlayerName } from "@customTypes/players"
import { playerNameString } from "../helpers/names";

import styles from "./PlayerName.module.css"

interface PlayerNameProps {
  player: ClientPlayerInfo;
  isLocalPlayer: boolean;
  isCurrentPlayer: boolean;
  gameRunning: boolean;
}

export default function PlayerName ({
  player,
  isLocalPlayer,
  isCurrentPlayer,
  gameRunning
} : PlayerNameProps) {

  const {
    id,
    name,
    color,
    isReady
  } = player

  const isLocalPlayerString = isLocalPlayer ? " (me)" : ""
  const completePlayerNameString = playerNameString(name) + isLocalPlayerString

  const currentPlayerClass = isCurrentPlayer ? styles["current-player"] : ""

  // TODO: show connection status here once player leave/rejoin is implemented
  let playerIndicator = gameRunning ? "" :
    isReady ? "Y" : "N"
  
  return (
    <li key={id} className={styles["player-name"]}>
      <span className={styles["color-square"] + " " + styles[color]}>{playerIndicator}</span>
      <span className={styles["name"] + " " + currentPlayerClass}>{completePlayerNameString}</span>
    </li> 
  )
}