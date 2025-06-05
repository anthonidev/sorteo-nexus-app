import { z } from "zod"

export const participantSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Por favor ingresa un email válido"),
    fullName: z
        .string()
        .min(1, "El nombre completo es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    phone: z
        .string()
        .optional()
        .refine((phone) => {
            if (!phone) return true // Si es opcional y está vacío, es válido
            // Validar formato de teléfono peruano (opcional)
            const phoneRegex = /^(\+51|51)?[9]\d{8}$/
            return phoneRegex.test(phone.replace(/\s/g, ''))
        }, "Por favor ingresa un número de teléfono válido")
})

export type ParticipantFormData = z.infer<typeof participantSchema>

export interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
}

export interface ParticipantData {
    id: string
    email: string
    fullName: string
    phone?: string
    createdAt: string
    updatedAt: string
}