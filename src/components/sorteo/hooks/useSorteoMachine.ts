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
    const [predeterminedWinnerId, setPredeterminedWinnerId] = useState<string | null>(null);
    const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { fireConfetti, fireContinuousConfetti } = useConfetti();

    const visibleSlots = 5;
    const centerIndex = Math.floor(visibleSlots / 2);

    const fetchPredeterminedWinner = useCallback(async () => {
        try {
            const response = await fetch('/api/predetermined-winner');
            if (response.ok) {
                const data = await response.json();
                setPredeterminedWinnerId(data.winnerId);
            }
        } catch {
            setPredeterminedWinnerId(null);
        }
    }, []);

    const findPredeterminedWinner = useCallback(() => {
        if (!predeterminedWinnerId) return null;

        const predeterminedWinner = remainingParticipants.find(
            participant => participant.id === predeterminedWinnerId
        );

        if (predeterminedWinner) {
            return predeterminedWinner;
        } else {
            return null;
        }
    }, [predeterminedWinnerId, remainingParticipants]);

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

                // Determinar el participante seleccionado según el intento
                let selectedParticipant: ParticipantListItem;
                let selectedIndex: number;

                if (currentAttempt === 3) {
                    // En el tercer intento, intentar usar el ganador predeterminado
                    const predeterminedWinner = findPredeterminedWinner();

                    if (predeterminedWinner) {
                        selectedParticipant = predeterminedWinner;
                        selectedIndex = remainingParticipants.findIndex(p => p.id === predeterminedWinner.id);
                    } else {
                        // Si no hay ganador predeterminado o no está en los participantes, sorteo aleatorio
                        selectedIndex = Math.floor(Math.random() * remainingParticipants.length);
                        selectedParticipant = remainingParticipants[selectedIndex];
                    }
                } else {
                    // En los dos primeros intentos, sorteo aleatorio normal
                    // pero asegurarse de que no sea el ganador predeterminado si existe
                    const predeterminedWinner = findPredeterminedWinner();
                    let availableParticipants = remainingParticipants;

                    if (predeterminedWinner && remainingParticipants.length > 1) {
                        // Filtrar el ganador predeterminado para las eliminaciones
                        availableParticipants = remainingParticipants.filter(
                            p => p.id !== predeterminedWinner.id
                        );
                    }

                    // Si después del filtro no quedan participantes, usar todos
                    if (availableParticipants.length === 0) {
                        availableParticipants = remainingParticipants;
                    }

                    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
                    selectedParticipant = availableParticipants[randomIndex];
                    selectedIndex = remainingParticipants.findIndex(p => p.id === selectedParticipant.id);
                }

                setCurrentIndex(selectedIndex);

                // Procesar resultado después de un delay
                setTimeout(() => {
                    if (currentAttempt < 3) {
                        setEliminatingParticipant(selectedParticipant);
                        setIsEliminationPhase(true);

                        setShowSadEmojis(true);

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


                            setTimeout(() => {
                                setShowSadEmojis(false);
                                setEliminatingParticipant(null);
                                setIsEliminationPhase(false);
                            }, 1000);
                        }, 1500);
                    } else {
                        setWinner(selectedParticipant);
                        setShowResult(true);



                        fireConfetti();
                        fireContinuousConfetti();
                        onWinner(selectedParticipant);
                    }
                }, 1000);
            }
        };

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
        findPredeterminedWinner,
        predeterminedWinnerId,
    ]);

    const restartSorteo = useCallback(() => {
        resetMachine();
    }, [resetMachine]);

    const canStartSorteo = useCallback(() => {
        return !isSpinning && remainingParticipants.length > 0 && !showResult;
    }, [isSpinning, remainingParticipants.length, showResult]);

    const getSorteoState = useCallback(() => {
        if (isSpinning) return "spinning";
        if (showResult) return "completed";
        if (currentAttempt === 3) return "final_round";
        return "elimination";
    }, [isSpinning, showResult, currentAttempt]);

    const getMainButtonText = useCallback(() => {
        if (isSpinning) return "Girando la ruleta...";
        if (showResult) return "¡Sorteo Completado!";
        if (currentAttempt === 3) {
            const predeterminedWinner = findPredeterminedWinner();
            if (predeterminedWinner) {
                return "¡SORTEO FINAL - GANADOR PREDETERMINADO!";
            }
            return "¡SORTEO FINAL DEL GANADOR!";
        }
        return `Eliminar participante (Ronda ${currentAttempt})`;
    }, [isSpinning, showResult, currentAttempt, findPredeterminedWinner]);

    const getStatusText = useCallback(() => {
        if (isSpinning) return "GIRANDO...";
        if (currentAttempt === 3) {
            const predeterminedWinner = findPredeterminedWinner();
            if (predeterminedWinner) {
                return "SORTEO PREDETERMINADO";
            }
            return "SORTEO FINAL";
        }
        return `ELIMINACIÓN ${currentAttempt}`;
    }, [isSpinning, currentAttempt, findPredeterminedWinner]);

    useEffect(() => {
        if (!isVisible) {
            resetMachine();
        } else {
            setRemainingParticipants([...participants]);
            fetchPredeterminedWinner();
        }
    }, [isVisible, participants, resetMachine, fetchPredeterminedWinner]);

    useEffect(() => {
        return () => {
            if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current);
            }
        };
    }, []);

    const sorteoStats = {
        totalParticipants: participants.length,
        remainingCount: remainingParticipants.length,
        eliminatedCount: eliminatedParticipants.length,
        currentRound: currentAttempt,
        totalRounds: 3,
        progressPercentage: ((currentAttempt - 1) / 3) * 100,
        hasPredeterminedWinner: !!predeterminedWinnerId,
        predeterminedWinnerAvailable: !!findPredeterminedWinner(),
    };

    return {
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

        sorteoStats,
        visibleSlots,
        centerIndex,

        startSorteo,
        resetMachine,
        restartSorteo,
        getSlotParticipants,

        canStartSorteo,
        getSorteoState,
        getMainButtonText,
        getStatusText,

        predeterminedWinnerId,
        findPredeterminedWinner,
    };
}