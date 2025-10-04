interface Player {
    id: string;
    name: string;
}

interface RoundStartEvent {
  code: string
  letter: string
  endsAt: string
  categories: string[]
}
