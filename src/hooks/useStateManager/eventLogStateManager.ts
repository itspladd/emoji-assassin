import type { EventLogActions, EventLogItem, EventLogStateDispatchType } from "@customTypes/events";
import type { AppState, ReducerActionPayload, ReducerDispatchFunctionList } from "@customTypes/stateManagement";
import { stateChangeError } from "../../helpers/logging";
import type { Dispatch } from "react";

const add_event_to_log = (state: AppState, data?: { event?:EventLogItem }) => {
  if(!data?.event) {
    return stateChangeError("Attempted to add an event to the event log, but no event data was passed.", state, data)
  }

  return {
    ...state,
    eventLog: [data.event, ...state.eventLog]
  }
}

export const EventLogDispatchFunctions:ReducerDispatchFunctionList<EventLogStateDispatchType> = {
  add_event_to_log
}

export const createEventLogActions = (dispatch: Dispatch<ReducerActionPayload>):EventLogActions => {
  const log = (message:string) => {
    const timestampDate = new Date()
    const timestampRaw = timestampDate.valueOf()
    const readableTimestamp = timestampDate.toLocaleTimeString()

    dispatch({ type:'add_event_to_log', data: { event: { timestampRaw, readableTimestamp, message }}})
  }

  return {
    log
  }
}