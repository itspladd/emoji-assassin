
import type { CustomClientSocket } from '@customTypes/socket';
import type { StateActions } from '@customTypes/stateManagement';
import type { ClientPlayerInfo, PlayerName } from '@customTypes/players';
import { useEffect } from 'react';
import { playerNameString } from '../helpers/names';

/**
 * Initializes the client socket connection and hooks it up to the state management system.
 * @param socket 
 * @param dispatch 
 */
export default function useSocket(socket: CustomClientSocket, actions:StateActions) {

  const { log } = actions.eventLog

  useEffect(() => {
    console.debug('useSocket: useEffect fired')
  
    function onConnect() {
      log(`${socket.id} (you) connected`)
      actions.socket.connect()
    }
  
    function onDisconnect() {
      log(`${socket.id} (you) disconnected`)
      actions.socket.disconnect()
    }
    
    function onPlayerJoined(player:ClientPlayerInfo) {
      log(`${playerNameString(player.name)} (ID ${player.id}) joined the room`)
      actions.room.addPlayer(player)
    }

    function onPlayerLeft(id:string) {      
      log(`Player ID ${id} left the room`)
      actions.room.removePlayer(id)
    }

    function onPlayerNameChange(id: string, name:PlayerName) {
      log(`${id} changed name to ${playerNameString(name)}`)
      actions.room.editPlayer(id, { name })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    socket.on("playerJoined", onPlayerJoined)
    socket.on("playerLeft", onPlayerLeft)
    socket.on("playerChangedName", onPlayerNameChange)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("playerJoined", onPlayerJoined)
      socket.off("playerLeft", onPlayerLeft)
      socket.off("playerChangedName", onPlayerNameChange)
    };
  }, [])
}