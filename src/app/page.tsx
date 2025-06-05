import ParticipantFormWrapper from "@/components/ParticipantFormWrapper";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header con countdown */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 shadow-xl">
            <span className="text-2xl">📱</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Sorteo iPhone 16 Pro
          </h1>

          {/* Countdown compacto */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-green-500/20">
            <p className="text-green-400 text-sm font-medium mb-1">
              Sorteo este viernes
            </p>
            <p className="text-white text-lg font-bold">6 de Junio, 2025</p>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <main className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-green-500/20 shadow-2xl overflow-hidden">
            {/* Gradiente superior */}
            <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>

            <div className="p-6">
              <ParticipantFormWrapper />
            </div>
          </main>
        </Suspense>

        {/* Footer compacto */}
        <footer className="mt-8 text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-green-500/10">
            <p className="text-green-400 text-xs font-medium mb-1">
              🇵🇪 Válido solo para residentes de Perú
            </p>
            <p className="text-gray-400 text-xs">
              © 2025 Sorteo iPhone 16 Pro. Sin compromisos.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
