import { type ChangeEvent, type MouseEventHandler, useState } from "react";
import LabeledInput from "./LabeledInput";
import axios from "axios";

export default function JoinRoomInput ({
  joinRoomAction
} : {
  joinRoomAction: (id:string) => void
}) {

  // No other components need to know about the input until it's submitted
  const [roomIdInput, setRoomIdInput] = useState("")

  const handleRoomInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value.toUpperCase()
    setRoomIdInput(newId)
  }

  const handleJoinRoomSubmit:MouseEventHandler<HTMLButtonElement> = async () => {
    const idToJoin = roomIdInput
    const response:{data: {roomIdValid:boolean}} = await axios.get(`/rooms/${idToJoin}`)
    const roomIdValid = response?.data?.roomIdValid

    if (typeof roomIdValid !== "boolean") {
      return console.error(`GET /rooms/${idToJoin} failed. Response object:`, response)
    }
    if (roomIdValid === false) {
      return console.debug(`Invalid ID`)
    }
    
    joinRoomAction(idToJoin)
  }

  return (
    <div>
      <button onClick={handleJoinRoomSubmit}>Join existing room</button>
      <LabeledInput
        label="Room ID"
        value={roomIdInput}
        onChange={handleRoomInputChange}
        placeholder = {"A1C2B3"}
      />
    </div>
  )
}