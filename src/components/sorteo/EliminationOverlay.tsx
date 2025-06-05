"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";

interface EliminationOverlayProps {
  isVisible: boolean;
  eliminatingParticipant: ParticipantListItem | null;
}

export default function EliminationOverlay({
  isVisible,
  eliminatingParticipant,
}: EliminationOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && eliminatingParticipant && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-red-900/30 backdrop-blur-sm flex items-center justify-center z-40 rounded-2xl"
        >
          {/* Efecto de "X" gigante */}
          <motion.div
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 15, 0],
              opacity: [0, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.6, 1],
              ease: "easeOut",
            }}
            className="text-9xl text-red-500 font-black drop-shadow-2xl"
          >
            ❌
          </motion.div>

          {/* Texto de eliminación */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute bottom-16 text-center"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
              className="text-2xl font-bold text-red-400 mb-2"
            >
              ELIMINADO
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-red-300"
            >
              {eliminatingParticipant.fullName}
            </motion.p>
          </motion.div>

          {/* Partículas de eliminación */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  scale: 0,
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute w-4 h-4 bg-red-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
