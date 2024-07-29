"use client";

import Image from "next/image";
import array from "../../../public/black/arrays.svg";
import btree from "../../../public/black/binary-tree.svg";
import bfilter from "../../../public/black/bloom-filter.svg";
import heap from "../../../public/black/heap.svg";
import LL from "../../../public/black/linked-list.svg";
import LRU from "../../../public/black/lru-cache.svg";
import recursion from "../../../public/black/recursion.svg";
import stack from "../../../public/black/stack.svg";
import string from "../../../public/black/string.svg";
import tries from "../../../public/black/tries.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from "framer-motion";
import useMeasure from "react-use-measure";
import Link from "next/link";

export const images = [
  array,
  btree,
  bfilter,
  heap,
  LL,
  LRU,
  recursion,
  stack,
  string,
  tries,
];

const FAST_DURATION = 20;
const SLOW_DURATION = 60;

function ImageStrip({ direction, initialDuration }: any) {
  const [duration, setDuration] = useState(initialDuration);
  const [ref, { height }] = useMeasure();
  const yTranslation = useMotionValue(0);
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    const finalPos = -height / 3 - 6;

    if (mustFinish) {
      controls = animate(yTranslation, [yTranslation.get(), finalPos], {
        ease: "linear",
        duration: duration * (1 - yTranslation.get() / finalPos),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(yTranslation, [0, finalPos], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [yTranslation, height, duration, rerender]);

  return (
    <motion.div
      className="grid grid-cols-1 gap-y-4"
      ref={ref}
      style={{ y: yTranslation }}
      onHoverStart={() => {
        setMustFinish(true);
        setDuration(SLOW_DURATION);
      }}
      onHoverEnd={() => {
        setMustFinish(true);
        setDuration(FAST_DURATION);
      }}
    >
      {[...images, ...images, ...images].map((image, idx) => (
        <Card key={idx} image={image} />
      ))}
    </motion.div>
  );
}

export default function ImageContainer() {
  const strips = [
    { width: "20%", direction: "up", initialDuration: FAST_DURATION },
    { width: "20%", direction: "down", initialDuration: FAST_DURATION - 5 },
    { width: "20%", direction: "up", initialDuration: FAST_DURATION + 10 },
    { width: "20%", direction: "down", initialDuration: FAST_DURATION + 13 },
    { width: "20%", direction: "up", initialDuration: FAST_DURATION - 15 },
  ];

  return (
    <main className="flex border-2">
      {strips.map((strip, index) => (
        <div key={index}>
          <ImageStrip
            direction={strip.direction}
            initialDuration={strip.initialDuration}
          />
        </div>
      ))}
    </main>
  );
}

type CardPropsType = {
  image: string;
};

function Card({ image }: CardPropsType) {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  return (
    <motion.div
      onHoverStart={() => setShowOverlay(true)}
      onHoverEnd={() => setShowOverlay(false)}
      className="grid items-center justify-center"
    >
      <Link href="/">
        <Image
          src={image}
          alt={image}
          width={400}
          height={300}
          style={{
            height: "auto",
            width: "100%",
            fill: "white",
          }}
        />
      </Link>
    </motion.div>
  );
}
