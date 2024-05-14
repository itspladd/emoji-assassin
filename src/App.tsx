import { useState, useMemo, ChangeEvent } from 'react';
import { socket } from './socket/client';
import useSocket from './hooks/useSocket';
import { getRandomFromArray } from './helpers/arrays';
import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';

import Game from './components/Game'
import LabeledInput from './components/LabeledInput'

import './reset.css'
import './App.css'

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);

export function App() {
  // @ts-expect-error
  const [isConnected] = useSocket(socket);
  const [count, setCount] = useState(0);
  const [name, setName] = useState("")
  const [gameId, setGameId] = useState(null);

  const connectionString = isConnected ? "Connected" : "Disconnected";

  const handleNameChange = (event:ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <>
      <h1>Emoji Assassin</h1>

      <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>
      <p>{connectionString}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
        </p>
      </div>
      {!gameId && (
        <LabeledInput
          label="Username"
          value={name}
          onChange={handleNameChange}
          placeholder = {"Placeholder Name"}
        />
      )}
      {gameId && <Game id={gameId} />}
    </>
  );
}

export default App

/*

Example code for importing an image

import reactLogo from './assets/react.svg'

<a href="https://react.dev" target="_blank">
    <img src={reactLogo} className="logo react" alt="React logo" />
</a>
*/