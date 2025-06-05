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
    <div className="text-center py-8">
      <div className="mx-auto mb-6 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        🎉 ¡Registro exitoso!
      </h1>

      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
        Ya estás participando en el sorteo del iPhone 16 Pro
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Datos registrados:
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Nombre:</span> {data.fullName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Email:</span> {data.email}
          </p>
          {data.phone && (
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Teléfono:</span> {data.phone}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">ID:</span> {data.id}
          </p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
          📧 ¿Qué sigue?
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Revisa tu email para confirmar tu participación. El sorteo se realiza
          cada viernes y te contactaremos si resultas ganador.
        </p>
      </div>

      {/* Botón para nueva participación */}
      <button
        onClick={onNewParticipation}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Registrar otra persona
      </button>

      {/* Compartir en redes */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          ¡Comparte el sorteo con tus amigos!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            📘 Facebook
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            📱 WhatsApp
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            🐦 Twitter
          </button>
        </div>
      </div>
    </div>
  );
}
