'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { InputOTPSlotDisabled } from "@/components/ui/input-otp-readonly";
import { createRoom, joinRoom } from "./actions";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState<string>("")

  function handleCodeChange(value: string) {
    setCode(value.toUpperCase())
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-purple-950 p-4 text-center text-white">
      <h1 className="text-4xl font-bold mb-8">Stopify</h1>

      <Tabs defaultValue="create-room" className="min-w-lg">
        <TabsList>
          <TabsTrigger value="create-room">Criar Sala</TabsTrigger>
          <TabsTrigger value="join-room">Entrar em uma Sala</TabsTrigger>
        </TabsList>
        <TabsContent value="create-room" className="flex flex-col gap-4 items-center mt-4 bg-purple-900 p-8 rounded-lg shadow-lg">
          <form action={createRoom} className="flex flex-col gap-4 min-w-xs">
            <Input name="playerName" placeholder="Seu nome" className="text-white-900 " />
            <Button >Criar Sala</Button>
          </form>
        </TabsContent>
        <TabsContent value="join-room" className="flex flex-col gap-4 items-center mt-4 bg-purple-900 p-8 rounded-lg shadow-lg">
          <form action={joinRoom} className="flex flex-col gap-4 min-w-xs">
            <Input name="playerName" placeholder="Seu nome" className="max-w-xs" />
            <InputOTP maxLength={4} name="code" value={code} onChange={value => handleCodeChange(value)} >
              <InputOTPGroup>
                <InputOTPSlotDisabled defaultValue={"S"} />
                <InputOTPSlotDisabled defaultValue={"T"} />
                <InputOTPSlotDisabled defaultValue={"O"} />
                <InputOTPSlotDisabled defaultValue={"P"} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Button >Entrar na Sala</Button>
          </form>
        </TabsContent>
      </Tabs>

    </main>
  );
}
