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
    console.log("Ganador del sorteo:", winnerData);
  };

  return (
    <>
      <div className="space-y-6 h-full flex flex-col overflow-hidden">
        {/* Header con estadísticas */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm flex-shrink-0">
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
          <div className="relative flex-shrink-0">
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

        {/* Lista de participantes con scroll interno */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {participants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-600">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay participantes registrados
              </h3>
              <p className="text-gray-400">
                Los participantes aparecerán aquí una vez que se registren para
                el sorteo.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Información de resultados filtrados */}
              {searchTerm && (
                <div className="text-sm text-gray-400 mb-4 flex-shrink-0">
                  Mostrando {filteredParticipants.length} de {total}{" "}
                  participantes
                  {filteredParticipants.length === 0 && (
                    <span className="ml-2 text-yellow-400">
                      - No se encontraron coincidencias
                    </span>
                  )}
                </div>
              )}

              {/* Grid de participantes con scroll */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden scroll-container"
                style={{ height: "calc(100% - 2rem)" }}
              >
                <div className="space-y-3 pr-2">
                  <AnimatePresence mode="popLayout">
                    {(searchTerm ? filteredParticipants : participants).map(
                      (participant, index) => (
                        <motion.div
                          key={participant.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 group card-hover"
                        >
                          <div className="flex items-center justify-between">
                            {/* Avatar y información principal */}
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-emerald-500/30 transition-shadow flex-shrink-0">
                                {participant.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors truncate">
                                  {participant.fullName}
                                </h3>
                                <p className="text-gray-400 text-xs truncate">
                                  {participant.email}
                                </p>
                              </div>
                            </div>

                            {/* Información secundaria */}
                            <div className="text-right space-y-1 flex-shrink-0 ml-4">
                              <div className="flex items-center justify-end text-gray-400 text-xs">
                                <span className="mr-1">📱</span>
                                <span className="truncate max-w-[100px]">
                                  {formatPhone(participant.phone)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end text-gray-500 text-xs">
                                <span className="mr-1">⏰</span>
                                <span>{formatDate(participant.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                  {/* Espaciado inferior para evitar que el último elemento quede pegado */}
                  <div className="h-4"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mostrar si hay ganador anterior */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm flex-shrink-0"
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

      {/* Máquina de sorteo - Portal para que aparezca en el centro de la pantalla */}
      {showSorteo && (
        <SorteoMachine
          participants={participants}
          isVisible={showSorteo}
          onClose={() => setShowSorteo(false)}
          onWinner={handleWinner}
        />
      )}
    </>
  );
}
