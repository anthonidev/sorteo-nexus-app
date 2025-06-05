"use client";

import { ParticipantListItem } from "@/lib/schemas/participants";
import { AnimatePresence, motion } from "framer-motion";
import SadEmoji from "./SadEmoji";
import EliminationOverlay from "./EliminationOverlay";

interface SorteoDisplayProps {
  remainingParticipants: ParticipantListItem[];
  currentIndex: number;
  isSpinning: boolean;
  showSadEmojis: boolean;
  currentAttempt: number;
  eliminatingParticipant: ParticipantListItem | null;
  isEliminationPhase: boolean;
  getSlotParticipants: () => Array<{
    participant: ParticipantListItem;
    isCenter: boolean;
    offset: number;
  }>;
}

export default function SorteoDisplay({
  remainingParticipants,
  currentIndex,
  isSpinning,
  showSadEmojis,
  currentAttempt,
  eliminatingParticipant,
  isEliminationPhase,
  getSlotParticipants,
}: SorteoDisplayProps) {
  return (
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
                getSlotParticipants().map((slot, index) => {
                  const isEliminating =
                    eliminatingParticipant?.id === slot.participant.id;

                  return (
                    <motion.div
                      key={`${slot.participant.id}-${index}`}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        slot.isCenter
                          ? "bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-2 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/50"
                          : "bg-gray-800/60 border border-gray-600 opacity-70"
                      } ${
                        isEliminating && isEliminationPhase
                          ? "ring-4 ring-red-500/50 bg-red-500/20"
                          : ""
                      }`}
                      animate={{
                        scale: slot.isCenter ? 1.1 : 1,
                        opacity:
                          isEliminating && isEliminationPhase
                            ? 0.3
                            : slot.isCenter
                            ? 1
                            : 0.7,
                        x:
                          isEliminating && isEliminationPhase
                            ? [0, -10, 10, -5, 5, 0]
                            : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        x: { duration: 0.6, ease: "easeInOut" },
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 ${
                            slot.isCenter
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/50"
                              : "bg-gray-600"
                          } ${
                            isEliminating && isEliminationPhase
                              ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/50"
                              : ""
                          }`}
                        >
                          {slot.participant.fullName.charAt(0).toUpperCase()}
                          {isEliminating && isEliminationPhase && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                            >
                              <span className="text-xs">❌</span>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold truncate text-sm transition-colors duration-300 ${
                              slot.isCenter
                                ? "text-emerald-300"
                                : "text-gray-300"
                            } ${
                              isEliminating && isEliminationPhase
                                ? "text-red-300"
                                : ""
                            }`}
                          >
                            {slot.participant.fullName}
                          </p>
                          <p
                            className={`text-xs truncate transition-colors duration-300 ${
                              slot.isCenter
                                ? "text-emerald-200"
                                : "text-gray-500"
                            } ${
                              isEliminating && isEliminationPhase
                                ? "text-red-200"
                                : ""
                            }`}
                          >
                            {slot.participant.email}
                          </p>
                        </div>
                        {isEliminating && isEliminationPhase && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-red-400 font-bold text-sm"
                          >
                            ELIMINADO
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <span className="text-4xl mb-4 block">🎯</span>
                  <p>¡Listo para el sorteo final!</p>
                </div>
              )}
            </div>

            {isSpinning && (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-pulse rounded-2xl"></div>
                <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-2xl animate-ping"></div>
              </>
            )}

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

            <EliminationOverlay
              isVisible={isEliminationPhase}
              eliminatingParticipant={eliminatingParticipant}
            />
          </div>

          <div className="mt-4 bg-gray-900/80 rounded-xl p-3 border border-emerald-500/30">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSpinning ? "bg-red-500 animate-pulse" : "bg-green-500"
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
  );
}
