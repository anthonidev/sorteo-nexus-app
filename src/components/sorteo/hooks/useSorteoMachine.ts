"use client";

import { useConfetti } from "@/hook/useConfetti";
import { ParticipantListItem } from "@/lib/schemas/participants";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSorteoMachineProps {
    participants: ParticipantListItem[];
    isVisible: boolean;
    onWinner: (winner: ParticipantListItem) => void;
}

export function useSorteoMachine({
    participants,
    isVisible,
    onWinner,
}: UseSorteoMachineProps) {
    // Estados principales
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [winner, setWinner] = useState<ParticipantListItem | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [currentAttempt, setCurrentAttempt] = useState(1);
    const [eliminatedParticipants, setEliminatedParticipants] = useState<
        ParticipantListItem[]
    >([]);
    const [remainingParticipants, setRemainingParticipants] =
        useState<ParticipantListItem[]>(participants);
    const [showSadEmojis, setShowSadEmojis] = useState(false);
    const [eliminatingParticipant, setEliminatingParticipant] = useState<ParticipantListItem | null>(null);
    const [isEliminationPhase, setIsEliminationPhase] = useState(false);

    // Referencias
    const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Hooks
    const { fireConfetti, fireContinuousConfetti } = useConfetti();

    // Constantes
    const visibleSlots = 5;
    const centerIndex = Math.floor(visibleSlots / 2);

    // Función para resetear la máquina
    const resetMachine = useCallback(() => {
        setIsSpinning(false);
        setCurrentIndex(0);
        setWinner(null);
        setShowResult(false);
        setCurrentAttempt(1);
        setEliminatedParticipants([]);
        setRemainingParticipants([...participants]);
        setShowSadEmojis(false);
        setEliminatingParticipant(null);
        setIsEliminationPhase(false);

        if (spinIntervalRef.current) {
            clearInterval(spinIntervalRef.current);
            spinIntervalRef.current = null;
        }
    }, [participants]);

    // Función para obtener participantes visibles en los slots
    const getSlotParticipants = useCallback(() => {
        const slots = [];
        for (let i = -centerIndex; i <= centerIndex; i++) {
            const index =
                (currentIndex + i + remainingParticipants.length) %
                remainingParticipants.length;
            slots.push({
                participant: remainingParticipants[index],
                isCenter: i === 0,
                offset: i,
            });
        }
        return slots;
    }, [currentIndex, remainingParticipants, centerIndex]);

    // Función principal del sorteo
    const startSorteo = useCallback(() => {
        if (remainingParticipants.length === 0 || isSpinning) return;

        setIsSpinning(true);
        setShowResult(false);
        setShowSadEmojis(false);

        let speed = 50;
        let spins = 0;
        const maxSpins = 50 + Math.random() * 30;

        const spin = () => {
            setCurrentIndex((prev) => (prev + 1) % remainingParticipants.length);
            spins++;

            // Acelerar al final
            if (spins > maxSpins * 0.7) {
                speed += 20;
            }

            // Finalizar sorteo
            if (spins >= maxSpins) {
                if (spinIntervalRef.current) {
                    clearInterval(spinIntervalRef.current);
                    spinIntervalRef.current = null;
                }
                setIsSpinning(false);

                // Seleccionar ganador/eliminado
                const selectedIndex = Math.floor(
                    Math.random() * remainingParticipants.length
                );
                const selectedParticipant = remainingParticipants[selectedIndex];
                setCurrentIndex(selectedIndex);

                // Procesar resultado después de un delay
                setTimeout(() => {
                    if (currentAttempt < 3) {
                        // Marcar participante para eliminación
                        setEliminatingParticipant(selectedParticipant);
                        setIsEliminationPhase(true);

                        // Mostrar emojis tristes inmediatamente
                        setShowSadEmojis(true);

                        // Después de 1.5s, proceder con la eliminación animada
                        setTimeout(() => {
                            const newEliminated = [
                                ...eliminatedParticipants,
                                selectedParticipant,
                            ];
                            const newRemaining = remainingParticipants.filter(
                                (p) => p.id !== selectedParticipant.id
                            );

                            setEliminatedParticipants(newEliminated);
                            setRemainingParticipants(newRemaining);
                            setCurrentAttempt((prev) => prev + 1);

                            // Ocultar emojis tristes después de la eliminación
                            setTimeout(() => {
                                setShowSadEmojis(false);
                                setEliminatingParticipant(null);
                                setIsEliminationPhase(false);
                            }, 1000);
                        }, 1500);
                    } else {
                        // Declarar ganador
                        setWinner(selectedParticipant);
                        setShowResult(true);

                        // Efectos de celebración
                        fireConfetti();
                        fireContinuousConfetti();
                        onWinner(selectedParticipant);
                    }
                }, 1000);
            }
        };

        // Iniciar animación
        spinIntervalRef.current = setInterval(() => {
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current);
            }
            spinIntervalRef.current = setInterval(spin, speed);
            spin();
        }, speed);
    }, [
        remainingParticipants,
        isSpinning,
        currentAttempt,
        eliminatedParticipants,
        fireConfetti,
        fireContinuousConfetti,
        onWinner,
    ]);

    // Función para reiniciar el sorteo
    const restartSorteo = useCallback(() => {
        resetMachine();
    }, [resetMachine]);

    // Función para verificar si se puede iniciar el sorteo
    const canStartSorteo = useCallback(() => {
        return !isSpinning && remainingParticipants.length > 0 && !showResult;
    }, [isSpinning, remainingParticipants.length, showResult]);

    // Función para obtener el estado actual del sorteo
    const getSorteoState = useCallback(() => {
        if (isSpinning) return "spinning";
        if (showResult) return "completed";
        if (currentAttempt === 3) return "final_round";
        return "elimination";
    }, [isSpinning, showResult, currentAttempt]);

    // Función para obtener el texto del botón principal
    const getMainButtonText = useCallback(() => {
        if (isSpinning) return "Girando la ruleta...";
        if (showResult) return "¡Sorteo Completado!";
        if (currentAttempt === 3) return "¡SORTEO FINAL DEL GANADOR!";
        return `Eliminar participante (Ronda ${currentAttempt})`;
    }, [isSpinning, showResult, currentAttempt]);

    // Función para obtener el texto del estado
    const getStatusText = useCallback(() => {
        if (isSpinning) return "GIRANDO...";
        if (currentAttempt === 3) return "SORTEO FINAL";
        return `ELIMINACIÓN ${currentAttempt}`;
    }, [isSpinning, currentAttempt]);

    // Efectos
    useEffect(() => {
        if (!isVisible) {
            resetMachine();
        } else {
            setRemainingParticipants([...participants]);
        }
    }, [isVisible, participants, resetMachine]);

    // Limpiar intervalos al desmontar
    useEffect(() => {
        return () => {
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current);
            }
        };
    }, []);

    // Estado computado
    const sorteoStats = {
        totalParticipants: participants.length,
        remainingCount: remainingParticipants.length,
        eliminatedCount: eliminatedParticipants.length,
        currentRound: currentAttempt,
        totalRounds: 3,
        progressPercentage: ((currentAttempt - 1) / 3) * 100,
    };

    return {
        // Estados principales
        isSpinning,
        currentIndex,
        winner,
        showResult,
        currentAttempt,
        eliminatedParticipants,
        remainingParticipants,
        showSadEmojis,
        eliminatingParticipant,
        isEliminationPhase,

        // Estados computados
        sorteoStats,
        visibleSlots,
        centerIndex,

        // Funciones principales
        startSorteo,
        resetMachine,
        restartSorteo,
        getSlotParticipants,

        // Funciones de utilidad
        canStartSorteo,
        getSorteoState,
        getMainButtonText,
        getStatusText,
    };
}