'use server'

import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createRoom(formData: FormData) {
    const data = JSON.stringify(Object.fromEntries(formData.entries()))

    const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response?.ok) throw new Error('Failed to create room')

    const json = await response.json()
    const code = json.code

    redirect(`/rooms/${code}`)
}

export async function joinRoom(formData: FormData) {
    const data = JSON.stringify(Object.fromEntries(formData.entries()))
    const code = "STOP_" + formData.get('code')
    console.log('Joining room with code:', code)

    if (!code) throw new Error('Code is required')
    console.log(`➡️ ${API_URL}/rooms/${code}/join`)

    const response = await fetch(`${API_URL}/rooms/${code}/join`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response?.ok) throw new Error(`Failed to join room ${code} (${response.status})`)

    redirect(`/rooms/${code}`)
}