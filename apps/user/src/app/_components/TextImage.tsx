"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import text1Dark from "../../../public/text1-dark.svg";
import text1Light from "../../../public/text1-light.svg";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

export default function TextImage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{
          duration: 0.8,
          ease: [0.6, -0.05, 0.01, 0.99],
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
      >
        <Image
          src={theme === "light" ? text1Dark : text1Light}
          alt="not-a-good-idea"
          width="400"
          priority
        />
      </motion.div>
    </AnimatePresence>
  );
}
