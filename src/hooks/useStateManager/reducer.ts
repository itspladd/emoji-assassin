import type { AppState, ReducerDispatchFunctionList, ReducerActionPayload, ReducerDispatchType } from "@customTypes/stateManagement";

import { RoomStateDispatchFunctions } from "./roomStateManager";
import { SocketStateDispatchFunctions } from "./socketStateActions";
import { EventLogDispatchFunctions } from "./eventLogStateActions";

const reducerActions:ReducerDispatchFunctionList<ReducerDispatchType> = {
  ...RoomStateDispatchFunctions,
  ...SocketStateDispatchFunctions,
  ...EventLogDispatchFunctions
}

export default function reducer(state:AppState, action:ReducerActionPayload) {
  if (!state) {
    throw new Error('Reducer called with empty state: ' + JSON.stringify(state))
  }
  if (!action?.type) {
    throw new Error('Reducer called with bad action payload: ' + JSON.stringify(action))
  }
  const { type, data } = action

  const actionFunction = reducerActions[type]

  if (typeof actionFunction !== "function") {
    throw new Error(`Reducer called with unknown action: '${type}'. Available actions: ${JSON.stringify(Object.keys(reducerActions))}`)
  }

  return actionFunction(state, data)
}