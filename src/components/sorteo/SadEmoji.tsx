"use client";

import { motion } from "framer-motion";

interface SadEmojiProps {
  delay?: number;
}

export default function SadEmoji({ delay = 0 }: SadEmojiProps) {
  const emojis = ["😢", "😔", "😞", "💔", "😿"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, y: -20 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 500,
        damping: 25,
      }}
      className="inline-block text-lg"
    >
      {randomEmoji}
    </motion.span>
  );
}
