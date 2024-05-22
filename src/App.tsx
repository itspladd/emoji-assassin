
import { useState, ChangeEvent, MouseEventHandler } from 'react';
import axios from 'axios';
import { getRandomFromArray } from './helpers/arrays';

import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';

import LabeledInput from './components/LabeledInput'
import GameRoom from './components/GameRoom';

import { SOCKET_EVENTS } from './socket/socketEvents';

import './reset.css'
import './App.css'

import useStateManager from './hooks/useStateManager';

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);

export function App() {
  const {state, actions} = useStateManager()
/*   const {
    isConnected,
    eventLog,
    playersInRoom
  // @ts-expect-error Some annoying Socket type mismatch that isn't super important right now
  } = useSocket(socket); */
  const [roomIdInput, setRoomIdInput] = useState("")

  const { 
    socketInstance: socket,
    connected
  } = state.socket 

  const {
    roomId
  } = state.room
  
  const connectionString = connected ? "Connected" : "Disconnected"

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
    actions.room.joinRoom(roomId)
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
    actions.room.joinRoom(idToJoin)
  }


  return (
    <div>
      {!roomId && (
        <div className="home-screen">
          <h1>Emoji Assassin</h1>
    
          <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>
          <p>{connectionString}</p>
          <div className="card">
            <button onClick={changeName}>
              Change name
            </button>
          </div>
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
        
        
      {roomId && <GameRoom
        state={state}
        actions={actions}
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