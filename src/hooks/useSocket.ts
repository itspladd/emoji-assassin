
import type { CustomClientSocket, ServerToClientEvents } from '@customTypes/socket';
import type { StateActions } from '@customTypes/stateManagement';
import type { ClientPlayerInfo, PlayerName } from '@customTypes/players';
import { useEffect } from 'react';
import { playerNameString } from '../helpers/names';
import { RoomState, RoomStatus } from '@customTypes/rooms';
import { ClientGameState } from '@customTypes/game';

/**
 * Initializes the client socket connection and hooks it up to the state management system.
 * @param socket 
 * @param dispatch 
 */
export default function useSocket(socket: CustomClientSocket, actions:StateActions) {
  // Tracker to prevent creating extra handlers
  let socketInitDone = false

  // Extract log function for convenience
  const { log } = actions.eventLog

  useEffect(() => {
    console.debug('useSocket: useEffect firing. Init value:', socketInitDone)
    if (socketInitDone) {
      return
    }
  
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

    function onPlayerToggledReady(id: string, isReady:boolean) {
      actions.room.editPlayer(id, { isReady })
    }

    function onPlayerHitBomb(id:string) {
      actions.room.editPlayer(id, { active: false })
    }

    function onSyncRoomAndGameState(room:RoomState, game:ClientGameState) {
      log(`Syncing room and game state...`)
      actions.room.setRoomState(room)
      actions.game.setPublicGameState(game)
    }

    function onRoomStatusChange(message:RoomStatus) {
      actions.room.changeRoomStatus(message)
    }

    function onGameStart(game:ClientGameState) {
      actions.game.setPublicGameState(game)
    }

    function onGameStateChange(game:Partial<ClientGameState>) {
      actions.game.updateGameState(game)
    }

    function onSetFavoriteTile(row:number, column:number) {
      actions.game.setFavoriteTile(row, column)
    }

    function onKnownSafeTileUpdate(locations: [number, number][]) {
      actions.game.setKnownSafeTiles(locations)
    }

    const eventHandlerMap:ServerToClientEvents = {
      connect: onConnect,
      disconnect: onDisconnect,
      playerJoined: onPlayerJoined,
      playerLeft: onPlayerLeft,
      playerChangedName: onPlayerNameChange,
      playerHitBomb: onPlayerHitBomb,
      syncRoomAndGameState: onSyncRoomAndGameState,
      roomStatusChange: onRoomStatusChange,
      playerToggledReady: onPlayerToggledReady,
      gameStart: onGameStart,
      gameStateChange: onGameStateChange,
      setFavoriteTile: onSetFavoriteTile,
      knownSafeTilesUpdate: onKnownSafeTileUpdate,
    }

    // Init event listeners
    const keys = Object.keys(eventHandlerMap) as Array<keyof typeof eventHandlerMap>
    keys.forEach((e) => {
      socket.on(e, eventHandlerMap[e])
    })

    // Set tracker to indicate that we've created the listeners
    socketInitDone = true
    return () => {
      // Clean up event listeners
      keys.forEach(e => {
        socket.off(e, eventHandlerMap[e])
      })

      // Reset the tracker
      socketInitDone = false
    };
  }, [socketInitDone])
}