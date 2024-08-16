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

  if (!mounted)
    return <div className="w-20 h-20 md:w-[400px] md:h-[54.031px]"></div>;
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
          src={theme ? (theme === "light" ? text1Dark : text1Light) : text1Dark}
          alt="not-a-good-idea"
          priority
        />
      </motion.div>
    </AnimatePresence>
  );
}
