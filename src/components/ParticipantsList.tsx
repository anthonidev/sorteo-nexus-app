"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticipantListItem } from "@/lib/schemas/participants";
import SorteoMachine from "./SorteoMachine";

interface ParticipantsListProps {
  participants: ParticipantListItem[];
  total: number;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function ParticipantsList({
  participants,
  total,
  onRefresh,
  isLoading = false,
}: ParticipantsListProps) {
  const [showSorteo, setShowSorteo] = useState(false);
  const [winner, setWinner] = useState<ParticipantListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return "No proporcionado";
    // Formatear número peruano
    if (phone.startsWith("+51")) {
      return phone
        .replace(/^\+51\s?/, "+51 ")
        .replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    return phone;
  };

  const handleWinner = (winnerData: ParticipantListItem) => {
    setWinner(winnerData);
    // Aquí podrías enviar el resultado a un backend o guardarlo localmente
    console.log("Ganador del sorteo:", winnerData);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">👥</span>
                Participantes Registrados
              </h2>
              <p className="text-emerald-400 font-medium">
                Total de participantes:{" "}
                <span className="text-white">{total}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔄</span>
                    Actualizar
                  </>
                )}
              </button>

              <button
                onClick={() => setShowSorteo(true)}
                disabled={participants.length === 0 || isLoading}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <span className="mr-2">🎰</span>
                Realizar Sorteo
              </button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        {participants.length > 0 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/60 border border-emerald-500/40 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        )}

        {/* Lista de participantes */}
        {participants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-600">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay participantes registrados
            </h3>
            <p className="text-gray-400">
              Los participantes aparecerán aquí una vez que se registren para el
              sorteo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Información de resultados filtrados */}
            {searchTerm && (
              <div className="text-sm text-gray-400 mb-4">
                Mostrando {filteredParticipants.length} de {total} participantes
                {filteredParticipants.length === 0 && (
                  <span className="ml-2 text-yellow-400">
                    - No se encontraron coincidencias
                  </span>
                )}
              </div>
            )}

            {/* Grid de participantes */}
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {(searchTerm ? filteredParticipants : participants).map(
                  (participant, index) => (
                    <motion.div
                      key={participant.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Avatar y nombre */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
                            {participant.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg group-hover:text-emerald-400 transition-colors">
                              {participant.fullName}
                            </h3>
                            <p className="text-gray-400 text-sm break-all">
                              {participant.email}
                            </p>
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="sm:text-right space-y-1">
                          <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1">
                            <div className="flex items-center text-gray-400 text-sm">
                              <span className="mr-1">📱</span>
                              <span>{formatPhone(participant.phone)}</span>
                            </div>
                            <div className="flex items-center text-gray-400 text-xs">
                              <span className="mr-1">⏰</span>
                              <span>{formatDate(participant.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ID para referencia (solo visible en hover) */}
                      <div className="mt-3 pt-3 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-gray-500 font-mono">
                          ID: {participant.id}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mostrar si hay ganador anterior */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">🏆</span>
              Último Ganador
            </h3>
            <div className="bg-yellow-500/20 border border-yellow-400 rounded-xl p-4">
              <p className="text-xl font-bold text-yellow-400 mb-1">
                {winner.fullName}
              </p>
              <p className="text-yellow-300 text-sm">{winner.email}</p>
              {winner.phone && (
                <p className="text-yellow-300 text-sm">
                  {formatPhone(winner.phone)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Máquina de sorteo */}
      <SorteoMachine
        participants={participants}
        isVisible={showSorteo}
        onClose={() => setShowSorteo(false)}
        onWinner={handleWinner}
      />
    </>
  );
}
