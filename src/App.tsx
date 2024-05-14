import { useState } from 'react'
import './reset.css'
import './App.css'

import { getRandomAssassinEmoji, getRandomBombEmoji } from './helpers/getEmojis'

function App() {
  const [count, setCount] = useState(0)

  const bombEmojiHeader = getRandomBombEmoji()
  const assassinEmojiHeader = getRandomAssassinEmoji()

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