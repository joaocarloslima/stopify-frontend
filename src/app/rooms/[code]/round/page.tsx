"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGameStore } from "@/stores/game-store"
import { submitAnswers } from "@/app/actions"
import { Type, Clock, Zap, Home, Send } from "lucide-react"

export default function RoundPage() {
    const round = useGameStore((state) => state.currentRound)
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

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

    const handleAnswerChange = (category: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [category]: value
        }))
    }

    const getProgressColor = () => {
        if (timeLeft > 30) return "bg-green-500"
        if (timeLeft > 15) return "bg-yellow-500"
        return "bg-red-500"
    }

    if (!round) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl max-w-md">
                    <CardHeader className="text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-4">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Type className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>Nenhuma rodada ativa</CardTitle>
                        <CardDescription>
                            Parece que você não está em uma rodada ativa no momento.
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

    const totalSeconds = 60
    const percent = (timeLeft / totalSeconds) * 100

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitted(true)
        const formData = new FormData(e.target as HTMLFormElement)
        submitAnswers(formData)
    }

    const filledAnswers = Object.values(answers).filter(answer => answer.trim().length > 0).length
    const totalCategories = round.categories.length


    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <div className="container max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <Avatar className="h-12 w-12 mr-3">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Type className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">Stopify</h1>
                            <Badge variant="outline" className="text-xs">
                                Sala {round.roomId}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Letter Display Card */}
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl mb-6">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-2">Letra da rodada</p>
                            <div className="relative">
                                <div className="text-8xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                                    {round.letter}
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <Badge variant="secondary" className="text-xs">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Ativa
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timer Card */}
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Tempo restante</span>
                            </div>
                            <Badge variant={timeLeft > 15 ? "default" : "destructive"} className="font-mono">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </Badge>
                        </div>
                        <Progress 
                            value={percent} 
                            className={`h-3 transition-all duration-300`}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>0s</span>
                            <span className="font-medium">
                                {filledAnswers}/{totalCategories} preenchidas
                            </span>
                            <span>60s</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Card */}
                <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="h-5 w-5" />
                            Complete as categorias
                        </CardTitle>
                        <CardDescription>
                            Preencha as palavras que começam com a letra <strong>{round.letter}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {round.categories.map((category, index) => (
                                    <div key={category} className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {index + 1}
                                            </Badge>
                                            {category}
                                        </label>
                                        <Input
                                            type="text"
                                            name={`answer-${category}`}
                                            placeholder={`Palavra com ${round.letter}...`}
                                            value={answers[category] || ''}
                                            onChange={(e) => handleAnswerChange(category, e.target.value)}
                                            disabled={isSubmitted || timeLeft === 0}
                                            className="transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <input type="hidden" name="roomId" value={round.roomId} />
                            <input type="hidden" name="playerId" value="123e4567" />
                            <input type="hidden" name="letter" value={round.letter} />

                            <div className="flex gap-4 pt-4">
                                <Button 
                                    type="submit" 
                                    className="flex-1" 
                                    size="lg"
                                    disabled={isSubmitted || timeLeft === 0}
                                >
                                    {isSubmitted ? (
                                        <>
                                            <Zap className="h-4 w-4 mr-2" />
                                            Respostas Enviadas!
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            STOP - Enviar Respostas
                                        </>
                                    )}
                                </Button>
                            </div>
                            
                            {timeLeft === 0 && !isSubmitted && (
                                <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-destructive font-medium">
                                        ⏰ Tempo esgotado! Suas respostas foram enviadas automaticamente.
                                    </p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        💡 Dica: Pense rápido e seja criativo com suas respostas!
                    </p>
                </div>
            </div>
        </div>
    )
}