// src/types/participant.ts

export interface ParticipantData {
    email: string;
    fullName: string;
    phone?: string;
    source?: string;
    timestamp?: string;
}

export interface FormErrors {
    email?: string;
    fullName?: string;
    phone?: string;
    terms?: string;
    general?: string;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: ParticipantResponseData;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface ParticipantResponseData {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    registrationDate: string;
    participantNumber: number;
    status: 'active' | 'pending' | 'disqualified';
}

export interface FormSubmissionState {
    isSubmitting: boolean;
    errors: FormErrors;
    isSuccess: boolean;
    errorMessage: string;
    attempt: number;
    lastSubmissionTime?: Date;
}

export interface FormValidationResult {
    isValid: boolean;
    errors: FormErrors;
    warnings?: string[];
}

export interface SorteoStats {
    totalParticipants: number;
    lastUpdate: string;
    drawDate: string;
    prizesCount: number;
    registrationDeadline: string;
}

export interface NetworkStatus {
    isOnline: boolean;
    connectionType?: string;
    lastCheck: Date;
}

export interface FormFieldValidation {
    isValid: boolean;
    message?: string;
    suggestion?: string;
}

export type ModalType = 'success' | 'error' | 'warning' | 'info' | null;

export type FormFieldName = 'email' | 'fullName' | 'phone' | 'terms';

export type SubmissionStatus =
    | 'idle'
    | 'validating'
    | 'submitting'
    | 'success'
    | 'error'
    | 'retrying';

// Constantes para validación
export const VALIDATION_RULES = {
    EMAIL: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 254,
        PATTERN: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    FULL_NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        PATTERN: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/
    },
    PHONE: {
        MIN_LENGTH: 9,
        MAX_LENGTH: 15,
        PATTERN: /^\+?[\d\s\-\(\)]{9,15}$/
    }
} as const;

// Mensajes de error predefinidos
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: (field: string) => `${field} es obligatorio`,
    INVALID_EMAIL: 'Por favor ingresa un email válido',
    INVALID_PHONE: 'Por favor ingresa un teléfono válido',
    NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres',
    NAME_TOO_LONG: 'El nombre no puede exceder 100 caracteres',
    EMAIL_TOO_SHORT: 'El email es demasiado corto',
    EMAIL_TOO_LONG: 'El email es demasiado largo',
    PHONE_TOO_SHORT: 'El teléfono debe tener al menos 9 dígitos',
    PHONE_TOO_LONG: 'El teléfono no puede tener más de 15 dígitos',
    TERMS_NOT_ACCEPTED: 'Debes aceptar los términos y condiciones',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    SERVER_ERROR: 'Error del servidor. Inténtalo más tarde.',
    DUPLICATE_EMAIL: 'Este email ya está registrado en el sorteo',
    INVALID_CHARACTERS: (field: string) => `${field} contiene caracteres no válidos`,
    SUBMISSION_TIMEOUT: 'La solicitud tardó demasiado tiempo',
    UNKNOWN_ERROR: 'Ocurrió un error inesperado'
} as const;

// Configuración de la API
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        PARTICIPANTS: '/api/participants',
        STATS: '/api/stats',
        HEALTH: '/health'
    },
    TIMEOUT: 15000,
    MAX_RETRIES: 2,
    RETRY_DELAY: 1000
} as const;

// Configuración del sorteo
export const SORTEO_CONFIG = {
    REGISTRATION_DEADLINE: '2024-01-15T23:59:59Z',
    DRAW_DATE: '2024-01-20T12:00:00Z',
    PRIZES: [
        { position: 1, description: '$5,000 en efectivo', value: 5000 },
        { position: 2, description: 'iPhone 15 Pro', value: 1200 },
        { position: 3, description: 'MacBook Air', value: 1000 }
    ],
    TOTAL_PRIZE_VALUE: 10000,
    MIN_PARTICIPANTS: 100,
    MAX_PARTICIPANTS: 10000
} as const;

// Tipos para eventos del formulario
export interface FormEvent {
    type: 'field_change' | 'validation' | 'submission' | 'error' | 'success';
    field?: FormFieldName;
    data?: unknown;
    timestamp: Date;
}

export interface FormEventHandler {
    (event: FormEvent): void;
}

// Tipos para el estado global del formulario
export interface FormState {
    data: ParticipantData;
    errors: FormErrors;
    status: SubmissionStatus;
    attempts: number;
    lastSubmission?: Date;
    networkStatus: NetworkStatus;
    validationState: Record<FormFieldName, FormFieldValidation>;
}

// Utilidades de tipo
export type RequiredParticipantData = Required<Pick<ParticipantData, 'email' | 'fullName'>>;

export type OptionalParticipantData = Partial<Pick<ParticipantData, 'phone'>>;

export type FormDataUpdate = Partial<ParticipantData>;

// Interfaces para componentes
export interface FormInputProps {
    id: string;
    name: FormFieldName;
    type: 'text' | 'email' | 'tel';
    label: string;
    placeholder: string;
    required?: boolean;
    icon: string;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
}

export interface ModalProps {
    id: string;
    type: ModalType;
    title: string;
    message?: string;
    buttonText: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export interface ConfettiProps {
    duration?: number;
    particleCount?: number;
    colors?: string[];
}

// Tipos para la gestión de estado
export interface FormAction {
    type: 'UPDATE_FIELD' | 'SET_ERROR' | 'CLEAR_ERRORS' | 'SET_STATUS' | 'RESET_FORM';
    payload?: unknown;
}

export interface FormReducerState extends FormState { }

// Tipos para hooks personalizados
export interface UseFormValidation {
    validateField: (field: FormFieldName, value: string) => FormFieldValidation;
    validateForm: (data: ParticipantData) => FormValidationResult;
    clearErrors: () => void;
    errors: FormErrors;
}

export interface UseFormSubmission {
    submit: (data: ParticipantData) => Promise<void>;
    isSubmitting: boolean;
    status: SubmissionStatus;
    error?: string;
    reset: () => void;
}

// Tipos para el contexto de la aplicación
export interface AppContext {
    formState: FormState;
    stats: SorteoStats | null;
    updateFormData: (data: FormDataUpdate) => void;
    submitForm: () => Promise<void>;
    resetForm: () => void;
}

// Tipos para analytics (opcional)
export interface AnalyticsEvent {
    event: string;
    category: 'form' | 'ui' | 'api';
    action: string;
    label?: string;
    value?: number;
    timestamp: Date;
}

// Export de utilidades
export const isValidEmail = (email: string): boolean =>
    VALIDATION_RULES.EMAIL.PATTERN.test(email);

export const isValidPhone = (phone: string): boolean =>
    VALIDATION_RULES.PHONE.PATTERN.test(phone.replace(/[\s\-\(\)]/g, ''));

export const isValidFullName = (name: string): boolean =>
    name.length >= VALIDATION_RULES.FULL_NAME.MIN_LENGTH &&
    name.length <= VALIDATION_RULES.FULL_NAME.MAX_LENGTH &&
    VALIDATION_RULES.FULL_NAME.PATTERN.test(name);

// Función de utilidad para crear un participante vacío
export const createEmptyParticipant = (): ParticipantData => ({
    email: '',
    fullName: '',
    phone: undefined,
    source: 'sorteo_web',
    timestamp: new Date().toISOString()
});

// Función de utilidad para crear estado inicial del formulario
export const createInitialFormState = (): FormState => ({
    data: createEmptyParticipant(),
    errors: {},
    status: 'idle',
    attempts: 0,
    networkStatus: {
        isOnline: navigator.onLine,
        lastCheck: new Date()
    },
    validationState: {
        email: { isValid: false },
        fullName: { isValid: false },
        phone: { isValid: true }, // Opcional, por defecto válido
        terms: { isValid: false }
    }
});