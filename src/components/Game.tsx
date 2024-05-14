export interface GameProps {
  id: string
}

export default function Game({
  id
}: GameProps) {
  return (
    <section>
      <h2>Game ({id})</h2>
    </section>
  )
}