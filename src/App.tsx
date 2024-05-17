import { useState, ChangeEvent, MouseEventHandler } from 'react';
import { socket } from './socket/client';
import useSocket from './hooks/useSocket';
import { getRandomFromArray } from './helpers/arrays';
import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';
import { makeRandomName, playerNameString } from './helpers/names';
import axios from 'axios';

import Game from './components/Game'
import LabeledInput from './components/LabeledInput'

import './reset.css'
import './App.css'

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);
const startingName = makeRandomName();

export function App() {
  // @ts-expect-error
  const [isConnected] = useSocket(socket);
  const [name, setName] = useState(startingName)
  const [currentRoomId, setCurrentRoomId] = useState(null)
  const [roomIdInput, setRoomIdInput] = useState("")

  const connectionString = isConnected ? "Connected" : "Disconnected"

  const changeName:MouseEventHandler<HTMLButtonElement> = () => {
    setName(makeRandomName())
  }

  const handleRoomInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value
    setRoomIdInput(newId)
  }

  const handleNewGameClick:MouseEventHandler<HTMLButtonElement> = async () => {
    console.log("Creating a new room")
    const result = await axios.post('/rooms')
    console.log(result)
  }

  return (
    <>
      <h1>Emoji Assassin</h1>

      <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>
      <p>{connectionString}</p>
      <div className="card">
        <button onClick={changeName}>
          Change name
        </button>
        <p>
        </p>
      </div>
      <h3>Username: {playerNameString(name)}</h3>
      {!currentRoomId && (
        <>
          <button onClick={handleNewGameClick}>
            Start a new game
          </button>
          <LabeledInput
            label="Join an existing room"
            value={roomIdInput}
            onChange={handleRoomInputChange}
            placeholder = {"A1C2B3"}
          />
        </>
      )}
      {currentRoomId && <Game id={currentRoomId} />}
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