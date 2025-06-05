"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { motion } from "framer-motion";

interface SorteoControlsProps {
  isSpinning: boolean;
  showResult: boolean;
  currentAttempt: number;
  remainingParticipants: ParticipantListItem[];
  onStartSorteo: () => void;
  onClose: () => void;
}

export default function SorteoControls({
  isSpinning,
  showResult,
  currentAttempt,
  remainingParticipants,
  onStartSorteo,
  onClose,
}: SorteoControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 mt-8"
    >
      <button
        onClick={onStartSorteo}
        disabled={
          isSpinning || remainingParticipants.length === 0 || showResult
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
        {isSpinning ? "Sorteando..." : showResult ? "Finalizar" : "Cerrar"}
      </button>
    </motion.div>
  );
}
