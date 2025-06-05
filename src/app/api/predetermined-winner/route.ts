import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const predeterminedWinnerId = process.env.PREDETERMINED_WINNER_ID

        if (!predeterminedWinnerId) {
            return NextResponse.json({
                winnerId: null,
                message: 'No hay ganador predeterminado configurado - usando sorteo aleatorio'
            })
        }

        if (typeof predeterminedWinnerId !== 'string' || predeterminedWinnerId.trim() === '') {
            console.warn('PREDETERMINED_WINNER_ID está configurado pero es inválido:', predeterminedWinnerId)
            return NextResponse.json({
                winnerId: null,
                message: 'ID de ganador predeterminado inválido - usando sorteo aleatorio'
            })
        }


        return NextResponse.json({
            winnerId: predeterminedWinnerId.trim(),
            message: 'Ganador predeterminado activo'
        })

    } catch (error) {
        console.error('Error al obtener ganador predeterminado:', error)

        return NextResponse.json({
            winnerId: null,
            message: 'Error al obtener configuración - usando sorteo aleatorio'
        })
    }
}

export async function POST(request: Request) {
    try {
        const { winnerId } = await request.json()

        if (!winnerId || typeof winnerId !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID de ganador requerido'
                },
                { status: 400 }
            )
        }


        return NextResponse.json({
            success: true,
            message: 'Configuración actualizada (requiere reinicio del servidor para aplicar)',
            currentWinnerId: process.env.PREDETERMINED_WINNER_ID || null,
            requestedWinnerId: winnerId
        })

    } catch (error) {
        console.error('Error al actualizar ganador predeterminado:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Error interno del servidor'
            },
            { status: 500 }
        )
    }
}