"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    password: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    expiresAt?: string;
}

export function useAdminAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isLoading: false,
        error: null,
    });

    const router = useRouter();

    const login = useCallback(async (credentials: LoginCredentials, redirectTo: string = '/sorteo-iphone'): Promise<boolean> => {
        setAuthState({ isLoading: true, error: null });

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const result: AuthResponse = await response.json();

            if (result.success) {
                setAuthState({ isLoading: false, error: null });

                router.push(redirectTo);
                router.refresh();

                return true;
            } else {
                setAuthState({
                    isLoading: false,
                    error: result.message || 'Error de autenticación'
                });
                return false;
            }
        } catch (error) {
            console.error('Error en login:', error);
            setAuthState({
                isLoading: false,
                error: 'Error de conexión. Intenta nuevamente.'
            });
            return false;
        }
    }, [router]);

    const logout = useCallback(async (): Promise<boolean> => {
        setAuthState({ isLoading: true, error: null });

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'DELETE',
            });

            if (response.ok) {
                setAuthState({ isLoading: false, error: null });

                router.push('/admin/login');
                router.refresh();

                return true;
            } else {
                setAuthState({
                    isLoading: false,
                    error: 'Error al cerrar sesión'
                });
                return false;
            }
        } catch (error) {
            console.error('Error en logout:', error);
            setAuthState({
                isLoading: false,
                error: 'Error de conexión'
            });
            return false;
        }
    }, [router]);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        isLoading: authState.isLoading,
        error: authState.error,
        login,
        logout,
        clearError,
    };
}