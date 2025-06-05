import ParticipantFormWrapper from "@/components/ParticipantFormWrapper";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<Loading />}>
          <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
            <ParticipantFormWrapper />
          </main>
        </Suspense>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🎁 Detalles del sorteo
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>📱 Premio: iPhone 16 Pro (128GB)</p>
              <p>📅 Sorteo: Cada viernes del mes</p>
              <p>🎯 Ganadores: Se contactan por email</p>
              <p>✨ ¡Participa gratis y sin compromisos!</p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 Sorteo iPhone 16 Pro. Todos los derechos reservados.</p>
          <p className="mt-1">Sorteo válido solo para residentes de Perú.</p>
        </footer>
      </div>
    </div>
  );
}
