"use client";

import { useConfetti } from "@/hook/useConfetti";
import ParticipantForm from "./ParticipantForm";

export default function ParticipantFormWrapper() {
  const { fireSuccessConfetti } = useConfetti();

  const handleSuccess = (data: any) => {
    console.log("Participante registrado:", data);

    // Google Analytics tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", {
        event_category: "sorteo",
        event_label: "participant_registered",
        value: 1,
      });
    }

    // Confeti inmediato al enviar el formulario (antes del mensaje de éxito)
    fireSuccessConfetti();

    // Efecto de vibración en dispositivos móviles (si está disponible)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Scroll suave hacia arriba para mejor UX
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleError = (error: string) => {
    console.error("Error al registrar:", error);

    // Google Analytics error tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_error", {
        event_category: "sorteo",
        event_label: "registration_failed",
        description: error,
      });
    }

    // Efecto de vibración de error en dispositivos móviles
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  return <ParticipantForm onSuccess={handleSuccess} onError={handleError} />;
}
