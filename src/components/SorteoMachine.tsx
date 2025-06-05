"use client";

import { useConfetti } from "@/hook/useConfetti";
import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SorteoMachineProps {
  participants: ParticipantListItem[];
  isVisible: boolean;
  onClose: () => void;
  onWinner: (winner: ParticipantListItem) => void;
}

const SadEmoji = ({ delay = 0 }: { delay?: number }) => {
  const emojis = ["😢", "😔", "😞", "💔", "😿"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, y: -20 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 500,
        damping: 25,
      }}
      className="inline-block text-lg"
    >
      {randomEmoji}
    </motion.span>
  );
};

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
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [eliminatedParticipants, setEliminatedParticipants] = useState<
    ParticipantListItem[]
  >([]);
  const [remainingParticipants, setRemainingParticipants] =
    useState<ParticipantListItem[]>(participants);
  const [showSadEmojis, setShowSadEmojis] = useState(false);

  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { fireConfetti, fireContinuousConfetti } = useConfetti();

  const visibleSlots = 5;
  const centerIndex = Math.floor(visibleSlots / 2);

  useEffect(() => {
    if (!isVisible) {
      resetMachine();
    } else {
      setRemainingParticipants([...participants]);
    }
  }, [isVisible, participants]);

  const resetMachine = () => {
    setIsSpinning(false);
    setCurrentIndex(0);
    setWinner(null);
    setShowResult(false);
    setCurrentAttempt(1);
    setEliminatedParticipants([]);
    setRemainingParticipants([...participants]);
    setShowSadEmojis(false);
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
  };

  const startSorteo = () => {
    if (remainingParticipants.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setShowSadEmojis(false);

    let speed = 50;
    let spins = 0;
    const maxSpins = 50 + Math.random() * 30;

    const spin = () => {
      setCurrentIndex((prev) => (prev + 1) % remainingParticipants.length);
      spins++;

      if (spins > maxSpins * 0.7) {
        speed += 20;
      }

      if (spins >= maxSpins) {
        clearInterval(spinIntervalRef.current!);
        setIsSpinning(false);

        const selectedIndex = Math.floor(
          Math.random() * remainingParticipants.length
        );
        const selectedParticipant = remainingParticipants[selectedIndex];
        setCurrentIndex(selectedIndex);

        setTimeout(() => {
          if (currentAttempt < 3) {
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

            setShowSadEmojis(true);
            setTimeout(() => setShowSadEmojis(false), 2000);
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
      clearInterval(spinIntervalRef.current!);
      spinIntervalRef.current = setInterval(spin, speed);
      spin();
    }, speed);
  };

  const getSlotParticipants = () => {
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
  };

  const modalContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && !isSpinning && onClose()
          }
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 rounded-3xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/30 p-8 max-w-5xl w-full relative overflow-hidden max-h-[95vh] overflow-y-auto"
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-green-500/15 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "1000ms" }}
              ></div>
              <div
                className="absolute top-3/4 left-1/2 w-48 h-48 bg-emerald-700/10 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "2000ms" }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex  justify-center space-x-6 items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full mb-6 shadow-lg shadow-emerald-500/50"
                >
                  <span className="text-4xl">🎰</span>
                </motion.div>
                <div className="flex flex-col ">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                  >
                    Sorteo de Eliminación
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-lg mb-6"
                  >
                    {remainingParticipants.length} participantes restantes
                  </motion.p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lg:order-1 lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                  >
                    {/* Marco exterior de la máquina */}
                    <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 border-4 border-emerald-500/50 relative overflow-hidden">
                        {/* Luces laterales animadas */}
                        <div className="absolute left-3 top-6 bottom-6 w-3 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <div
                          className="absolute right-3 top-6 bottom-6 w-3 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"
                          style={{ animationDelay: "500ms" }}
                        ></div>

                        {/* Luces superiores */}
                        <div className="absolute top-3 left-8 right-8 h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-full animate-pulse"></div>

                        {/* Ventana de visualización mejorada */}
                        <div className="bg-black rounded-2xl p-6 border-3 border-emerald-400/60 relative min-h-[380px] flex flex-col justify-center shadow-inner">
                          {/* Marco dorado interno */}
                          <div className="absolute inset-2 border-2 border-yellow-400/30 rounded-xl pointer-events-none"></div>

                          {/* Indicador central mejorado */}
                          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-20 border-t-3 border-b-3 border-emerald-400 bg-emerald-400/10 z-10 pointer-events-none rounded-lg"></div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-400 rounded-full z-20 animate-pulse shadow-lg shadow-emerald-400/60">
                            <div className="absolute inset-1 bg-white rounded-full"></div>
                          </div>

                          {/* Slots de participantes mejorados */}
                          <div className="space-y-3 relative z-5">
                            {remainingParticipants.length > 0 ? (
                              getSlotParticipants().map((slot, index) => (
                                <motion.div
                                  key={`${slot.participant.id}-${index}`}
                                  className={`p-4 rounded-xl transition-all duration-300 ${
                                    slot.isCenter
                                      ? "bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-2 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/50"
                                      : "bg-gray-800/60 border border-gray-600 opacity-70"
                                  }`}
                                  animate={{
                                    scale: slot.isCenter ? 1.1 : 1,
                                    opacity: slot.isCenter ? 1 : 0.7,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                                        slot.isCenter
                                          ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/50"
                                          : "bg-gray-600"
                                      }`}
                                    >
                                      {slot.participant.fullName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`font-semibold truncate text-sm ${
                                          slot.isCenter
                                            ? "text-emerald-300"
                                            : "text-gray-300"
                                        }`}
                                      >
                                        {slot.participant.fullName}
                                      </p>
                                      <p
                                        className={`text-xs truncate ${
                                          slot.isCenter
                                            ? "text-emerald-200"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {slot.participant.email}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center text-gray-400 py-12">
                                <span className="text-4xl mb-4 block">🎯</span>
                                <p>¡Listo para el sorteo final!</p>
                              </div>
                            )}
                          </div>

                          {/* Efectos visuales durante el giro */}
                          {isSpinning && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-pulse rounded-2xl"></div>
                              <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-2xl animate-ping"></div>
                            </>
                          )}

                          {/* Emojis tristes para eliminaciones */}
                          <AnimatePresence>
                            {showSadEmojis && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                <div className="flex space-x-4">
                                  {[0, 1, 2].map((i) => (
                                    <SadEmoji key={i} delay={i * 0.2} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Pantalla de estado */}
                        <div className="mt-4 bg-gray-900/80 rounded-xl p-3 border border-emerald-500/30">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  isSpinning
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-green-500"
                                }`}
                              ></div>
                              <span className="text-emerald-400 text-sm font-medium">
                                {isSpinning
                                  ? "GIRANDO..."
                                  : currentAttempt === 3
                                  ? "SORTEO FINAL"
                                  : `ELIMINACIÓN ${currentAttempt}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:order-2 flex flex-col justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex mb-4 w-full items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/30"
                    >
                      {[1, 2, 3].map((attempt) => (
                        <div
                          key={attempt}
                          className="flex flex-col items-center space-y-1"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                              attempt < currentAttempt
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                                : attempt === currentAttempt
                                ? "bg-yellow-500 text-black animate-pulse shadow-lg shadow-yellow-500/50"
                                : "bg-gray-600 text-gray-400"
                            }`}
                          >
                            {attempt < currentAttempt ? "❌" : attempt}
                          </div>
                          <span className="text-xs text-gray-400">
                            {attempt === 3 ? "Final" : `Intento ${attempt}`}
                          </span>
                        </div>
                      ))}
                      <div className="ml-4 text-left">
                        <p className="text-emerald-400 text-sm font-medium">
                          Ronda {currentAttempt} de 3
                        </p>
                        <p className="text-gray-400 text-xs">
                          {currentAttempt === 3
                            ? "¡Sorteo final!"
                            : "Eliminación"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <span className="mr-3 text-2xl">💔</span>
                        Eliminados ({eliminatedParticipants.length})
                      </h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto scroll-container">
                        <AnimatePresence>
                          {eliminatedParticipants.map((participant, index) => (
                            <motion.div
                              key={participant.id}
                              initial={{ opacity: 0, x: 20, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -20, scale: 0.9 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm hover:bg-red-500/30 transition-all group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg relative">
                                  {participant.fullName.charAt(0).toUpperCase()}
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-xs">😔</span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-red-300 font-medium text-sm truncate group-hover:text-red-200 transition-colors">
                                    {participant.fullName}
                                  </p>
                                  <p className="text-red-400/80 text-xs truncate">
                                    Eliminado en ronda {index + 1}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {eliminatedParticipants.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <span className="text-3xl mb-2 block">🤞</span>
                            <p className="text-sm">Aún no hay eliminados</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                  >
                    <button
                      onClick={startSorteo}
                      disabled={
                        isSpinning ||
                        remainingParticipants.length === 0 ||
                        showResult
                      }
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                    >
                      {isSpinning && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 animate-pulse"></div>
                      )}
                      <span className="relative z-10 flex items-center justify-center text-lg">
                        {isSpinning ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white mr-3"></div>
                            Girando la ruleta...
                          </>
                        ) : showResult ? (
                          <>🏆 ¡Sorteo Completado!</>
                        ) : currentAttempt === 3 ? (
                          <>🎯 ¡SORTEO FINAL DEL GANADOR!</>
                        ) : (
                          <>🎲 Eliminar participante (Ronda {currentAttempt})</>
                        )}
                      </span>
                    </button>

                    <button
                      onClick={onClose}
                      disabled={isSpinning}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
                    >
                      {isSpinning
                        ? "Sorteando..."
                        : showResult
                        ? "Finalizar"
                        : "Cerrar"}
                    </button>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {showResult && winner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/98 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 300,
                      }}
                      className="text-center p-8 max-w-md"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: [0, 1.3, 1], rotate: [0, 360, 0] }}
                        transition={{ duration: 1.2, times: [0, 0.7, 1] }}
                        className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/60"
                      >
                        <span className="text-5xl">🏆</span>
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-bold text-white mb-3"
                      >
                        ¡Tenemos un ganador!
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400 rounded-2xl p-6 mb-6 backdrop-blur-sm"
                      >
                        <p className="text-2xl font-bold text-emerald-400 mb-2">
                          {winner.fullName}
                        </p>
                        <p className="text-emerald-300 text-sm mb-1">
                          {winner.email}
                        </p>
                        {winner.phone && (
                          <p className="text-emerald-300 text-sm">
                            {winner.phone}
                          </p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-yellow-500/10 border border-yellow-400/50 rounded-xl p-4 mb-8"
                      >
                        <p className="text-yellow-400 text-sm font-medium mb-1">
                          🎯 Ganador del sorteo de eliminación
                        </p>
                        <p className="text-yellow-300 text-xs">
                          Participantes eliminados:{" "}
                          {eliminatedParticipants.length}
                        </p>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/50"
                      >
                        🎉 ¡Felicidades al ganador!
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}
