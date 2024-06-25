import { RoomId } from "@customTypes/rooms";
import { CustomServer, CustomServerSocket, ServerToClientEvents } from "@customTypes/socket";

/**
 * Convenience "wrapper" class to handle communication to rooms/players.
 * Abstracts the socket server and room ID away from individual event emissions.
 */
export default class RoomEmitter {
  
  constructor(
    private server:CustomServer,
    protected roomId:Exclude<RoomId, null>
  ) {

  }

  emitToRoom = <Ev extends keyof ServerToClientEvents>(event: Ev, ...args:Parameters<ServerToClientEvents[Ev]>) => {
    this.server.to(this.roomId).emit(event, ...args)
  }

  emitToPlayer = <Ev extends keyof ServerToClientEvents>(playerId: string, event: Ev, ...args:Parameters<ServerToClientEvents[Ev]>) => {
    this.server.to(playerId).emit(event, ...args)
  }

  emitToPlayerFactory = <Ev extends keyof ServerToClientEvents>(socket: CustomServerSocket) => {
    return (event: Ev, ...args:Parameters<ServerToClientEvents[Ev]>) => this.server.to(socket.id).emit(event, ...args)
  }

  emitToOtherPlayersFactory = <Ev extends keyof ServerToClientEvents>(socket: CustomServerSocket) => {
    return (event: Ev, ...args:Parameters<ServerToClientEvents[Ev]>) => socket.to(this.roomId).emit(event, ...args)
  }
}