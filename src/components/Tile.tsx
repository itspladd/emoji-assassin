import { ClientGameTileInfo } from '@customTypes/game'

import styles from './Tile.module.css'
import { memo } from "react"

interface TileProps {
  tile: ClientGameTileInfo,
  id: string,
  isFavorite: boolean,
  isBomb: boolean,
  isSafe: boolean,
  isDisabled: boolean
}

function TileComponent({
  tile,
  id,
  isFavorite,
  isBomb,
  isDisabled,
  isSafe,
}: TileProps ) {

  // If the tile has been disabled, don't render anything at all.
  if (isDisabled) {
    return null
  }

  const { image } = tile

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
      id={id}
      className={tileClassNames}
      //onClick={onClick}
      onTouchStart={() => console.log("touchstart")}
      onTouchEnd={() => console.log("touchend")}
    >
      {image}
    </span>
  )
}

const Tile = memo(TileComponent)

export default Tile