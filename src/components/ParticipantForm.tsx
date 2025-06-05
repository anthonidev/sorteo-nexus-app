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
  onSuccess?: (data: any) => void;
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
        setSuccessData(result.data!);
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
          text:
            result.message ||
            "Error al registrar. Por favor intenta nuevamente.",
        });
        onError?.(result.message);
      }
    } catch (error) {
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
    <div className="w-full">
      {/* Header del formulario */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full px-4 py-2 border border-green-500/30 mb-3">
          <span className="text-green-400 text-sm font-medium">
            ✨ Participa gratis
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Regístrate para participar
        </h2>
        <p className="text-gray-400 text-sm">
          Completa tus datos y participa en el sorteo
        </p>
      </div>

      {submitMessage && (
        <div
          className={cn(
            "p-3 rounded-lg mb-4 text-sm font-medium border",
            submitMessage.type === "success"
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          )}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            📧 Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "w-full px-4 py-3 bg-gray-900/50 border rounded-xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              errors.email
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-green-500/30 focus:ring-green-500/50 hover:border-green-500/50"
            )}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            👤 Nombre Completo *
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className={cn(
              "w-full px-4 py-3 bg-gray-900/50 border rounded-xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              errors.fullName
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-green-500/30 focus:ring-green-500/50 hover:border-green-500/50"
            )}
            placeholder="Tu nombre completo"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            📱 Teléfono <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={cn(
              "w-full px-4 py-3 bg-gray-900/50 border rounded-xl backdrop-blur-sm transition-all duration-200",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent",
              errors.phone
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-green-500/30 focus:ring-green-500/50 hover:border-green-500/50"
            )}
            placeholder="958920823"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300",
            "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
            "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-800",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600",
            "shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:shadow-xl",
            "transform hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
              Registrando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">🎉</span>
              Participar en el sorteo
            </div>
          )}
        </button>
      </form>

      {/* Nota legal */}
      <div className="mt-6 text-center">
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
          <p className="text-xs text-green-400 mb-1">
            🔒 Tus datos están seguros
          </p>
          <p className="text-xs text-gray-400">
            * Campos obligatorios • Al participar aceptas los términos
          </p>
        </div>
      </div>
    </div>
  );
}
