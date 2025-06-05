// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Solo aplicar middleware a las rutas del sorteo
    if (request.nextUrl.pathname.startsWith('/sorteo-iphone')) {
        const adminToken = request.cookies.get('admin-auth')?.value

        // Verificar si el token existe y no ha expirado
        if (!adminToken) {
            // Redirigir al login si no hay token
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        try {
            // Decodificar y verificar el token
            const tokenData = JSON.parse(atob(adminToken))
            const now = new Date().getTime()

            // Verificar si el token ha expirado (2 días = 48 horas)
            if (tokenData.expires < now) {
                // Token expirado, redirigir al login
                const response = NextResponse.redirect(new URL('/admin/login', request.url))
                // Limpiar la cookie expirada
                response.cookies.set('admin-auth', '', {
                    expires: new Date(0),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/'
                })
                return response
            }

            // Token válido, permitir acceso
            return NextResponse.next()
        } catch {
            // Token malformado, redirigir al login
            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.set('admin-auth', '', {
                expires: new Date(0),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            })
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/sorteo-iphone/:path*'
}