"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {leaveRoom, startGame } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/stores/game-store"
import { Type, Users, Play, LogOut, Copy, Check } from "lucide-react"

interface PlayerListProps {
    code: string,
    initialPlayers: Player[]
}

export default function PlayerList({ code, initialPlayers }: PlayerListProps) {
    const [players, setPlayers] = useState<Player[]>(initialPlayers)
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [playerId, setPlayerId] = useState<string | null>(null)
    const [copiedCode, setCopiedCode] = useState(false)

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(true)
            setTimeout(() => setCopiedCode(false), 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <div className="container max-w-2xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Avatar className="h-16 w-16 mr-4">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                                <Type className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Stopify
                            </h1>
                            <p className="text-muted-foreground mt-1">A corrida das palavras</p>
                        </div>
                    </div>
                    
                    {/* Room Code Display */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                            {code}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyRoomCode}
                            className="h-8 w-8 p-0"
                        >
                            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {copiedCode ? "Código copiado!" : "Clique para copiar o código"}
                    </p>
                </div>

                {/* Main Card */}
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="h-5 w-5" />
                            <CardTitle className="text-2xl">Sala de Espera</CardTitle>
                        </div>
                        <CardDescription>
                            Aguardando todos os jogadores entrarem para iniciar a partida
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Jogadores na sala</h3>
                                <Badge variant="secondary" className="ml-2">
                                    {players.length} {players.length === 1 ? 'jogador' : 'jogadores'}
                                </Badge>
                            </div>
                            
                            {players.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Nenhum jogador na sala ainda...</p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {players.map((player, index) => (
                                        <Card key={player.id} className="p-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {getInitials(player.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-medium">{player.name}</p>
                                                    {player.id === playerId && (
                                                        <Badge variant="secondary" className="text-xs mt-1">Você</Badge>
                                                    )}
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <form action={leaveRoom} className="w-full sm:w-auto">
                            <input type="hidden" name="code" value={code} />
                            <input type="hidden" name="playerId" value={playerId ?? ""} />
                            <Button variant="outline" className="w-full sm:w-auto">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair da Sala
                            </Button>
                        </form>
                        <form action={startGame} className="w-full sm:w-auto">
                            <input type="hidden" name="code" value={code} />
                            <Button 
                                className="w-full sm:w-auto" 
                                disabled={players.length < 2}
                                size="lg"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Iniciar Partida
                            </Button>
                        </form>
                    </CardFooter>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Compartilhe o código <span className="font-mono font-semibold">{code}</span> com seus amigos
                    </p>
                </div>
            </div>
        </div>
    )
}