
import type { ParticipantData, ApiResponse } from '../types/participant';

export class ParticipantService {
    private static readonly API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
    private static readonly ENDPOINTS = {
        PARTICIPANTS: '/api/participants',
        HEALTH: '/health'
    } as const;

    private static readonly REQUEST_TIMEOUT = 15000;
    private static readonly MAX_RETRIES = 2;

    public static async registerParticipant(data: ParticipantData): Promise<ApiResponse> {
        const sanitizedData = FormValidator.sanitizeParticipantData(data);

        const validationErrors = FormValidator.validateParticipantData(sanitizedData);
        if (Object.keys(validationErrors).length > 0) {
            return {
                success: false,
                message: Object.values(validationErrors)[0]
            };
        }

        let lastError: Error;

        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                const result = await this.attemptRegistration(sanitizedData, attempt);
                return result;
            } catch (error) {
                lastError = error as Error;
                console.warn(`Intento ${attempt} falló:`, error);

                if (attempt < this.MAX_RETRIES) {
                    await this.delay(1000 * attempt);
                }
            }
        }

        throw lastError!;
    }

    private static async attemptRegistration(data: ParticipantData, attempt: number): Promise<ApiResponse> {
        console.log('Datos sanitizados para registro:', data);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

        try {
            console.log(`Enviando registro (intento ${attempt}):`, { email: data.email, name: data.fullName });

            const response = await fetch(`${this.API_BASE_URL}${this.ENDPOINTS.PARTICIPANTS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Request-ID': crypto.randomUUID(),
                    'X-Attempt': attempt.toString()
                },
                body: JSON.stringify({
                    ...data,
                    source: 'sorteo_web',
                    timestamp: new Date().toISOString()
                }),
                signal: controller.signal
            });
            console.log('Respuesta del servidor:', response.status, response.statusText);

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await this.handleErrorResponse(response);
                throw new Error(errorData.message);
            }

            const result = await response.json();
            console.log('Registro exitoso:', result);

            return {
                success: true,
                data: result,
                message: 'Te has registrado exitosamente al sorteo. ¡Buena suerte!'
            };

        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión.');
                }

                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
                }
            }

            throw error;
        }
    }

    public static async checkApiHealth(): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${this.API_BASE_URL}${this.ENDPOINTS.HEALTH}`, {
                method: 'GET',
                signal: controller.signal,
                cache: 'no-cache'
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch {
            return false;
        }
    }

    public static async getParticipantStats(): Promise<{ count: number; lastUpdate: string } | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/stats`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                cache: 'no-cache'
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('No se pudieron obtener las estadísticas:', error);
        }

        return null;
    }

    private static async handleErrorResponse(response: Response): Promise<{ message: string }> {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        try {
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();

                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = typeof errorData.error === 'string'
                        ? errorData.error
                        : errorData.error.message || 'Error desconocido';
                } else if (errorData.errors && Array.isArray(errorData.errors)) {
                    errorMessage = errorData.errors[0].message || errorData.errors[0];
                }
            } else {
                const textError = await response.text();
                if (textError) {
                    errorMessage = textError.substring(0, 200);
                }
            }
        } catch (parseError) {
            console.warn('Error al parsear respuesta de error:', parseError);
            errorMessage = this.getDefaultErrorMessage(response.status);
        }

        return { message: errorMessage };
    }

    private static getDefaultErrorMessage(status: number): string {
        switch (status) {
            case 400:
                return 'Los datos enviados no son válidos. Por favor, revisa la información.';
            case 401:
                return 'No tienes autorización para realizar esta acción.';
            case 403:
                return 'No tienes permisos para participar en este sorteo.';
            case 404:
                return 'El servicio de registro no está disponible.';
            case 409:
                return 'Este email ya está registrado en el sorteo.';
            case 422:
                return 'La información proporcionada no es válida.';
            case 429:
                return 'Has enviado demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
            case 500:
                return 'Error interno del servidor. Por favor, inténtalo más tarde.';
            case 502:
                return 'El servidor está temporalmente no disponible.';
            case 503:
                return 'El servicio está en mantenimiento. Inténtalo más tarde.';
            default:
                return `Error del servidor (${status}). Por favor, inténtalo más tarde.`;
        }
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export class FormValidator {
    private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    private static readonly PHONE_REGEX = /^\+?[\d\s\-\(\)]{9,15}$/;
    private static readonly NAME_MIN_LENGTH = 2;
    private static readonly NAME_MAX_LENGTH = 100;

    public static validateParticipantData(data: ParticipantData): Record<string, string> {
        const errors: Record<string, string> = {};

        const emailErrors = this.validateEmail(data.email);
        if (emailErrors.length > 0) {
            errors.email = emailErrors[0];
        }

        const nameErrors = this.validateFullName(data.fullName);
        if (nameErrors.length > 0) {
            errors.fullName = nameErrors[0];
        }

        if (data.phone && data.phone.trim()) {
            const phoneErrors = this.validatePhone(data.phone);
            if (phoneErrors.length > 0) {
                errors.phone = phoneErrors[0];
            }
        }

        return errors;
    }

    private static validateEmail(email: string | undefined): string[] {
        const errors: string[] = [];

        if (!email || !email.trim()) {
            errors.push('El email es obligatorio para participar en el sorteo');
            return errors;
        }

        const trimmedEmail = email.trim();

        if (trimmedEmail.length < 5) {
            errors.push('El email es demasiado corto');
        }

        if (trimmedEmail.length > 254) {
            errors.push('El email es demasiado largo');
        }

        if (!this.EMAIL_REGEX.test(trimmedEmail)) {
            errors.push('Por favor ingresa un email válido (ejemplo: usuario@dominio.com)');
        }

        if (trimmedEmail.includes('..')) {
            errors.push('El email no puede contener puntos consecutivos');
        }

        if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
            errors.push('El email no puede empezar o terminar con punto');
        }

        return errors;
    }

    private static validateFullName(fullName: string | undefined): string[] {
        const errors: string[] = [];

        if (!fullName || !fullName.trim()) {
            errors.push('El nombre completo es obligatorio');
            return errors;
        }

        const trimmedName = fullName.trim();

        if (trimmedName.length < this.NAME_MIN_LENGTH) {
            errors.push(`El nombre debe tener al menos ${this.NAME_MIN_LENGTH} caracteres`);
        }

        if (trimmedName.length > this.NAME_MAX_LENGTH) {
            errors.push(`El nombre no puede exceder ${this.NAME_MAX_LENGTH} caracteres`);
        }

        const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);
        if (nameParts.length < 2) {
            errors.push('Por favor ingresa tu nombre y apellido completos');
        }

        if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/.test(trimmedName)) {
            errors.push('El nombre solo puede contener letras, espacios, apostrofes, puntos y guiones');
        }
        if (!/[a-zA-ZÀ-ÿ\u00f1\u00d1]/.test(trimmedName)) {
            errors.push('El nombre debe contener al menos una letra');
        }

        return errors;
    }

    private static validatePhone(phone: string | undefined): string[] {
        const errors: string[] = [];

        if (!phone || !phone.trim()) {
            return errors; // El teléfono es opcional
        }

        const trimmedPhone = phone.trim();
        const cleanPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '');

        if (cleanPhone.length < 9) {
            errors.push('El teléfono debe tener al menos 9 dígitos');
        }

        if (cleanPhone.length > 15) {
            errors.push('El teléfono no puede tener más de 15 dígitos');
        }

        if (!/^\+?[\d]+$/.test(cleanPhone)) {
            errors.push('El teléfono solo puede contener números, espacios, guiones y paréntesis');
        }

        return errors;
    }

    public static sanitizeParticipantData(data: ParticipantData): ParticipantData {
        return {
            email: this.sanitizeEmail(data.email),
            fullName: this.sanitizeFullName(data.fullName),
            phone: this.sanitizePhone(data.phone)
        };
    }

    private static sanitizeEmail(email: string | undefined): string {
        if (!email) return '';

        return email
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '') // Remover espacios internos
            .slice(0, 254); // Limitar longitud máxima
    }

    private static sanitizeFullName(fullName: string | undefined): string {
        if (!fullName) return '';

        return fullName
            .trim()
            .replace(/\s+/g, ' ') // Normalizar espacios múltiples
            .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF'.-]/g, '') // Mantener solo caracteres válidos
            .slice(0, this.NAME_MAX_LENGTH);
    }

    private static sanitizePhone(phone: string | undefined): string | undefined {
        if (!phone || !phone.trim()) return undefined;

        const cleaned = phone
            .trim()
            .replace(/[^\d\s\-\(\)\+]/g, '') // Mantener solo números y caracteres de formato
            .slice(0, 20); // Limitar longitud

        return cleaned || undefined;
    }

    public static validateFieldRealtime(fieldName: string, value: string): { isValid: boolean; message?: string } {
        switch (fieldName) {
            case 'email':
                const emailErrors = this.validateEmail(value);
                return {
                    isValid: emailErrors.length === 0,
                    message: emailErrors[0]
                };

            case 'fullName':
                const nameErrors = this.validateFullName(value);
                return {
                    isValid: nameErrors.length === 0,
                    message: nameErrors[0]
                };

            case 'phone':
                if (!value.trim()) {
                    return { isValid: true }; // Opcional
                }
                const phoneErrors = this.validatePhone(value);
                return {
                    isValid: phoneErrors.length === 0,
                    message: phoneErrors[0]
                };

            default:
                return { isValid: true };
        }
    }
}

export class FormUIHelper {

    public static showFormStatus(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        const colors = {
            info: 'bg-blue-50 text-blue-700 border-blue-200',
            success: 'bg-green-50 text-green-700 border-green-200',
            warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            error: 'bg-red-50 text-red-700 border-red-200'
        };

        const icons = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        let statusElement = document.getElementById('form-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'form-status';
            statusElement.className = 'fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 transform translate-x-full';
            document.body.appendChild(statusElement);
        }

        statusElement.innerHTML = `
            <div class="p-4 rounded-lg border-2 shadow-lg ${colors[type]}">
                <div class="flex items-center space-x-2">
                    <span class="text-lg">${icons[type]}</span>
                    <span class="font-medium">${message}</span>
                </div>
            </div>
        `;

        statusElement.classList.remove('translate-x-full');
        statusElement.classList.add('translate-x-0');

        setTimeout(() => {
            statusElement?.classList.add('translate-x-full');
            statusElement?.classList.remove('translate-x-0');
        }, 5000);
    }

    public static updateParticipantCount(newCount: number): void {
        const countElement = document.getElementById('participants-count');
        if (!countElement) return;

        const currentText = countElement.textContent || '';
        const currentMatch = currentText.match(/[\d,]+/);
        const currentCount = currentMatch ? parseInt(currentMatch[0].replace(/,/g, '')) : 0;

        if (newCount > currentCount) {
            this.animateNumber(countElement, currentCount, newCount, (count) => {
                countElement.textContent = `¡Únete a más de ${count.toLocaleString()} participantes registrados!`;
            });
        }
    }

    private static animateNumber(
        element: HTMLElement,
        start: number,
        end: number,
        callback: (current: number) => void
    ): void {
        const duration = 2000; // 2 segundos
        const steps = 60;
        const increment = (end - start) / steps;
        let current = start;
        let stepCount = 0;

        const timer = setInterval(() => {
            current += increment;
            stepCount++;

            if (stepCount >= steps) {
                current = end;
                clearInterval(timer);
            }

            callback(Math.floor(current));
        }, duration / steps);
    }



    public static handleNetworkError(): void {
        if (!navigator.onLine) {
            this.showFormStatus('Sin conexión a internet. Verifica tu red.', 'error');
        } else {
            this.showFormStatus('Error de conectividad. Reintentando...', 'warning');
        }
    }
}


export function setupConnectivityListener(): void {
    window.addEventListener('online', () => {
        FormUIHelper.showFormStatus('Conexión restaurada', 'success');
    });
    window.addEventListener('offline', () => {
        FormUIHelper.showFormStatus('Sin conexión a internet', 'error');
    });
}