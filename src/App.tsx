import type { ClientPlayerInfo } from '@customTypes/players';

import { useState, ChangeEvent, MouseEventHandler } from 'react';
import { socket } from './socket/client';
import useSocket from './hooks/useSocket';
import { getRandomFromArray } from './helpers/arrays';
import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';
import { playerNameString } from './helpers/names';
import axios from 'axios';

import LabeledInput from './components/LabeledInput'

import './reset.css'
import './App.css'
import GameRoom from './components/GameRoom';
import { SOCKET_EVENTS } from './socket/socketEvents';

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);

export function App() {
  const {
    isConnected,
    eventLog,
    playersInRoom
  // @ts-expect-error Some annoying Socket type mismatch that isn't super important right now
  } = useSocket(socket);
  const [currentRoomId, setCurrentRoomId] = useState<null | string>(null)
  const [roomIdInput, setRoomIdInput] = useState("")

  const connectionString = isConnected ? "Connected" : "Disconnected"

  const changeName:MouseEventHandler<HTMLButtonElement> = () => {
    socket.emit(SOCKET_EVENTS.CHANGE_NAME)
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
      return console.error("Error: no newRoomId received. Response object: ", response)
    }
    console.log("id: ", roomId)
    socket.connect()
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId)
    setCurrentRoomId(roomId)
  }

  const handleJoinRoomSubmit:MouseEventHandler<HTMLButtonElement> = async () => {
    const idToJoin = roomIdInput
    const response:{data: {roomIdValid:boolean}} = await axios.get(`/rooms/${idToJoin}`)
    const roomIdValid = response?.data?.roomIdValid

    if (typeof roomIdValid !== "boolean") {
      return console.error(`GET /rooms/${idToJoin} failed. Response object:`, response)
    }
    if (roomIdValid === false) {
      return console.debug(`Invalid ID`)
    }

    socket.connect()
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, idToJoin)
  }

  const currentPlayer:ClientPlayerInfo | null = socket.id ? playersInRoom[socket.id] : null

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
          <h3>Username: {currentPlayer ? playerNameString(currentPlayer.name) : "..."}</h3>
          <h2>{currentRoomId}</h2>
            <button onClick={handleNewGameClick}>
              Start a new game
            </button>
            <div>
              <button onClick={handleJoinRoomSubmit}>Join existing room</button>
              <LabeledInput
                label="Room ID"
                value={roomIdInput}
                onChange={handleRoomInputChange}
                placeholder = {"A1C2B3"}
              />
            </div>

        </div>
      )}
        
        
      {currentRoomId && <GameRoom
        roomId={currentRoomId}
        eventLog={eventLog}
        playersInRoom={playersInRoom}
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