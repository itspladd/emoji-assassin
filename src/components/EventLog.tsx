import { EventLogItem } from "@customTypes/events";
import styles from "./EventLog.module.css"
import { useState } from "react";
interface EventLogProps {
  events: EventLogItem[]
}

export default function EventLog({ events }:EventLogProps) {

  const [open, setOpen] = useState(false)

  const eventLogItems = events.map(({ message, timestamp }) => {
    return (
      <li key={timestamp}>
        <span className={styles["timestamp"]}>{timestamp}</span>
        <span className={styles["message"]}>{message}</span>
      </li>
    )
  })

  const expandCollapseText = open ? "collapse" : "expand"

  return (
    <section className={styles["event-log-wrapper"]}>
      <h3 
        className={styles["event-log-header"]}
        onClick={() => setOpen(!open)}  
      >
        Event Log
        <span className={styles["expand-collapse"]}> (click to {expandCollapseText})</span>
      </h3>
      <ul 
        className={
          styles["event-log-items"] + " " +
          (open ? styles["open"] : "")
        }
      >
        {eventLogItems}
      </ul>
    </section>
  )
}