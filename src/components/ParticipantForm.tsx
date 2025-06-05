"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  participantSchema,
  type ParticipantFormData,
  type ParticipantData,
} from "@/lib/schemas/participant";
import { createParticipant } from "@/lib/actions/participant";
import { cn } from "@/lib/utils";
import SuccessMessage from "./SuccessMessage";

interface ParticipantFormProps {
  onSuccess?: (data: ParticipantData) => void;
  onError?: (error: string) => void;
}

export default function ParticipantForm({
  onSuccess,
  onError,
}: ParticipantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [successData, setSuccessData] = useState<ParticipantData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ParticipantFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await createParticipant(data);

      if (result.success) {
        if (result.data) {
          setSuccessData(result.data);
          setSubmitMessage({
            type: "success",
            text:
              result.message ||
              "¡Registro exitoso! Ya estás participando en el sorteo.",
          });
          reset();
          onSuccess?.(result.data);
        } else {
          setSubmitMessage({
            type: "error",
            text: "Error al registrar. Por favor intenta nuevamente.",
          });
          onError?.("Error al registrar. Por favor intenta nuevamente.");
        }
      } else {
        setSubmitMessage({
          type: "error",
          text:
            result.message ||
            "Error al registrar. Por favor intenta nuevamente.",
        });
        onError?.(result.message);
      }
    } catch (error) {
      console.error("Error al crear participante:", error);
      const errorMessage =
        "Ocurrió un error inesperado. Por favor intenta nuevamente.";
      setSubmitMessage({
        type: "error",
        text: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewParticipation = () => {
    setSuccessData(null);
    setSubmitMessage(null);
    reset();
  };

  if (successData) {
    return (
      <SuccessMessage
        data={successData}
        onNewParticipation={handleNewParticipation}
      />
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
      {/* Header del formulario responsive */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-emerald-500/40 mb-3 sm:mb-4">
          <span className="text-emerald-400 text-xs sm:text-sm font-medium">
            ✨ Participación gratuita
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 px-2">
          Regístrate para participar
        </h2>
        <p className="text-gray-400 text-sm sm:text-base px-2">
          Completa tus datos y participa en el sorteo del iPhone 16 Pro
        </p>
      </div>

      {/* Mensaje de estado responsive */}
      {submitMessage && (
        <div
          className={cn(
            "p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-xs sm:text-sm font-medium border backdrop-blur-sm",
            submitMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          )}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {submitMessage.type === "success" ? "✅" : "⚠️"}
            </span>
            <span className="break-words">{submitMessage.text}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Email responsive */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3"
          >
            📧 Dirección de Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800/60 border rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              "hover:bg-gray-800/80 text-sm sm:text-base",
              errors.email
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-emerald-500/40 focus:ring-emerald-500/50 hover:border-emerald-500/60"
            )}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-2 text-xs sm:text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              <span className="break-words">{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Nombre responsive */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3"
          >
            👤 Nombre Completo *
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className={cn(
              "w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800/60 border rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              "hover:bg-gray-800/80 text-sm sm:text-base",
              errors.fullName
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-emerald-500/40 focus:ring-emerald-500/50 hover:border-emerald-500/60"
            )}
            placeholder="Tu nombre completo"
          />
          {errors.fullName && (
            <p className="mt-2 text-xs sm:text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              <span className="break-words">{errors.fullName.message}</span>
            </p>
          )}
        </div>

        {/* Teléfono responsive */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3"
          >
            📱 Teléfono <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={cn(
              "w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800/60 border rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              "hover:bg-gray-800/80 text-sm sm:text-base",
              errors.phone
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-emerald-500/40 focus:ring-emerald-500/50 hover:border-emerald-500/60"
            )}
            placeholder="958920823"
          />
          {errors.phone && (
            <p className="mt-2 text-xs sm:text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              <span className="break-words">{errors.phone.message}</span>
            </p>
          )}
        </div>

        {/* Botón de envío responsive */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white transition-all duration-300",
            "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-gray-900",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-green-600",
            "shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "relative overflow-hidden text-sm sm:text-base md:text-lg"
          )}
        >
          {isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 animate-pulse"></div>
          )}
          <div className="relative z-10">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-3 border-white/30 border-t-white mr-2 sm:mr-3"></div>
                <span className="text-xs sm:text-sm md:text-base">
                  Registrando tu participación...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2 sm:mr-3">🎉</span>
                <span>Participar en el sorteo</span>
                <span className="ml-2 sm:ml-3">→</span>
              </div>
            )}
          </div>
        </button>
      </form>

      {/* Información adicional responsive */}
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
          <p className="text-emerald-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex items-center">
            <span className="mr-2">🔒</span>
            Tus datos están seguros
          </p>
          <p className="text-xs text-gray-400">
            * Campos obligatorios • Al participar aceptas los términos y
            condiciones
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
          <div className="bg-gray-800/40 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-700/50 backdrop-blur-sm">
            <p className="text-emerald-400 text-xs sm:text-sm font-medium">
              📱 Premio
            </p>
            <p className="text-white text-xs">iPhone 16 Pro</p>
          </div>
          <div className="bg-gray-800/40 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-700/50 backdrop-blur-sm">
            <p className="text-emerald-400 text-xs sm:text-sm font-medium">
              🗓️ Fecha del sorteo
            </p>
            <p className="text-white text-xs"> 6 de Junio, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
