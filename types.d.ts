interface Player {
    id: string;
    name: string;
}

interface RoundStartEvent {
  roomId: string
  letter: string
  endsAt: string
  categories: string[]
}
