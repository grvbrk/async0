"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

export default function AnimatePanel({
  children,
  direction,
  activeTab,
}: {
  children: ReactNode;
  direction: "left" | "right";
  activeTab: string;
}) {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeTab}
          custom={direction}
          variants={{
            enter: (direction: string) => ({
              x: direction === "right" ? -400 : 400,
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (direction: string) => ({
              x: direction === "right" ? 400 : -400,
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: "tween",
              duration: 0.3,
              ease: "easeInOut",
            },
            opacity: { duration: 0.2 },
          }}
          className={height ? "absolute w-full" : "relative w-full"}
        >
          <div ref={ref}>{children}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (key.startsWith("_")) return;
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};
