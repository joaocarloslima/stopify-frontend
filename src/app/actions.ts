'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createRoom(formData: FormData) {
    const data = JSON.stringify(Object.fromEntries(formData.entries()))

    const response = await fetch(`${API_URL}/room`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response?.ok) throw new Error('Failed to create room')

    const json = await response.json()
    const code = json.code

    const cookieStore = await cookies()
    cookieStore.set("playerId", json.playerId, {
        httpOnly: false, 
        path: "/"
    })

    redirect(`/rooms/${code}`)
}

export async function joinRoom(formData: FormData) {
    const data = JSON.stringify(Object.fromEntries(formData.entries()))
    const code = formData.get('code')

    if (!code) throw new Error('Code is required')

    const response = await fetch(`${API_URL}/room/${code}/join`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response?.ok) throw new Error(`Failed to join room ${code} (${response.status})`)

    const json = await response.json()
    
    const cookieStore = await cookies()
    cookieStore.set("playerId", json.playerId, {
        httpOnly: false, 
        path: "/"
    })

    redirect(`/rooms/${code}`)
}

export async function getPlayerAtRoom(code: string) {
    const response = await fetch(`${API_URL}/room/${code}`)
    if (!response?.ok) throw new Error(`Failed to get players at room ${code} (${response.status})`)
    const json = await response.json()
    return json.players
}

export async function startGame(formData: FormData) {
    const code = formData.get('code')
    const response = await fetch(`${API_URL}/room/${code}/start`, {
        method: 'POST'
    })
    if (!response?.ok) throw new Error(`Failed to start game at room ${code} (${response.status})`)
}

export async function leaveRoom(formData: FormData) {
    const code = formData.get('code')
    const playerId = formData.get('playerId') as string
    const response = await fetch(`${API_URL}/room/${code}/leave`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId })
    })
    if (!response?.ok) throw new Error(`Failed to leave room ${code} (${response.status})`)
    redirect(`/`)
}


export async function submitAnswers(formData: FormData) {
    const code = formData.get("roomId") as string
    const letter = formData.get("letter") as string 
    const playerId = formData.get("playerId") as string
    const answers: Record<string, string> = {}
    formData.forEach((value, key) => {
        if (key.startsWith("answer-")) {
            const category = key.replace("answer-", "")
            answers[category] = value.toString()
        }
    })

    const res = await fetch(`${API_URL}/room/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, letter, playerId, answers }),
    })

    if (!res.ok) {
        throw new Error("Falha ao enviar respostas")
    }
}

