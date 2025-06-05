"use client";

import { useState, useEffect } from "react";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square";
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
}

export default function Confetti({
  trigger,
  duration = 3000,
  particleCount = 100,
}: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = [
      "#10b981", // emerald-500
      "#059669", // emerald-600
      "#047857", // emerald-700
      "#065f46", // emerald-800
      "#34d399", // emerald-400
      "#6ee7b7", // emerald-300
      "#a7f3d0", // emerald-200
      "#ffffff", // white
    ];

    const newParticles: ConfettiParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 1000),
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        shape: Math.random() > 0.5 ? "circle" : "square",
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration, particleCount]);

  useEffect(() => {
    if (particles.length === 0) return;

    let animationFrame: number;

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.speedX,
            y: particle.y + particle.speedY,
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter(
            (particle) =>
              particle.y <
              (typeof window !== "undefined" ? window.innerHeight : 1000) + 10
          )
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [particles.length]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-all duration-100"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: particle.shape === "circle" ? "50%" : "0",
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}40`,
          }}
        />
      ))}
    </div>
  );
}
