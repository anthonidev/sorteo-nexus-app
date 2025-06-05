import { ParticipantListItem } from "@/lib/schemas/participants";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface SorteoLeverControlProps {
  isSpinning: boolean;
  showResult: boolean;
  currentAttempt: number;
  remainingParticipants: ParticipantListItem[];
  onStartSorteo: () => void;
  onClose: () => void;
}

export default function SorteoLeverControl({
  isSpinning,
  showResult,
  currentAttempt,
  remainingParticipants,
  onStartSorteo,
  onClose,
}: SorteoLeverControlProps) {
  const [isPulled, setIsPulled] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const leverRef = useRef<HTMLDivElement>(null);

  // Ajustar los valores para que la palanca se mueva menos y no salga del área
  const y = useMotionValue(0);
  const leverRotation = useTransform(y, [0, 30], [0, 8]); // Reducir rotación
  const glowIntensity = useTransform(y, [0, 30], [0.3, 1]); // Ajustar rango

  const canStartSorteo =
    !isSpinning && remainingParticipants.length > 0 && !showResult;

  const handleLeverPull = () => {
    if (!canStartSorteo) return;

    setIsPulled(true);
    setIsCharging(true);

    // Reducir el movimiento para que se mantenga en el área visible
    y.set(30);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      onStartSorteo();
      setIsCharging(false);

      setTimeout(() => {
        y.set(0);
        setIsPulled(false);
      }, 500);
    }, 800);
  };

  const getLeverText = () => {
    if (isSpinning) return "PROCESANDO...";
    if (showResult) return "FINALIZADO";
    if (isCharging) return "CARGANDO...";
    return "¡TIRAR PALANCA!";
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="relative bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-emerald-500/40 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 rounded-2xl"></div>

        {/* Contenedor de la máquina con altura ajustada */}
        <div className="relative mx-auto w-48 h-40 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 shadow-inner overflow-hidden">
          {/* LEDs indicadores */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <motion.div
              animate={{
                backgroundColor: canStartSorteo ? "#10b981" : "#6b7280",
                boxShadow: canStartSorteo ? "0 0 10px #10b981" : "none",
              }}
              className="w-3 h-3 rounded-full"
            />
            <motion.div
              animate={{
                backgroundColor: isCharging ? "#f59e0b" : "#6b7280",
                boxShadow: isCharging ? "0 0 10px #f59e0b" : "none",
              }}
              className="w-3 h-3 rounded-full"
            />
            <motion.div
              animate={{
                backgroundColor: isSpinning ? "#ef4444" : "#6b7280",
                boxShadow: isSpinning ? "0 0 10px #ef4444" : "none",
              }}
              className="w-3 h-3 rounded-full"
            />
          </div>

          {/* Slot de la palanca - ajustado para ser más pequeño */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-16 bg-black rounded-lg border border-gray-500 shadow-inner"></div>

          {/* Palanca - con mejor posicionamiento */}
          <motion.div
            ref={leverRef}
            style={{
              y,
              rotate: leverRotation,
              transformOrigin: "50% 80%", // Cambiar el punto de rotación
            }}
            className="absolute top-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
            onClick={handleLeverPull}
            whileHover={canStartSorteo ? { scale: 1.05 } : {}}
            whileTap={canStartSorteo ? { scale: 0.95 } : {}}
          >
            <div className="relative">
              {/* Varilla de la palanca - más corta */}
              <motion.div
                animate={{
                  backgroundColor:
                    isCharging || isSpinning
                      ? "#f59e0b"
                      : canStartSorteo
                      ? "#10b981"
                      : "#6b7280",
                }}
                className="w-2 h-16 bg-emerald-500 rounded-full shadow-lg mx-auto"
              />

              {/* Empuñadura - reposicionada */}
              <motion.div
                style={{
                  boxShadow: useTransform(
                    glowIntensity,
                    [0, 1],
                    [
                      "0 0 5px rgba(16, 185, 129, 0.3)",
                      "0 0 30px rgba(16, 185, 129, 0.8)",
                    ]
                  ),
                }}
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-2 border-red-400 shadow-lg"
              >
                <div className="absolute inset-1 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-red-200 rounded-full"></div>
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-px bg-red-200"></div>
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-px bg-red-200"></div>
              </motion.div>

              {/* Efectos de partículas */}
              {(isCharging || isSpinning) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                      animate={{
                        x: [0, Math.cos((i * 60 * Math.PI) / 180) * 15],
                        y: [0, Math.sin((i * 60 * Math.PI) / 180) * 15],
                        opacity: [1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Panel de estado inferior */}
          <div className="absolute bottom-2 left-2 right-2 bg-black rounded-lg p-2 border border-emerald-500/50">
            <motion.div
              animate={{
                color: isSpinning
                  ? "#f59e0b"
                  : isCharging
                  ? "#ef4444"
                  : canStartSorteo
                  ? "#10b981"
                  : "#6b7280",
              }}
              className="text-center font-mono text-xs font-bold tracking-wider"
            >
              {getLeverText()}
            </motion.div>

            {/* Barra de progreso */}
            {isCharging && (
              <motion.div
                className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            )}
          </div>

          {/* Efectos de energía */}
          {(isCharging || isSpinning) && (
            <>
              <motion.div
                className="absolute inset-0 border-2 border-emerald-400/60 rounded-xl"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-green-500/10 rounded-xl"></div>
            </>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center text-gray-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              disabled={isSpinning}
              className="flex-1 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed border border-red-500/50 hover:border-red-400 disabled:border-gray-600 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🚪</span>
                {isSpinning
                  ? "Sorteando..."
                  : showResult
                  ? "Finalizar"
                  : "Cerrar"}
              </span>
            </button>

            {!isSpinning && !showResult && remainingParticipants.length > 0 && (
              <button
                onClick={handleLeverPull}
                className="flex-1 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/40 hover:to-green-600/40 text-emerald-400 hover:text-emerald-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🔧</span>
                  Usar botón
                </span>
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              {canStartSorteo
                ? "💡 Tira la palanca roja para iniciar el sorteo"
                : isSpinning
                ? "⏳ El sorteo está en progreso..."
                : showResult
                ? "🎉 ¡Sorteo completado exitosamente!"
                : "⚠️ No se puede iniciar el sorteo en este momento"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel de control */}
    </div>
  );
}
