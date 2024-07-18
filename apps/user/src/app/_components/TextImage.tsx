"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import text1Dark from "../../../public/text1-dark.svg";
import text1Light from "../../../public/text1-light.svg";
import { useTheme } from "next-themes";

export default function TextImage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Image
      src={theme === "light" ? text1Dark : text1Light}
      alt="not-a-good-idea"
      width="400"
      priority
    />
  );
}
