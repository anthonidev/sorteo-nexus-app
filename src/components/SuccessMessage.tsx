"use client";

import { ParticipantData } from "@/lib/schemas/participant";

interface SuccessMessageProps {
  data: ParticipantData;
  onNewParticipation: () => void;
}

export default function SuccessMessage({
  data,
  onNewParticipation,
}: SuccessMessageProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg
          className="w-10 h-10 text-white"
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

      <h1 className="text-2xl font-bold text-white mb-2">
        🎉 ¡Registro exitoso!
      </h1>

      <p className="text-green-400 text-lg font-medium mb-6">
        Ya estás participando en el sorteo
      </p>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-white mb-3 text-sm">
          📋 Datos registrados:
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Nombre:</span>
            <span className="text-white font-medium">{data.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Email:</span>
            <span className="text-white font-medium text-xs">{data.email}</span>
          </div>
          {data.phone && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Teléfono:</span>
              <span className="text-white font-medium">{data.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNewParticipation}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg shadow-green-500/25"
        >
          ➕ Registrar otra persona
        </button>
      </div>
    </div>
  );
}
