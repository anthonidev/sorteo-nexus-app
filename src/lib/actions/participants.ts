'use server'

import { participantsResponseSchema, type ParticipantsResponse } from '@/lib/schemas/participants'

export async function getParticipants(): Promise<ParticipantsResponse> {
    try {
        const apiUrl = process.env.API_BASE_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/participants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Ensure we always get the latest data
        })

        if (!response.ok) {
            let errorMessage = 'Error al obtener participantes'

            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch {
                errorMessage = `Error ${response.status}: ${response.statusText}`
            }

            return {
                success: false,
                message: errorMessage,
                data: {
                    participants: [],
                    total: 0,
                    message: errorMessage
                }
            }
        }

        const result = await response.json()
        const validatedResult = participantsResponseSchema.parse(result)

        return validatedResult

    } catch (error) {
        console.error('Error getting participants:', error)

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error inesperado al obtener participantes',
            data: {
                participants: [],
                total: 0,
                message: 'Error inesperado al obtener participantes'
            }
        }
    }
}