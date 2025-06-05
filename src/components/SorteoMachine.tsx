"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticipantListItem } from "@/lib/schemas/participants";
import { useConfetti } from "@/hook/useConfetti";

interface SorteoMachineProps {
  participants: ParticipantListItem[];
  isVisible: boolean;
  onClose: () => void;
  onWinner: (winner: ParticipantListItem) => void;
}

export default function SorteoMachine({
  participants,
  isVisible,
  onClose,
  onWinner,
}: SorteoMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<ParticipantListItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { fireConfetti, fireContinuousConfetti } = useConfetti();

  const visibleSlots = 5; // Cantidad de slots visibles
  const centerIndex = Math.floor(visibleSlots / 2);

  useEffect(() => {
    if (!isVisible) {
      resetMachine();
    }
  }, [isVisible]);

  const resetMachine = () => {
    setIsSpinning(false);
    setCurrentIndex(0);
    setWinner(null);
    setShowResult(false);
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
  };

  const startSorteo = () => {
    if (participants.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setWinner(null);

    let speed = 50; // Velocidad inicial rápida
    let spins = 0;
    const maxSpins = 50 + Math.random() * 30; // Número aleatorio de giros

    const spin = () => {
      setCurrentIndex((prev) => (prev + 1) % participants.length);
      spins++;

      // Reducir velocidad gradualmente
      if (spins > maxSpins * 0.7) {
        speed += 20;
      }

      if (spins >= maxSpins) {
        // Detener y seleccionar ganador
        clearInterval(spinIntervalRef.current!);
        setIsSpinning(false);

        // Seleccionar ganador aleatorio
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const selectedWinner = participants[winnerIndex];
        setCurrentIndex(winnerIndex);
        setWinner(selectedWinner);

        // Mostrar resultado después de una pausa
        setTimeout(() => {
          setShowResult(true);
          fireConfetti();
          fireContinuousConfetti();
          onWinner(selectedWinner);
        }, 1000);
      }
    };

    spinIntervalRef.current = setInterval(() => {
      clearInterval(spinIntervalRef.current!);
      spinIntervalRef.current = setInterval(spin, speed);
      spin();
    }, speed);
  };

  const getSlotParticipants = () => {
    const slots = [];
    for (let i = -centerIndex; i <= centerIndex; i++) {
      const index =
        (currentIndex + i + participants.length) % participants.length;
      slots.push({
        participant: participants[index],
        isCenter: i === 0,
        offset: i,
      });
    }
    return slots;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) =>
          e.target === e.currentTarget && !isSpinning && onClose()
        }
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 p-6 sm:p-8 max-w-lg w-full relative overflow-hidden"
        >
          {/* Efectos de fondo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1000ms" }}
            ></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                🎰 Máquina del Sorteo
              </h2>
              <p className="text-gray-400 text-sm">
                {participants.length} participantes registrados
              </p>
            </div>

            {/* Máquina de sorteo */}
            <div className="relative mb-8">
              {/* Marco de la máquina */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border-4 border-emerald-500/50 relative overflow-hidden">
                {/* Luces laterales */}
                <div className="absolute left-2 top-4 bottom-4 w-2 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                <div
                  className="absolute right-2 top-4 bottom-4 w-2 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "500ms" }}
                ></div>

                {/* Ventana de visualización */}
                <div className="bg-black rounded-xl p-4 border-2 border-emerald-400/50 relative min-h-[300px] flex flex-col justify-center">
                  {/* Indicador central */}
                  <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-16 border-t-2 border-b-2 border-emerald-400 bg-emerald-400/10 z-10 pointer-events-none"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full z-20 animate-pulse"></div>

                  {/* Slots de participantes */}
                  <div className="space-y-2">
                    {getSlotParticipants().map((slot, index) => (
                      <motion.div
                        key={`${slot.participant.id}-${index}`}
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          slot.isCenter
                            ? "bg-emerald-500/20 border-2 border-emerald-400 scale-105 z-10"
                            : "bg-gray-800/50 border border-gray-600 opacity-60"
                        }`}
                        animate={{
                          scale: slot.isCenter ? 1.05 : 1,
                          opacity: slot.isCenter ? 1 : 0.6,
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              slot.isCenter ? "bg-emerald-500" : "bg-gray-600"
                            }`}
                          >
                            {slot.participant.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium truncate ${
                                slot.isCenter
                                  ? "text-emerald-400"
                                  : "text-gray-300"
                              }`}
                            >
                              {slot.participant.fullName}
                            </p>
                            <p
                              className={`text-xs truncate ${
                                slot.isCenter
                                  ? "text-emerald-300"
                                  : "text-gray-500"
                              }`}
                            >
                              {slot.participant.email}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Efectos visuales durante el giro */}
                  {isSpinning && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startSorteo}
                disabled={isSpinning || participants.length === 0}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isSpinning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 animate-pulse"></div>
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {isSpinning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      Girando...
                    </>
                  ) : (
                    <>🎲 Iniciar Sorteo</>
                  )}
                </span>
              </button>

              <button
                onClick={onClose}
                disabled={isSpinning}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-colors disabled:cursor-not-allowed"
              >
                {isSpinning ? "Sorteando..." : "Cerrar"}
              </button>
            </div>

            {/* Resultado del sorteo */}
            <AnimatePresence>
              {showResult && winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-30 rounded-3xl"
                >
                  <div className="text-center p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 1, times: [0, 0.6, 1] }}
                      className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/50"
                    >
                      <span className="text-3xl">🏆</span>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      ¡Tenemos un ganador!
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-emerald-500/20 border border-emerald-400 rounded-xl p-4 mb-6"
                    >
                      <p className="text-xl font-bold text-emerald-400 mb-1">
                        {winner.fullName}
                      </p>
                      <p className="text-emerald-300 text-sm">{winner.email}</p>
                      {winner.phone && (
                        <p className="text-emerald-300 text-sm">
                          {winner.phone}
                        </p>
                      )}
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      onClick={onClose}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      🎉 ¡Felicidades!
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
