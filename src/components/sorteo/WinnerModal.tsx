"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";

interface WinnerModalProps {
  winner: ParticipantListItem | null;
  showResult: boolean;
  eliminatedParticipants: ParticipantListItem[];
  onClose: () => void;
}

export default function WinnerModal({
  winner,
  showResult,
  eliminatedParticipants,
  onClose,
}: WinnerModalProps) {
  return (
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
              <p className="text-emerald-300 text-sm mb-1">{winner.email}</p>
              {winner.phone && (
                <p className="text-emerald-300 text-sm">{winner.phone}</p>
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
                Participantes eliminados: {eliminatedParticipants.length}
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
  );
}
