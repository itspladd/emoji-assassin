// Note the renamed default import here, since "Tile"
import type GameTile from '../classes/GameTile'

import styles from './Tile.module.css'
import { memo } from "react"

interface TileProps {
  tile: GameTile,
  isFavorite: boolean,
  isBomb: boolean,
  isSafe: boolean,
  isDisabled: boolean
  onClick: () => void
}

function TileComponent({
  tile,
  isFavorite,
  isBomb,
  isDisabled,
  isSafe,
  onClick
}: TileProps ) {

  if (isDisabled) {
    return null
  }

  const {
    row,
    column,
    image
  } = tile

  let tileClassNames = styles["tile"]

  if (isSafe) {
    tileClassNames += " " + styles["safe"]
  }
  else if (isBomb) {
    tileClassNames += " " + styles["bomb"]
  }
  else if (isFavorite) {
    tileClassNames += " " + styles["favorite"]
  }



  return (
    <span
      id={`${row}${column}`}
      className={tileClassNames}
      onClick={onClick}
    >
      {image}
    </span>
  )
}

const Tile = memo(TileComponent)

export default Tile