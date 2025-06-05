"use client";

import { useConfetti } from "@/hook/useConfetti";
import { ParticipantData } from "@/lib/schemas/participant";
import { useEffect } from "react";

interface SuccessMessageProps {
  data: ParticipantData;
  onNewParticipation: () => void;
}

export default function SuccessMessage({
  data,
  onNewParticipation,
}: SuccessMessageProps) {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    const timer = setTimeout(() => {
      fireConfetti();
    }, 300);

    return () => clearTimeout(timer);
  }, [fireConfetti]);

  return (
    <div className="text-center relative w-full max-w-lg mx-auto px-4 sm:px-0">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-green-400/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="mx-auto mb-4 sm:mb-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-bounce relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse opacity-50"></div>
          <svg
            className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent animate-pulse px-2">
          🎉 ¡Registro exitoso!
        </h1>

        <p className="text-emerald-400 text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-6 md:mb-8 px-2">
          Ya estás participando en el sorteo
        </p>

        <div className="bg-gray-800/60 backdrop-blur-sm border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>

          <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg flex items-center justify-center">
            <span className="mr-2">📋</span>
            Datos registrados:
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-700/50 space-y-1 sm:space-y-0">
              <span className="text-gray-400 flex items-center text-sm sm:text-base">
                <span className="mr-2">👤</span>
                Nombre:
              </span>
              <span className="text-white font-medium text-sm sm:text-base break-words">
                {data.fullName}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-700/50 space-y-1 sm:space-y-0">
              <span className="text-gray-400 flex items-center text-sm sm:text-base">
                <span className="mr-2">📧</span>
                Email:
              </span>
              <span className="text-white font-medium text-xs sm:text-sm break-all">
                {data.email}
              </span>
            </div>

            {data.phone && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 space-y-1 sm:space-y-0">
                <span className="text-gray-400 flex items-center text-sm sm:text-base">
                  <span className="mr-2">📱</span>
                  Teléfono:
                </span>
                <span className="text-white font-medium text-sm sm:text-base">
                  {data.phone}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onNewParticipation}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 relative overflow-hidden group text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            <span className="mr-2">➕</span>
            Registrar otra persona
          </span>
        </button>

        <div className="mt-4 sm:mt-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
          <p className="text-emerald-400 text-xs sm:text-sm font-medium mb-1">
            ✨ ¡Comparte con tus amigos!
          </p>
          <p className="text-gray-400 text-xs">
            Mientras más participen, más emocionante será el sorteo
          </p>
        </div>
      </div>
    </div>
  );
}
