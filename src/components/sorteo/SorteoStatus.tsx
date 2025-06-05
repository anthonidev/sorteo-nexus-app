"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { motion } from "framer-motion";

interface SorteoStatusProps {
  currentAttempt: number;
  eliminatedParticipants: ParticipantListItem[];
}

export default function SorteoStatus({ currentAttempt }: SorteoStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="inline-flex mb-4 w-full items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/30"
    >
      {[1, 2, 3].map((attempt) => (
        <div key={attempt} className="flex flex-col items-center space-y-1">
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
          {currentAttempt === 3 ? "¡Sorteo final!" : "Eliminación"}
        </p>
      </div>
    </motion.div>
  );
}
