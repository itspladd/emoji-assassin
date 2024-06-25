import { ClientGameTileInfo } from '@customTypes/game'

import styles from './Tile.module.css'
import { memo } from "react"

interface TileProps {
  tile: ClientGameTileInfo,
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

  // If the tile has been disabled, don't render anything at all.
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