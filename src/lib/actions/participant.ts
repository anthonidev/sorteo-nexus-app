'use server'

import { participantSchema, type ParticipantFormData, type ApiResponse, type ParticipantData } from '@/lib/schemas/participant'

export async function createParticipant(formData: ParticipantFormData): Promise<ApiResponse<ParticipantData>> {
    try {
        const validatedData = participantSchema.parse(formData)
        const apiUrl = process.env.API_BASE_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/participants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        })

        if (!response.ok) {
            let errorMessage = 'Error al registrar participante'

            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch {
                errorMessage = `Error ${response.status}: ${response.statusText}`
            }

            return {
                success: false,
                message: errorMessage
            }
        }

        const result: ApiResponse<ParticipantData> = await response.json()
        return result

    } catch (error) {
        console.error('Error creating participant:', error)

        if (error instanceof Error) {
            return {
                success: false,
                message: error.message
            }
        }

        return {
            success: false,
            message: 'Ocurrió un error inesperado. Por favor intenta nuevamente.'
        }
    }
}