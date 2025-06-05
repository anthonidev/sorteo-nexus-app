export const APP_CONFIG = {
    name: 'Sorteo iPhone 16 Pro',
    description: 'Participa en nuestro sorteo mensual del iPhone 16 Pro',
    version: '1.0.0'
} as const

export const API_ENDPOINTS = {
    participants: '/api/participants'
} as const

export const FORM_MESSAGES = {
    success: '¡Registro exitoso! Ya estás participando en el sorteo.',
    error: 'Ocurrió un error. Por favor intenta nuevamente.',
    loading: 'Procesando tu participación...',
    validation: {
        email: {
            required: 'El email es requerido',
            invalid: 'Por favor ingresa un email válido'
        },
        fullName: {
            required: 'El nombre completo es requerido',
            minLength: 'El nombre debe tener al menos 2 caracteres',
            maxLength: 'El nombre no puede exceder 100 caracteres'
        },
        phone: {
            invalid: 'Por favor ingresa un número de teléfono válido'
        }
    }
} as const

export const SORTEO_INFO = {
    prize: 'iPhone 16 Pro (128GB)',
    frequency: 'Cada viernes del mes',
    contact: 'Se contactan por email',
    rules: 'Válido solo para residentes de Perú'
} as const

export const SOCIAL_SHARE = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    whatsapp: 'https://wa.me/?text=',
    twitter: 'https://twitter.com/intent/tweet?text='
} as const