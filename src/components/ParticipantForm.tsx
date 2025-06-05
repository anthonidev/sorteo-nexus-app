// src/components/ParticipantForm.tsx
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Participa en un sorteo de
        </h1>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          iPhone 16 Pro
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Completa el formulario y participa en nuestro sorteo
        </p>
      </div>

      {submitMessage && (
        <div
          className={cn(
            "p-4 rounded-lg mb-6 text-sm font-medium",
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          )}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nombre Completo *
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className={cn(
              "w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
              errors.fullName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="Tu nombre completo"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={cn(
              "w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="958920823"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200",
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600",
            "shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Registrando...
            </div>
          ) : (
            "🎉 Participar en el sorteo"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>* Campos obligatorios</p>
        <p className="mt-1">
          Al participar aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
