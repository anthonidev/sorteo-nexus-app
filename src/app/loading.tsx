export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      <div className="text-center relative z-10">
        {/* Spinner principal */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500 mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-emerald-400/60 mx-auto"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-2 border-transparent rounded-full animate-pulse border-t-green-400/40 mx-auto"
            style={{ animationDelay: "500ms" }}
          ></div>

          {/* Icono central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">📱</span>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Cargando sorteo...
          </h2>
          <p className="text-emerald-400 animate-pulse font-medium">
            Preparando tu participación
          </p>
        </div>

        {/* Puntos de carga animados */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Información del sorteo */}
        <div className="mt-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 max-w-xs mx-auto backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-emerald-400 text-sm font-medium">
              📱 iPhone 16 Pro (128GB)
            </p>
            <p className="text-gray-400 text-xs">🗓️ Viernes 6 de Junio, 2025</p>
            <p className="text-gray-400 text-xs">
              🇵🇪 Solo para residentes de Perú
            </p>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="mt-6">
          <p className="text-gray-400 text-xs animate-pulse">
            ✨ Participación 100% gratuita
          </p>
        </div>
      </div>
    </div>
  );
}
