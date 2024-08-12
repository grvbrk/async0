"use client";

import { Suspense } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Suspense
      fallback={
        isDesktop ? <h1>Loading Desktop...</h1> : <h1>Loading Mobile...</h1>
      }
    >
      {children}
    </Suspense>
  );
}
