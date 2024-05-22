import type { AppState } from "@customTypes/stateManagement";

import { useReducer } from "react";
import reducer from "./reducer";

import { socket } from '../../socket/client';
import useSocket from "../useSocket";
import { createRoomActions } from "./roomStateManager";
import { createSocketActions } from "./socketStateActions";
import { createEventLogActions } from "./eventLogStateActions";

export default function useStateManager() {
  const initialState:AppState = {
    socket: {
      socketInstance: socket,
      connected: false
    },
    room: {
      roomId: null,
      playersInRoom: {},
    },
    eventLog: []
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const actions = {
    room: createRoomActions(dispatch),
    socket: createSocketActions(dispatch),
    eventLog: createEventLogActions(dispatch)
  }
  
  useSocket(socket, actions)

  return {
    state,
    actions
  }
}