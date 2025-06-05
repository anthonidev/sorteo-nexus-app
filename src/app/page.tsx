import ParticipantFormWrapper from "@/components/ParticipantFormWrapper";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-4 sm:py-8 px-4 relative overflow-hidden">
      {/* Efectos de fondo responsive */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-80 md:w-96 h-48 sm:h-80 md:h-96 bg-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-emerald-700/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2000ms" }}
        ></div>
      </div>

      <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto relative z-10">
        {/* Header con countdown responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-4 sm:mb-6 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <span className="text-2xl sm:text-2xl md:text-3xl">📱</span>
          </div>

          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent px-2">
            Sorteo iPhone 16 Pro
          </h1>

          {/* Countdown moderno responsive */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <p className="text-emerald-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              ✨ Sorteo este viernes
            </p>
            <p className="text-white text-xl sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
              6 de Junio, 2025
            </p>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <main className="bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden">
            {/* Gradiente superior */}
            <div className="h-1 sm:h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>

            <div className="p-4 sm:p-6 md:p-8">
              <ParticipantFormWrapper />
            </div>
          </main>
        </Suspense>

        {/* Footer moderno responsive */}
        <footer className="mt-6 sm:mt-8 text-center">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-500/20">
            <p className="text-emerald-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              🇵🇪 Válido solo para residentes de Perú
            </p>
            <p className="text-gray-400 text-xs">
              © 2025 Sorteo iPhone 16 Pro. Participación gratuita y sin
              compromisos.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
