import type { GameTile } from "@customTypes/game"

import styles from './Tile.module.css'
import { memo } from "react"

interface TileProps {
  tile: GameTile,
  isFavorite: boolean,
  isBomb: boolean,
  isDisabled: boolean
  onClick: () => void
}

function TileComponent({
  tile,
  isFavorite,
  isBomb,
  isDisabled,
  onClick
}: TileProps ) {
  console.log("rendering tile", tile.row, tile.column)
  const {
    row,
    column,
    image
  } = tile

  let tileClassNames = styles["tile"]

  if (isDisabled) {
    tileClassNames += " " + styles["disabled"]
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