import type { Socket } from 'socket.io';
import type { ClientPlayerInfo, PlayerName } from '@customTypes/players';
import type { EventLogItem } from '@customTypes/events';

import { useState, useEffect } from 'react'

import { playerNameString } from '../helpers/names';
import { SOCKET_EVENTS } from '../socket/socketEvents';

export type PlayerList = Record<string, ClientPlayerInfo>

export interface SocketState {
  isConnected: boolean,
  eventLog: EventLogItem[],
  playersInRoom: PlayerList
}

export default function useSocket(socket:Socket):SocketState {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [eventLog, setEventLog] = useState<EventLogItem[]>([])
  const [playersInRoom, setPlayersInRoom] = useState<PlayerList>({})

  useEffect(() => {

    /** Add a socket event to the local event log */
    function logEvent(message:string) {
      const timestampDate = new Date()
      const timestamp = timestampDate.toLocaleString()
      console.debug(timestamp, message)
      setEventLog([...eventLog, {timestamp, message}])
    }

    function addPlayer(player:ClientPlayerInfo) {
      console.log("current:", playersInRoom)
      console.log("new:", {...playersInRoom, [player.id]:player})
      setPlayersInRoom((prev) => ({...prev, [player.id]:player}))
    }

    function removePlayer(id:string) {
      const currentPlayers = {...playersInRoom}
      delete currentPlayers[id]
      setPlayersInRoom({...currentPlayers})
    }

    function onConnect() {
      logEvent(`${socket.id} (you) connected`)
      setIsConnected(true);
    }

    function onDisconnect() {
      logEvent(`${socket.id} (you) disconnected`)
      setIsConnected(false);
    }

    /** Add the new player to the local list of players */
    function onPlayerJoined(player:ClientPlayerInfo) {
      logEvent(`${playerNameString(player.name)} (ID ${player.id}) joined the room`)
      addPlayer(player)
    }

    function onPlayerLeft(id:string) {
      const { name } = playersInRoom[id]
      
      logEvent(`${playerNameString(name)} (ID ${id}) left the room`)
      removePlayer(id)
    }

    function onPlayerNameChange(id: string, name:PlayerName) {
      const currentPlayers = {...playersInRoom}
      const prevName = currentPlayers[id].name
      logEvent(`${id} changed name from ${playerNameString(prevName)} to ${playerNameString(name)}`)

      currentPlayers[id].name = name

      setPlayersInRoom({...currentPlayers, [id]: {id, name}})
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined)
    socket.on(SOCKET_EVENTS.PLAYER_LEFT, onPlayerLeft)
    socket.on(SOCKET_EVENTS.PLAYER_NAME_CHANGED, onPlayerNameChange)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return {
    isConnected,
    eventLog,
    playersInRoom,
  }
}