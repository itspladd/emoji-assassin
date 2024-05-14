const BOMB_EMOJIS = ["💣", "🧨", "💥", "🎆"]
const ASSASSIN_EMOJIS = ["🕵️", "🥷", "🦹", "🕴️"]

export const getRandomBombEmoji = ():string => {
  const numEmojis = BOMB_EMOJIS.length
  const index = Math.floor(Math.random() * numEmojis)

  return BOMB_EMOJIS[index]
}

export const getRandomAssassinEmoji = ():string => {
  const numEmojis = ASSASSIN_EMOJIS.length
  const index = Math.floor(Math.random() * numEmojis)

  return ASSASSIN_EMOJIS[index]
}