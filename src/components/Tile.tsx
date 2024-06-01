import type { GameTile } from "@customTypes/game"

import styles from './Tile.module.css'
import { useState } from "react"

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