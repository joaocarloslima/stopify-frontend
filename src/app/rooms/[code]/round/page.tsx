"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGameStore } from "@/stores/game-store"
import { submitAnswers } from "@/app/actions"

export default function RoundPage() {
    const round = useGameStore((state) => state.currentRound)

    const [timeLeft, setTimeLeft] = useState<number>(0)

    useEffect(() => {
        if (!round) return
        const endsAt = new Date(round.endsAt).getTime()

        const interval = setInterval(() => {
            const now = Date.now()
            const diff = Math.max(0, Math.floor((endsAt - now) / 1000))
            setTimeLeft(diff)
            if (diff <= 0) clearInterval(interval)
        }, 1000)

        return () => clearInterval(interval)
    }, [round])

    if (!round) {
        return (
            <main className="flex flex-col min-h-screen items-center justify-center bg-purple-950 text-white">
                <p>Nenhuma rodada ativa.</p>
                <Button asChild variant={"secondary"}>
                    <a href="/">Voltar para salas</a>
                </Button>
            </main>
        )
    }

    const totalSeconds = 60
    const percent = (timeLeft / totalSeconds) * 100

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        submitAnswers(formData)
    }


    return (
        <main className="flex flex-col min-h-screen items-center bg-purple-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-4">Rodada em {round.roomId}</h1>

            <h2 className="text-8xl font-extrabold mb-6 text-yellow-400">
                {round.letter}
            </h2>

            <div className="w-full max-w-lg mb-6">
                <Progress value={percent} className="h-3" />
                <p className="text-sm mt-2 text-center">{timeLeft}s restantes</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full max-w-lg"
            >
                {round.categories.map((c) => (
                    <div key={c} className="flex flex-col gap-1">
                        <label className="text-sm font-medium">{c}</label>
                        <Input
                            type="text"
                            name={`answer-${c}`}
                        />
                    </div>
                ))}
                <input type="hidden" name="roomId" value={round.roomId} />
                <input type="hidden" name="playerId" value="123e4567" />
                <input type="hidden" name="letter" value={round.letter} />
                

                <Button type="submit" className="mt-4">
                    STOP
                </Button>
            </form>
        </main>
    )
}