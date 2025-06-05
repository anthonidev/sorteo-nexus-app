export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-green-500/20 rounded-full animate-spin border-t-green-500 mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-emerald-400/60 mx-auto"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">📱</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Cargando sorteo...
          </h2>
          <p className="text-green-400 animate-pulse">
            Preparando tu participación
          </p>
        </div>

        <div className="flex justify-center mt-6 space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-xs mx-auto">
          <p className="text-green-400 text-xs">
            iPhone 16 Pro • Viernes 6 de Junio
          </p>
        </div>
      </div>
    </div>
  );
}
