"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {leaveRoom, startGame } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/stores/game-store"

interface PlayerListProps {
    code: string,
    initialPlayers: Player[]
}

export default function PlayerList({ code, initialPlayers }: PlayerListProps) {
    const [players, setPlayers] = useState<Player[]>(initialPlayers)
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [playerId, setPlayerId] = useState<string | null>(null)

    useEffect(() => {
        const match = document.cookie.match(new RegExp('(^| )playerId=([^;]+)'))
        if (match) {
            setPlayerId(match[2])
        }

    }, [])

    function getInitials(name: string) {
        if (!name) return "?"
        return name
            .split(" ")
            .map((n) => n.charAt(0).toUpperCase())
            .join("")
    }

    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/stream/room/${code}`)

        eventSource.addEventListener("player.joined", (event) => {
            console.log("New player joined:", event)
            const newPlayer: Player = JSON.parse((event as MessageEvent).data)
            setPlayers((prev) => {
                if (prev.find((p) => p.id === newPlayer.id)) return prev
                return [...prev, newPlayer]
            })
        })

        eventSource.addEventListener("player.left", (event) => {
            console.log("Player left:", event)
            const leftPlayer: Player = JSON.parse((event as MessageEvent).data)
            setPlayers((prev) => prev.filter((p) => p.id !== leftPlayer.id))
        })

        eventSource.addEventListener("round.started", (event) => {
            const data = JSON.parse((event as MessageEvent).data) as RoundStartEvent
            useGameStore.getState().setCurrentRound(data)
            router.push(`/rooms/${code}/round`)
        })

        eventSource.onerror = (err) => {
            console.error("SSE error:", err)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [code])

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 bg-purple-950 p-4 text-white">
            <h1 className="text-4xl font-bold mb-8">Stopify</h1>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                Sala: {code}
            </h2>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Pessoas Presentes</CardTitle>
                    <CardDescription>Quando todos ingressarem, clique em "Iniciar Partida"</CardDescription>
                </CardHeader>
                <CardContent>
                    {players.map((player) => (
                        <div className="flex items-center mb-4" key={player.id}>
                            <Avatar>
                                <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                            </Avatar>
                            <p className="ml-4 inline-block align-middle">{player.name}</p>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                    <form action={leaveRoom}>
                        <input type="hidden" name="code" value={code} />
                        <input type="hidden" name="playerId" value={playerId ?? ""} />
                        <Button variant={"secondary"}>Sair da Sala</Button>
                    </form>
                    <form action={startGame}>
                        <input type="hidden" name="code" value={code} />
                        <Button>Iniciar Partida</Button>
                    </form>
                </CardFooter>
            </Card>
        </main>
    )
}