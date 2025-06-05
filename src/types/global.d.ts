
export interface LoadingProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
}

export interface ErrorBoundaryProps {
    error: Error & { digest?: string }
    reset: () => void
}

export interface FormState {
    isSubmitting: boolean
    isSuccess: boolean
    isError: boolean
    message?: string
}

declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: {
                event_category?: string
                event_label?: string
                value?: number
                description?: string
                [key: string]: unknown
            }
        ) => void
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_BASE_URL: string
            NODE_ENV: 'development' | 'production' | 'test'
            ADMIN_PASSWORD: string
        }
    }
}

export { }