import type { Socket } from 'socket.io';
import type { PlayerName } from '@customTypes/players';

import { useState, useEffect } from 'react'

import { playerNameString } from '../helpers/names';
import { SOCKET_EVENTS } from '../socket/events';

export default function useSocket(socket:Socket) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [eventLog, setEventLog] = useState<string[]>([])
  const [playersInRoom, setPlayersInRoom] = useState<PlayerName[]>([])

  useEffect(() => {
    /** Add a socket event to the local event log */
    function logEvent(event:string) {
      console.debug(event)
      setEventLog([...eventLog, event])
    }

    function addPlayer(name:PlayerName) {
      setPlayersInRoom([...playersInRoom, name])
    }

    function removePlayer(name:PlayerName) {
      const leavingPlayer = playerNameString(name)

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
    function onPlayerJoined(name:PlayerName) {
      logEvent(`${playerNameString(name)} joined the room`)
      addPlayer(name)
    }

    function onPlayerLeft(name:PlayerName) {
      logEvent(`${playerNameString(name)} left the room`)
      addPlayer(name)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined)
    socket.on(SOCKET_EVENTS.PLAYER_LEFT, onPlayerLeft)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return [
    isConnected
  ]
}