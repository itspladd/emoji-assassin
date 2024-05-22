import type { AppState } from "@customTypes/stateManagement";

export function stateChangeError(msg:string, state:AppState, data?:Record<string, any>) {
  console.error("---- STATE CHANGE ERROR ----")
  console.error(msg + " App state:", state)
  data && console.error("Data payload:", data)
  console.error("----------------------------")
  return { ...state }
}