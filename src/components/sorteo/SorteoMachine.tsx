"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import SorteoDisplay from "./SorteoDisplay";
import SorteoLeverControl from "./SorteoLeverControl";
import SorteoStatus from "./SorteoStatus";
import EliminatedList from "./EliminatedList";
import WinnerModal from "./WinnerModal";
import { useSorteoMachine } from "./hooks/useSorteoMachine";

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
  const {
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
    startSorteo,
    getSlotParticipants,
  } = useSorteoMachine({
    participants,
    isVisible,
    onWinner,
  });

  const modalContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/98 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) =>
            e.target === e.currentTarget && !isSpinning && onClose()
          }
        >
          {/* Efectos de fondo animados */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1000ms" }}
            ></div>
            <div
              className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-700/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "2000ms" }}
            ></div>

            {/* Líneas de energía */}
            {(isSpinning || showResult) && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent"
                    style={{ left: `${8.33 * i}%` }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scaleY: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-gradient-to-br from-gray-900 via-emerald-950/50 to-gray-900 rounded-3xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/30 p-8 max-w-7xl w-full relative overflow-hidden max-h-[95vh] overflow-y-auto"
          >
            {/* Efectos de luz en los bordes */}

            <div className="relative z-10">
              {/* Header mejorado */}

              {/* Layout principal mejorado */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Pantalla de sorteo - Columna principal */}
                <div className="lg:col-span-2 lg:order-1">
                  <SorteoDisplay
                    remainingParticipants={remainingParticipants}
                    currentIndex={currentIndex}
                    isSpinning={isSpinning}
                    showSadEmojis={showSadEmojis}
                    currentAttempt={currentAttempt}
                    getSlotParticipants={getSlotParticipants}
                    eliminatingParticipant={eliminatingParticipant}
                    isEliminationPhase={isEliminationPhase}
                  />
                </div>

                {/* Panel de control lateral */}
                <div className="lg:col-span-1 lg:order-2 flex flex-col justify-between space-y-6">
                  {/* Estado del sorteo */}
                  <div className="space-y-6">
                    <SorteoStatus
                      currentAttempt={currentAttempt}
                      eliminatedParticipants={eliminatedParticipants}
                    />

                    {/* Lista de eliminados en un contenedor con scroll */}
                    <div className="max-h-60 overflow-y-auto">
                      <EliminatedList
                        eliminatedParticipants={eliminatedParticipants}
                      />
                    </div>
                  </div>

                  {/* Control de palanca */}
                  <div className="mt-auto">
                    <SorteoLeverControl
                      isSpinning={isSpinning}
                      showResult={showResult}
                      currentAttempt={currentAttempt}
                      remainingParticipants={remainingParticipants}
                      onStartSorteo={startSorteo}
                      onClose={onClose}
                    />
                  </div>
                </div>
              </div>

              <WinnerModal
                winner={winner}
                showResult={showResult}
                eliminatedParticipants={eliminatedParticipants}
                onClose={onClose}
              />
            </div>

            {/* Efectos de partículas de fondo */}
            {isSpinning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
                    animate={{
                      x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                      y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}
