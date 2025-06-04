// src/services/participantService.ts

import type { ParticipantData, ApiResponse } from '../types/participant';

export class ParticipantService {
    private static readonly API_BASE_URL = 'http://localhost:8000';
    private static readonly ENDPOINTS = {
        PARTICIPANTS: '/api/participants'
    } as const;

    /**
     * Registra un nuevo participante
     */
    public static async registerParticipant(data: ParticipantData): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.API_BASE_URL}${this.ENDPOINTS.PARTICIPANTS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await this.handleErrorResponse(response);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
                message: 'Participante registrado exitosamente'
            };

        } catch (error) {
            console.error('Error registrando participante:', error);

            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Verifica que la API esté funcionando.');
            }

            throw error;
        }
    }

    /**
     * Maneja respuestas de error de la API
     */
    private static async handleErrorResponse(response: Response): Promise<{ message: string }> {
        try {
            const errorData = await response.json();
            return {
                message: errorData.message || errorData.error || 'Error desconocido'
            };
        } catch {
            return {
                message: `Error ${response.status}: ${response.statusText}`
            };
        }
    }
}

/**
 * Hook para validación de formulario
 */
export class FormValidator {
    /**
     * Valida los datos del participante
     */
    public static validateParticipantData(data: ParticipantData): Record<string, string> {
        const errors: Record<string, string> = {};

        // Validación de email
        if (!data.email?.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!this.isValidEmail(data.email)) {
            errors.email = 'Por favor ingresa un email válido';
        }

        // Validación de nombre completo
        if (!data.fullName?.trim()) {
            errors.fullName = 'El nombre completo es obligatorio';
        } else if (data.fullName.trim().length < 2) {
            errors.fullName = 'El nombre debe tener al menos 2 caracteres';
        } else if (data.fullName.trim().length > 100) {
            errors.fullName = 'El nombre no puede exceder 100 caracteres';
        }

        // Validación de teléfono (opcional)
        if (data.phone && data.phone.trim()) {
            if (!this.isValidPhone(data.phone)) {
                errors.phone = 'Por favor ingresa un teléfono válido (9-15 dígitos)';
            }
        }

        return errors;
    }

    /**
     * Valida formato de email
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    /**
     * Valida formato de teléfono
     */
    private static isValidPhone(phone: string): boolean {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^\+?[\d]{9,15}$/;
        return phoneRegex.test(cleanPhone);
    }

    /**
     * Sanitiza los datos de entrada
     */
    public static sanitizeParticipantData(data: ParticipantData): ParticipantData {
        return {
            email: data.email?.trim().toLowerCase() || '',
            fullName: data.fullName?.trim() || '',
            phone: data.phone?.trim() || undefined
        };
    }
}