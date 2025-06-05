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
      <div className="relative bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl shadow-black/50">
        <div className="absolute -top-2 left-8 right-8 h-4 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 rounded-full opacity-80 animate-pulse"></div>

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gray-600 rounded-full shadow-inner"
            style={{
              top: i < 4 ? "12px" : "calc(100% - 24px)",
              left: `${15 + (i % 4) * 25}%`,
            }}
          >
            <div className="w-1 h-1 bg-gray-400 rounded-full absolute top-1 left-1"></div>
          </div>
        ))}

        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 border-4 border-emerald-500/60 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-400/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-600/10 to-transparent"></div>
          </div>

          <div className="absolute left-2 top-8 bottom-8 w-4 bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/60">
            <div className="absolute inset-1 bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
          </div>
          <div className="absolute right-2 top-8 bottom-8 w-4 bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/60">
            <div
              className="absolute inset-1 bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-full animate-pulse"
              style={{ animationDelay: "500ms" }}
            ></div>
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"
              style={{ animationDelay: "500ms" }}
            ></div>
          </div>

          {/* Header con título estilo neon */}
          <div className="absolute top-2 left-8 right-8 text-center">
            <motion.div
              animate={{
                textShadow: isSpinning
                  ? ["0 0 5px #10b981", "0 0 20px #10b981", "0 0 5px #10b981"]
                  : "0 0 10px #10b981",
              }}
              transition={{ duration: 1, repeat: isSpinning ? Infinity : 0 }}
              className="text-emerald-400 font-bold text-lg tracking-widest"
              style={{
                fontFamily: "monospace",
                textShadow:
                  "0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981",
              }}
            >
              ★ SORTEO MACHINE ★
            </motion.div>
          </div>

          {/* Ventana de visualización estilo retro-futurista */}
          <div className="mt-12 bg-black rounded-2xl p-1 border-3 border-emerald-400/80 relative min-h-[400px] shadow-2xl shadow-emerald-500/30">
            {/* Efecto de pantalla CRT */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent opacity-50 pointer-events-none rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-30 pointer-events-none rounded-2xl"></div>

            {/* Líneas de escaneo */}
            {isSpinning && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-px bg-emerald-400/20"
                    style={{ top: `${i * 5}%` }}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                      scaleX: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-6 h-full flex flex-col justify-center relative">
              {/* Marco dorado interno con efectos */}
              <div className="absolute inset-3 border-2 border-yellow-400/40 rounded-xl pointer-events-none shadow-inner">
                <div className="absolute -top-px -left-px -right-px -bottom-px border border-yellow-300/20 rounded-xl"></div>
              </div>

              {/* Indicador central mejorado con animaciones */}
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-24 z-10 pointer-events-none">
                {/* Fondo del indicador */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent border-t-2 border-b-2 border-emerald-400/60 rounded-lg"></div>

                {/* Indicador central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{
                      scale: isSpinning ? [1, 1.2, 1] : 1,
                      rotate: isSpinning ? [0, 360] : 0,
                    }}
                    transition={{
                      scale: {
                        duration: 0.5,
                        repeat: isSpinning ? Infinity : 0,
                      },
                      rotate: {
                        duration: 2,
                        repeat: isSpinning ? Infinity : 0,
                        ease: "linear",
                      },
                    }}
                    className="relative"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-400/60">
                      <div className="absolute inset-1 bg-gradient-to-br from-white to-emerald-200 rounded-full"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full"></div>
                    </div>
                    {/* Puntos de mira */}
                    <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-px bg-emerald-400"></div>
                    <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-px bg-emerald-400"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 w-px h-8 bg-emerald-400"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 w-px h-8 bg-emerald-400"></div>
                  </motion.div>
                </div>
              </div>

              {/* Slots de participantes con animaciones mejoradas */}
              <div className="space-y-3 relative z-5">
                {remainingParticipants.length > 0 ? (
                  getSlotParticipants().map((slot, index) => {
                    const isEliminating =
                      eliminatingParticipant?.id === slot.participant.id;

                    return (
                      <motion.div
                        key={`${slot.participant.id}-${index}`}
                        className={`relative p-4 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                          slot.isCenter
                            ? "bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/50"
                            : "bg-gray-800/40 border border-gray-600/50 opacity-70"
                        } ${
                          isEliminating && isEliminationPhase
                            ? "ring-2 ring-red-500/60 bg-red-500/20"
                            : ""
                        }`}
                        animate={{
                          scale: slot.isCenter ? [1, 1.05, 1] : 1,
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
                          boxShadow: slot.isCenter
                            ? isSpinning
                              ? [
                                  "0 0 20px rgba(16, 185, 129, 0.5)",
                                  "0 0 40px rgba(16, 185, 129, 0.8)",
                                  "0 0 20px rgba(16, 185, 129, 0.5)",
                                ]
                              : "0 0 20px rgba(16, 185, 129, 0.5)"
                            : "none",
                        }}
                        transition={{
                          duration: 0.3,
                          x: { duration: 0.6, ease: "easeInOut" },
                          scale: {
                            duration: 0.8,
                            repeat: slot.isCenter && isSpinning ? Infinity : 0,
                          },
                          boxShadow: {
                            duration: 1,
                            repeat: slot.isCenter && isSpinning ? Infinity : 0,
                          },
                        }}
                      >
                        {/* Efecto de partículas para el slot central */}
                        {slot.isCenter && isSpinning && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                                animate={{
                                  x: [0, Math.random() * 40 - 20],
                                  y: [0, Math.random() * 40 - 20],
                                  opacity: [1, 0],
                                  scale: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                style={{
                                  left: "50%",
                                  top: "50%",
                                }}
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-4 relative z-10">
                          <div className="relative">
                            <motion.div
                              animate={{
                                rotate:
                                  slot.isCenter && isSpinning ? [0, 360] : 0,
                              }}
                              transition={{
                                duration: 2,
                                repeat:
                                  slot.isCenter && isSpinning ? Infinity : 0,
                                ease: "linear",
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 ${
                                slot.isCenter
                                  ? "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 shadow-emerald-500/60"
                                  : "bg-gradient-to-br from-gray-600 to-gray-700"
                              } ${
                                isEliminating && isEliminationPhase
                                  ? "bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/60"
                                  : ""
                              }`}
                            >
                              {slot.participant.fullName
                                .charAt(0)
                                .toUpperCase()}

                              {/* Anillo de energía para el slot central */}
                              {slot.isCenter && isSpinning && (
                                <div className="absolute -inset-2 border-2 border-emerald-400/60 rounded-full animate-ping"></div>
                              )}

                              {isEliminating && isEliminationPhase && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white"
                                >
                                  <span className="text-xs">❌</span>
                                </motion.div>
                              )}
                            </motion.div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <motion.p
                              animate={{
                                color: slot.isCenter
                                  ? isSpinning
                                    ? ["#6ee7b7", "#10b981", "#6ee7b7"]
                                    : "#6ee7b7"
                                  : "#d1d5db",
                              }}
                              transition={{
                                duration: 0.5,
                                repeat:
                                  slot.isCenter && isSpinning ? Infinity : 0,
                              }}
                              className={`font-bold truncate text-sm transition-all duration-300 ${
                                isEliminating && isEliminationPhase
                                  ? "text-red-300"
                                  : ""
                              }`}
                            >
                              {slot.participant.fullName}
                            </motion.p>
                            <p
                              className={`text-xs truncate transition-colors duration-300 ${
                                slot.isCenter
                                  ? "text-emerald-200"
                                  : "text-gray-400"
                              } ${
                                isEliminating && isEliminationPhase
                                  ? "text-red-200"
                                  : ""
                              }`}
                            >
                              {slot.participant.email}
                            </p>
                          </div>

                          {slot.isCenter && (
                            <motion.div
                              animate={{
                                scale: isSpinning ? [1, 1.1, 1] : 1,
                                rotate: isSpinning ? [0, 360] : 0,
                              }}
                              transition={{
                                scale: {
                                  duration: 0.5,
                                  repeat: isSpinning ? Infinity : 0,
                                },
                                rotate: {
                                  duration: 1.5,
                                  repeat: isSpinning ? Infinity : 0,
                                  ease: "linear",
                                },
                              }}
                              className="text-2xl"
                            >
                              🎯
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-16">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4 block"
                    >
                      🏆
                    </motion.span>
                    <p className="text-xl font-bold text-emerald-400">
                      ¡Listo para el sorteo final!
                    </p>
                  </div>
                )}
              </div>

              {/* Efectos de spinning */}
              {isSpinning && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent rounded-xl"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-emerald-400/30 rounded-xl"
                    animate={{
                      borderColor: [
                        "rgba(16, 185, 129, 0.3)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(16, 185, 129, 0.3)",
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </>
              )}

              {/* Overlay de emojis tristes */}
              <AnimatePresence>
                {showSadEmojis && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="flex space-x-6">
                      {[0, 1, 2].map((i) => (
                        <SadEmoji key={i} delay={i * 0.2} />
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Overlay de eliminación */}
              <EliminationOverlay
                isVisible={isEliminationPhase}
                eliminatingParticipant={eliminatingParticipant}
              />
            </div>
          </div>

          {/* Panel de estado inferior */}
          <div className="mt-6 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-xl p-4 border border-emerald-500/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    backgroundColor: isSpinning
                      ? ["#ef4444", "#f59e0b", "#ef4444"]
                      : "#10b981",
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isSpinning ? Infinity : 0,
                  }}
                  className="w-4 h-4 rounded-full shadow-lg"
                />
                <span className="text-emerald-400 text-sm font-mono font-bold tracking-wider">
                  {isSpinning
                    ? ">>> PROCESANDO SORTEO <<<"
                    : currentAttempt === 3
                    ? ">>> SORTEO FINAL ACTIVADO <<<"
                    : `>>> RONDA ${currentAttempt} DE ELIMINACIÓN <<<`}
                </span>
              </div>

              <div className="text-right">
                <p className="text-emerald-300 text-xs font-mono">
                  PARTICIPANTES
                </p>
                <p className="text-white font-bold text-lg">
                  {remainingParticipants.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
