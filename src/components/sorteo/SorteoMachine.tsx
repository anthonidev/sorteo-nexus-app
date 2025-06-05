"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import SorteoDisplay from "./SorteoDisplay";
import SorteoControls from "./SorteoControls";
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
  // Usar el hook personalizado para manejar toda la lógica
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
            {/* Efectos de fondo */}
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
              {/* Header */}
              <div className="mb-8 flex justify-center space-x-6 items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full mb-6 shadow-lg shadow-emerald-500/50"
                >
                  <span className="text-4xl">🎰</span>
                </motion.div>
                <div className="flex flex-col">
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
                    {sorteoStats.remainingCount} participantes restantes
                  </motion.p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pantalla de sorteo */}
                <div className="lg:order-1 lg:col-span-1">
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

                {/* Panel de control */}
                <div className="lg:order-2 flex flex-col justify-between">
                  <div>
                    <SorteoStatus
                      currentAttempt={currentAttempt}
                      eliminatedParticipants={eliminatedParticipants}
                    />
                    <EliminatedList
                      eliminatedParticipants={eliminatedParticipants}
                    />
                  </div>

                  <SorteoControls
                    isSpinning={isSpinning}
                    showResult={showResult}
                    currentAttempt={currentAttempt}
                    remainingParticipants={remainingParticipants}
                    onStartSorteo={startSorteo}
                    onClose={onClose}
                  />
                </div>
              </div>

              {/* Modal de ganador */}
              <WinnerModal
                winner={winner}
                showResult={showResult}
                eliminatedParticipants={eliminatedParticipants}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}
