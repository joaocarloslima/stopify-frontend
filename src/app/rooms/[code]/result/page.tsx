"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Type, Trophy, Medal, Award, Clock, Home, Users } from "lucide-react"

interface PlayerRanking {
    playerName: string
    score: number
}

interface JudgeResult {
    ranking: PlayerRanking[]
}

export default function ResultPage({ params }: { params: Promise<{ code: string }> }) {
    const [code, setCode] = useState<string>("")
    const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [playerId, setPlayerId] = useState<string | null>(null)

    useEffect(() => {
        params.then(({ code }) => setCode(code))
        
        const match = document.cookie.match(new RegExp('(^| )playerId=([^;]+)'))
        if (match) {
            setPlayerId(match[2])
        }
    }, [params])

    useEffect(() => {
        if (!code) return

        const API_URL = process.env.NEXT_PUBLIC_API_URL
        console.log(`🔌 Conectando SSE para resultado da sala: ${code}`)
        
        const eventSource = new EventSource(`${API_URL}/stream/room/${code}`)

        eventSource.addEventListener("judge.result", (event) => {
            console.log("🏆 Judge result recebido:", event)
            try {
                const result: JudgeResult = JSON.parse(event.data)
                setJudgeResult(result)
                setIsLoading(false)
            } catch (error) {
                console.error("Erro ao parsear resultado:", error)
            }
        })

        eventSource.onopen = () => {
            console.log("✅ Conexão SSE aberta para resultados")
        }

        eventSource.onerror = (err) => {
            console.error("❌ Erro na conexão SSE de resultados:", err)
        }

        return () => {
            console.log("🔌 Fechando conexão SSE de resultados")
            eventSource.close()
        }
    }, [code])

    const getInitials = (name: string) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((n) => n.charAt(0).toUpperCase())
            .join("")
    }

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1: return <Trophy className="h-5 w-5 text-yellow-500" />
            case 2: return <Medal className="h-5 w-5 text-gray-400" />
            case 3: return <Award className="h-5 w-5 text-amber-600" />
            default: return <Users className="h-5 w-5 text-muted-foreground" />
        }
    }

    const getRankBadgeVariant = (position: number) => {
        switch (position) {
            case 1: return "default"
            case 2: return "secondary"
            case 3: return "outline"
            default: return "outline"
        }
    }

    

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl max-w-md">
                    <CardHeader className="text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-4">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Clock className="h-8 w-8 animate-spin" />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>Aguardando Resultado</CardTitle>
                        <CardDescription>
                            O juiz está analisando as respostas de todos os jogadores...
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-sm text-muted-foreground">
                            Isso pode levar alguns segundos
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!judgeResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl max-w-md">
                    <CardHeader className="text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-4">
                            <AvatarFallback className="bg-destructive text-destructive-foreground">
                                <Type className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>Erro no Resultado</CardTitle>
                        <CardDescription>
                            Não foi possível carregar o resultado do jogo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button asChild className="w-full">
                            <a href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Voltar para Home
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <div className="container max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <Avatar className="h-12 w-12 mr-3">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Type className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">Resultado Final</h1>
                            <Badge variant="outline" className="text-xs">
                                Sala {code}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Ranking Final - Card Único */}
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Classificação Final
                        </CardTitle>
                        <CardDescription>
                            Resultado da partida com pontuação de todos os jogadores
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {judgeResult.ranking.map((player, index) => {
                                const position = index + 1
                                return (
                                    <div 
                                        key={`${player.playerName}-${index}`}
                                        className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8">
                                            {getRankIcon(position)}
                                        </div>
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>
                                                {getInitials(player.playerName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-lg">{player.playerName}</p>
                                            <p className="text-sm text-muted-foreground">{position}º lugar</p>
                                        </div>
                                        <Badge variant={getRankBadgeVariant(position)} className="text-lg px-4 py-2">
                                            {player.score} pts
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex justify-center gap-4 mt-6">
                    <Button asChild variant="outline">
                        <a href={`/rooms/${code}`}>
                            <Users className="h-4 w-4 mr-2" />
                            Voltar para Sala
                        </a>
                    </Button>
                    <Button asChild>
                        <a href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Nova Partida
                        </a>
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        🎉 Parabéns a todos os jogadores!
                    </p>
                </div>
            </div>
        </div>
    )
}