// src/app/sorteo-iphone/ParticipantsContainer.tsx
"use client";

import { useState } from "react";
import { ParticipantListItem } from "@/lib/schemas/participants";
import { getParticipants } from "@/lib/actions/participants";
import ParticipantsList from "@/components/ParticipantsList";

interface ParticipantsContainerProps {
  initialData: {
    participants: ParticipantListItem[];
    total: number;
    message: string;
  };
}

export default function ParticipantsContainer({
  initialData,
}: ParticipantsContainerProps) {
  const [participantsData, setParticipantsData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getParticipants();

      if (result.success) {
        setParticipantsData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error refreshing participants:", err);
      setError("Error al actualizar la lista de participantes");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-red-400 mb-2">
          Error al cargar participantes
        </h2>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {isLoading ? "Cargando..." : "🔄 Reintentar"}
        </button>
      </div>
    );
  }

  return (
    <ParticipantsList
      participants={participantsData.participants}
      total={participantsData.total}
      onRefresh={handleRefresh}
      isLoading={isLoading}
    />
  );
}
