import { EventLogItem } from "@customTypes/events";
import { useState } from "react";

import styles from "./EventLog.module.css"

interface EventLogProps {
  events: EventLogItem[]
}

export default function EventLog({ events }:EventLogProps) {

  const [open, setOpen] = useState(false)

  const eventLogItems = events.map(({ message, timestampRaw, readableTimestamp }) => {
    return (
      <li key={timestampRaw} >
        <span className={styles["timestamp"]}>{readableTimestamp}</span>
        <span>{message}</span>
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