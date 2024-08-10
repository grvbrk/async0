"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Loader() {
  const { theme } = useTheme();
  useEffect(() => {
    async function getLoader() {
      const { trio } = await import("ldrs");
      trio.register();
    }
    getLoader();
  }, []);
  return <l-trio color={theme === "light" ? "black" : "white"}></l-trio>;
}
