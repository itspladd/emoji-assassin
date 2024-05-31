
import { MouseEventHandler, useEffect } from 'react';
import axios from 'axios';
import { getRandomFromArray } from './helpers/arrays';

import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';

import GameRoom from './components/GameRoom';

import './reset.css'
import './App.css'

import useStateManager from './hooks/useStateManager';
import JoinRoomInput from './components/JoinRoomInput';
import useSocket from './hooks/useSocket';

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);

export function App() {
  console.log("rendering App")
  const {actions, accessors} = useStateManager()
  useSocket(accessors.socket(), actions)

  const roomId = accessors.roomId()
  
  const handleNewGameClick:MouseEventHandler<HTMLButtonElement> = async () => {
    console.log("Creating a new room")
    const response:{data: {newRoomId:string}} = await axios.post('/rooms')
    const roomId = response?.data?.newRoomId
    if (!roomId) {
      return console.error("Error: no newRoomId received. Response object: ", response)
    }

    actions.room.joinRoom(roomId)
  }

  /** DEV LOGIC ONLY *****************************************/
  /** Auto-join a debug game room when the component renders */
  const joinDebugRoom = async () => {
    console.log("Joining debug room")
    const response:{data: {debugRoomId:string}} = await axios.get('/rooms/debug')
    const debugRoomId = response?.data?.debugRoomId

    if (!debugRoomId) {
      return console.error("Error: no debug room ID received. Response object: ", response)
    }

    actions.room.joinRoom(debugRoomId)
  }

  useEffect(() => {
    // This will fire twice in dev mode due to the strict mode setting,
    // but the server prevents the same socket from joining a room multiple times
    if (import.meta.env.DEV) {
      joinDebugRoom()
    }

  }, [])
  /** END ***************************************************/

  return (
    <div>
      {!roomId && (
        <div className="home-screen">
          <h1>Emoji Assassin</h1>
    
          <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>

          <button onClick={handleNewGameClick}>
            Start a new game
          </button>

          <button onClick={joinDebugRoom}>
            Join debug room
          </button>

          <JoinRoomInput joinRoomAction={actions.room.joinRoom} />
        </div>
      )}

      {roomId && <GameRoom
        id={roomId}
        actions={actions}
        accessors={accessors}
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