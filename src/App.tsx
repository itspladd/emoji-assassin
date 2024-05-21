import { useState, ChangeEvent, MouseEventHandler } from 'react';
import { socket } from './socket/client';
import useSocket from './hooks/useSocket';
import { getRandomFromArray } from './helpers/arrays';
import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';
import { makeRandomName, playerNameString } from './helpers/names';
import axios from 'axios';

import LabeledInput from './components/LabeledInput'

import './reset.css'
import './App.css'
import GameRoom from './components/GameRoom';
import { SOCKET_EVENTS } from './socket/events';

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);
const startingName = makeRandomName();

export function App() {
  // @ts-expect-error Some annoying Socket type mismatch that isn't super important right now
  const [isConnected] = useSocket(socket);
  const [name, setName] = useState(startingName)
  const [currentRoomId, setCurrentRoomId] = useState<null | string>(null)
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
    const response:{data: {newRoomId:string}} = await axios.post('/rooms')
    const roomId = response?.data?.newRoomId
    if (!roomId) {
      console.error("Error: no newRoomId received. Response object: ", response)
    }
    console.log("id: ", roomId)
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId)
    setCurrentRoomId(roomId)
  }

  return (
    <div>
      {!currentRoomId && (
        <div className="home-screen">
          <h1>Emoji Assassin</h1>
    
          <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>
          <p>{connectionString}</p>
          <div className="card">
            <button onClick={changeName}>
              Change name
            </button>
          </div>
          <h3>Username: {playerNameString(name)}</h3>
          <h2>{currentRoomId}</h2>
            <button onClick={handleNewGameClick}>
              Start a new game
            </button>
            <LabeledInput
              label="Join an existing room"
              value={roomIdInput}
              onChange={handleRoomInputChange}
              placeholder = {"A1C2B3"}
            />
        </div>
      )}
        
        
      {currentRoomId && <GameRoom
        roomId={currentRoomId}
        playerName={name}
      />}
    </div>
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