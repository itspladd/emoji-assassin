import { EventLogItem } from "@customTypes/events";

interface EventLogProps {
  events: EventLogItem[]
}

export default function EventLog({ events }:EventLogProps) {

  const eventLogItems = events.map(({ message, timestamp }) => {
    return (
      <li key={timestamp}>
        {message}
      </li>
    )
  })

  return (
    <section id={"event-log"}>
      <h3>Event Log</h3>
      <ul>
        {eventLogItems}
      </ul>
    </section>
  )
}