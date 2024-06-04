import type { GameTile } from "@customTypes/game"

import styles from './Tile.module.css'

interface TileProps {
  tile: GameTile,
  isFavorite: boolean,
  isBomb: boolean,
  isDisabled: boolean
  onClick: () => void
}

export default function Tile({
  tile,
  isFavorite,
  isBomb,
  isDisabled,
  onClick
}: TileProps ) {
  const {
    row,
    column,
    image
  } = tile

  let tileClassNames = styles["tile"]

  if (isFavorite) {
    tileClassNames += " " + styles["favorite"]
  }

  if (isDisabled) {
    tileClassNames += " " + styles["disabled"]
  }

  if (isBomb) {
    tileClassNames += " " + styles["bomb"]
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