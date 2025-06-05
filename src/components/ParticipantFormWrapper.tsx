"use client";

import { useConfetti } from "@/hook/useConfetti";
import ParticipantForm from "./ParticipantForm";
import { ParticipantFormData } from "@/lib/schemas/participant";

export default function ParticipantFormWrapper() {
  const { fireSuccessConfetti } = useConfetti();

  const handleSuccess = (data: ParticipantFormData) => {
    console.log("Participante registrado:", data);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", {
        event_category: "sorteo",
        event_label: "participant_registered",
        value: 1,
      });
    }

    fireSuccessConfetti();

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleError = (error: string) => {
    console.error("Error al registrar:", error);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_error", {
        event_category: "sorteo",
        event_label: "registration_failed",
        description: error,
      });
    }

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  return <ParticipantForm onSuccess={handleSuccess} onError={handleError} />;
}
