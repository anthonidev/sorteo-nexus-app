export interface ParticipantData {
    email: string;
    fullName: string;
    phone?: string;
}

export interface FormErrors {
    email?: string;
    fullName?: string;
    phone?: string;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface FormSubmissionState {
    isSubmitting: boolean;
    errors: FormErrors;
    isSuccess: boolean;
    errorMessage: string;
}

export type ModalType = 'success' | 'error' | null;