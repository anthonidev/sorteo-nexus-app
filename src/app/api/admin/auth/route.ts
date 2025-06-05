import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD no está configurada en las variables de entorno')
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error de configuración del servidor'
                },
                { status: 500 }
            )
        }

        if (password !== adminPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Contraseña incorrecta'
                },
                { status: 401 }
            )
        }

        const expirationTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) // 2 días en milisegundos
        const tokenData = {
            authenticated: true,
            expires: expirationTime,
            timestamp: new Date().getTime()
        }

        const token = btoa(JSON.stringify(tokenData))

        const response = NextResponse.json({
            success: true,
            message: 'Autenticación exitosa',
            expiresAt: new Date(expirationTime).toISOString()
        })

        response.cookies.set('admin-auth', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript del cliente
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'lax', // Protección CSRF
            maxAge: 2 * 24 * 60 * 60, // 2 días en segundos
            path: '/' // Cookie disponible en toda la aplicación
        })

        return response

    } catch (error) {
        console.error('Error en autenticación de admin:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Error interno del servidor'
            },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        })

        response.cookies.set('admin-auth', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

        return response

    } catch (error) {
        console.error('Error al cerrar sesión:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Error al cerrar sesión'
            },
            { status: 500 }
        )
    }
}