"use client";

import { useCallback } from "react";

export const useConfetti = () => {
    const fireConfetti = useCallback(async () => {
        // Importación dinámica para evitar problemas de SSR
        const confetti = (await import('canvas-confetti')).default;

        // Configuración de colores tema emerald/green
        const colors = [
            '#10b981', // emerald-500
            '#059669', // emerald-600  
            '#047857', // emerald-700
            '#34d399', // emerald-400
            '#6ee7b7', // emerald-300
            '#a7f3d0', // emerald-200
            '#ffffff', // white
        ];

        // Función para crear explosión de confeti
        const createConfettiExplosion = (particleCount: number, spread: number, startVelocity: number) => {
            return confetti({
                particleCount,
                spread,
                startVelocity,
                colors,
                origin: { y: 0.6 }, // Posición desde donde sale el confeti
                gravity: 0.8,
                scalar: 1.2,
                drift: 0,
                ticks: 300,
                shapes: ['square', 'circle'],
                zIndex: 9999
            });
        };

        // Secuencia de explosiones para efecto más dramático
        const sequence = async () => {
            // Primera explosión - central
            await createConfettiExplosion(50, 70, 45);

            // Pequeña pausa
            await new Promise(resolve => setTimeout(resolve, 100));

            // Segunda explosión - más dispersa
            await createConfettiExplosion(75, 100, 35);

            // Pausa más larga
            await new Promise(resolve => setTimeout(resolve, 200));

            // Tercera explosión - desde los lados
            Promise.all([
                confetti({
                    particleCount: 30,
                    spread: 60,
                    startVelocity: 30,
                    colors,
                    origin: { x: 0.2, y: 0.7 },
                    gravity: 0.8,
                    scalar: 1.1,
                    zIndex: 9999
                }),
                confetti({
                    particleCount: 30,
                    spread: 60,
                    startVelocity: 30,
                    colors,
                    origin: { x: 0.8, y: 0.7 },
                    gravity: 0.8,
                    scalar: 1.1,
                    zIndex: 9999
                })
            ]);

            // Lluvia final de confeti
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 160,
                    startVelocity: 25,
                    colors,
                    origin: { y: 0.3 },
                    gravity: 0.6,
                    scalar: 0.8,
                    drift: 1,
                    ticks: 400,
                    zIndex: 9999
                });
            }, 300);
        };

        // Ejecutar la secuencia
        sequence();
    }, []);

    // Efecto de confeti más sutil para interacciones menores
    const fireSuccessConfetti = useCallback(async () => {
        const confetti = (await import('canvas-confetti')).default;

        const colors = ['#10b981', '#34d399', '#6ee7b7', '#ffffff'];

        confetti({
            particleCount: 60,
            spread: 80,
            startVelocity: 30,
            colors,
            origin: { y: 0.7 },
            gravity: 0.9,
            scalar: 1,
            ticks: 200,
            zIndex: 9999
        });
    }, []);

    // Efecto de confeti continuo (para celebraciones especiales)
    const fireContinuousConfetti = useCallback(async () => {
        const confetti = (await import('canvas-confetti')).default;

        const colors = [
            '#10b981', '#059669', '#047857', '#34d399',
            '#6ee7b7', '#a7f3d0', '#ffffff'
        ];

        const duration = 3000; // 3 segundos
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                spread: 60,
                startVelocity: 25,
                colors,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.3 + 0.1
                },
                gravity: 0.6,
                scalar: 0.9,
                drift: 0.5,
                zIndex: 9999
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return {
        fireConfetti,
        fireSuccessConfetti,
        fireContinuousConfetti
    };
};