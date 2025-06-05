"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";

interface EliminatedListProps {
  eliminatedParticipants: ParticipantListItem[];
}

export default function EliminatedList({
  eliminatedParticipants,
}: EliminatedListProps) {
  return (
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
  );
}
