"use client";

import ParticipantForm from "./ParticipantForm";

export default function ParticipantFormWrapper() {
  const handleSuccess = (data: any) => {
    console.log("Participante registrado:", data);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", {
        event_category: "sorteo",
        event_label: "participant_registered",
        value: 1,
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
  };

  return <ParticipantForm onSuccess={handleSuccess} onError={handleError} />;
}
