import type { RoomState } from "./rooms";

export interface DebugActions {
  readyAll: (roomId:RoomState['roomId']) => void;
  joinDebugRoom: () => void;
}