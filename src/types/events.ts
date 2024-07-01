/** Shared types */
export interface EventLogItem {
  message: string,
  timestampRaw: number,
  readableTimestamp: string,
}


/** Client-side state management types */
export type EventLogStateDispatchType =
  "add_event_to_log"

export interface EventLogActions {
  log: (msg:string) => void
}

/** Server-side types */

