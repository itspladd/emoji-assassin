
import { MouseEventHandler } from 'react';
import axios from 'axios';
import { getRandomFromArray } from './helpers/arrays';

import { BOMB_EMOJIS, ASSASSIN_EMOJIS } from './constants/emojis';

import GameRoom from './components/GameRoom';

import './reset.css'
import './App.css'

import useStateManager from './hooks/useStateManager';
import JoinRoomInput from './components/JoinRoomInput';
import useSocket from './hooks/useSocket';
import DebugAutoJoiner from './components/DebugAutoJoiner';

const bombEmojiHeader = getRandomFromArray(BOMB_EMOJIS);
const assassinEmojiHeader = getRandomFromArray(ASSASSIN_EMOJIS);

// Use env flag to auto-join debug room or stay on home screen when app starts
const autoJoinDebugRoom = import.meta.env.VITE_AUTO_JOIN_DEBUG_ROOM === "true"

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

  return (
    <div>
      { autoJoinDebugRoom && <DebugAutoJoiner /> }
      {!roomId && (
        <div className="home-screen">
          <h1>Emoji Assassin</h1>
    
          <h1>{assassinEmojiHeader} {bombEmojiHeader}</h1>

          <button onClick={handleNewGameClick}>
            Start a new game
          </button>

          <button onClick={actions.debug.joinDebugRoom}>
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