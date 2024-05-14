import { useState } from 'react'
import './reset.css'
import './App.css'

import { getRandomFromArray } from './helpers/arrays'
import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis'

function App() {
  const [count, setCount] = useState(0)

  const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS)
  const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS)

  return (
    <>
      <h1>Emoji Assassin</h1>

      <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
        </p>
      </div>
    </>
  )
}

export default App

/*

Example code for importing an image

import reactLogo from './assets/react.svg'

<a href="https://react.dev" target="_blank">
    <img src={reactLogo} className="logo react" alt="React logo" />
</a>
*/