"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import JobStressWhite from "../../../public/JobStressWhite.png";
import JobStressBlack from "../../../public/JobStressBlack.png";

export default function HeroImage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="hidden md:block absolute bottom-0 right-0">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 1,
            ease: [0.6, -0.05, 0.01, 0.99],
            scale: {
              type: "spring",
              damping: 20,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
        >
          <Image
            src={theme === "light" ? JobStressBlack : JobStressWhite}
            alt="stress"
            className="h-auto w-[1000px]"
            priority
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
