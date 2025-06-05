// src/app/sorteo-iphone/page.tsx
import { Suspense } from "react";
import { getParticipants } from "@/lib/actions/participants";
import ParticipantsContainer from "./ParticipantsContainer";
import Link from "next/link";

// Forzar renderizado dinámico para esta página
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sorteo iPhone 16 Pro - Lista de Participantes | Nexus H. Global",
  description:
    "Administra el sorteo del iPhone 16 Pro. Ve todos los participantes y realiza el sorteo oficial.",
};

// Componente para el botón de recargar (Client Component)
function ReloadButton() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReload}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
    >
      🔄 Reintentar
    </button>
  );
}

async function ParticipantsData() {
  const participantsData = await getParticipants();

  if (!participantsData.success) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Error al cargar participantes
          </h2>
          <p className="text-red-300 mb-6">{participantsData.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ReloadButton />
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-center"
            >
              🏠 Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ParticipantsContainer initialData={participantsData.data} />;
}

function LoadingSkeleton() {
  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gray-800/60 rounded-2xl p-6 animate-pulse flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-700 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-700 rounded-lg w-32"></div>
          </div>
        </div>
      </div>

      {/* Search skeleton */}
      <div className="h-12 bg-gray-800/60 rounded-xl animate-pulse flex-shrink-0"></div>

      {/* Participants skeleton con scroll */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-3 pr-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800/60 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-48"></div>
                  <div className="h-3 bg-gray-700 rounded w-64"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SorteoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2000ms" }}
        ></div>
      </div>

      {/* Layout principal con altura fija */}
      <div className="h-screen flex flex-col relative z-10">
        {/* Header fijo */}
        <div className="flex-shrink-0 px-4 pt-8 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-4 shadow-2xl shadow-emerald-500/30 animate-pulse">
                <span className="text-3xl">🎰</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Administración del Sorteo
              </h1>

              <p className="text-gray-400 text-lg mb-4">
                Gestiona los participantes y realiza el sorteo oficial del
                iPhone 16 Pro
              </p>

              {/* Navegación */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="bg-gray-800/60 hover:bg-gray-800 border border-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                >
                  <span className="mr-2">🏠</span>
                  Página Principal
                </Link>
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-medium py-2 px-4 rounded-xl backdrop-blur-sm flex items-center justify-center">
                  <span className="mr-2">🎯</span>
                  Panel de Sorteo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal con scroll */}
        <div className="flex-1 min-h-0 px-4">
          <div className="max-w-6xl mx-auto h-full">
            <main className="bg-gray-900/80 backdrop-blur-xl rounded-t-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden h-full flex flex-col">
              {/* Gradiente superior */}
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 flex-shrink-0"></div>

              {/* Contenido con scroll interno */}
              <div className="flex-1 min-h-0 p-6 sm:p-8">
                <Suspense fallback={<LoadingSkeleton />}>
                  <ParticipantsData />
                </Suspense>
              </div>
            </main>
          </div>
        </div>

        {/* Footer fijo */}
        <div className="flex-shrink-0 px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <footer className="text-center">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/20">
                <p className="text-emerald-400 text-sm font-medium mb-1">
                  🔐 Panel administrativo del sorteo
                </p>
                <p className="text-gray-400 text-xs">
                  © 2025 Nexus H. Global. Sistema de gestión de sorteos.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
