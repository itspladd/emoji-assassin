import type { GameStatus } from "@customTypes/game";
import type { PlayerRole } from "@customTypes/players";

const instructionMessages = {
  readyUp: "Hit the Ready button when you're ready to play!",
  readiedAndWaiting: "",
  placeBomb: "Place the bomb!",
  chooseFavorite: "Choose a favorite emoji!",
  assassinTurn: "Pick a tile. Try to keep the Innocent players from getting suspicious!",
  innocentTurn: "Pick a tile. Try to figure out who the Assassin is, and avoid clicking on their Bomb tile!",
  otherTurn: "Another player is taking their turn. Click a tile to suggest which tile they should pick!",
  gameOver: "Game ended"
} 

interface PlayerInstructionsPayload {
  gameStatus: GameStatus,
  playerRole: PlayerRole,
  isPlayerTurn: boolean,
  isPlayerReady: boolean
}

export function getPlayerInstructions({
  gameStatus,
  playerRole,
  isPlayerTurn,
  isPlayerReady,
} : PlayerInstructionsPayload):string {
  
  if (gameStatus === "notStarted") {
    return isPlayerReady 
      ? instructionMessages.readiedAndWaiting
      : instructionMessages.readyUp
  }

  if (gameStatus === "chooseFavoriteTiles") {
    return playerRole === "assassin"
      ? instructionMessages.placeBomb
      : instructionMessages.chooseFavorite
  }

  if (gameStatus === "running") {
    return isPlayerTurn
      ? playerRole === "assassin"
      ? instructionMessages.assassinTurn
      : instructionMessages.innocentTurn
      : instructionMessages.otherTurn
  }

  if (gameStatus === "gameOver") {
    return instructionMessages.gameOver
  }

  return "Error: No player instruction message found for current game state."
}