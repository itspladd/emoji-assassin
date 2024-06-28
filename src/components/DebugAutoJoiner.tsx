import { useEffect } from "react";

import useStateManager from '../hooks/useStateManager';

export default function DebugAutoJoiner() {
 
  const { actions } = useStateManager()

  /** DEV LOGIC ONLY *****************************************/
  /** Auto-join a debug game room when the component renders */
  useEffect(() => {
    // This will fire twice in dev mode due to the strict mode setting,
    // but the server prevents the same socket from joining a room multiple times
    if (import.meta.env.DEV) {
      console.log(import.meta)
      actions.debug.joinDebugRoom()
    }

  }, [])
  /** END ***************************************************/

  return (
    <></>
  )
}