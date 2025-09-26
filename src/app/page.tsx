'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { createRoom, joinRoom } from "./actions";
import { useState } from "react";
import { Type, Users, Play } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>("")

  function handleCodeChange(value: string) {
    setCode(value.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="container max-w-lg">
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
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
            <CardDescription>
              Crie uma nova sala ou entre em uma existente para começar a jogar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create-room" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create-room" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Criar Sala
                </TabsTrigger>
                <TabsTrigger value="join-room" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Entrar na Sala
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create-room" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nova Sala</CardTitle>
                    <CardDescription>
                      Digite seu nome para criar uma nova sala de jogo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form action={createRoom} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="playerName" className="text-sm font-medium">
                          Seu nome
                        </label>
                        <Input 
                          id="playerName"
                          name="playerName" 
                          placeholder="Digite seu nome aqui..." 
                          className="w-full"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        <Users className="h-4 w-4 mr-2" />
                        Criar Sala
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="join-room" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Entrar na Sala</CardTitle>
                    <CardDescription>
                      Digite seu nome e o código da sala para entrar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form action={joinRoom} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="playerNameJoin" className="text-sm font-medium">
                          Seu nome
                        </label>
                        <Input 
                          id="playerNameJoin"
                          name="playerName" 
                          placeholder="Digite seu nome aqui..." 
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="roomCode" className="text-sm font-medium">
                          Código da sala
                        </label>
                        <div className="flex justify-center">
                          <InputOTP 
                            maxLength={4} 
                            name="code" 
                            value={code} 
                            onChange={value => handleCodeChange(value)}
                            className="gap-2"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={code.length < 4}>
                        <Play className="h-4 w-4 mr-2" />
                        Entrar na Sala
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Desenvolvido com ❤️ para diversão
          </p>
        </div>
      </div>
    </div>
  );
}
