"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hook/useAdminAuth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/sorteo-iphone";

  const { isLoading, error, login, clearError } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!password.trim()) {
      return;
    }

    await login({ password }, redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
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

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden">
          {/* Header con gradiente */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>

          <div className="p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-4 shadow-lg shadow-emerald-500/30">
                <span className="text-2xl">🔐</span>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Panel de Administración
              </h1>

              <p className="text-gray-400 text-sm">
                Ingresa la contraseña para acceder al panel del sorteo
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  🔑 Contraseña de Administrador
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 bg-gray-800/60 border border-emerald-500/40 rounded-xl backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent hover:bg-gray-800/80 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </motion.div>
              )}

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-green-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 animate-pulse"></div>
                )}
                <div className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-3">🚪</span>
                      <span>Acceder al Panel</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 text-center">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-emerald-400 text-xs font-medium mb-1">
                  🔒 Acceso restringido
                </p>
                <p className="text-gray-400 text-xs">
                  Solo personal autorizado puede acceder a esta sección
                </p>
              </div>
            </div>

            {/* Link para volver al inicio */}
            <div className="mt-6 text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <span className="mr-2">←</span>
                Volver al sorteo público
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
            <p className="text-gray-400 text-xs">
              © 2025 Nexus H. Global. Panel administrativo del sorteo.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
