"use client";

import React, { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { Button } from "./button";
import { ButtonHTMLAttributes } from "react";

interface CopyTextButtonProps extends ButtonHTMLAttributes<HTMLDivElement> {
  text?: string;
  className?: string;
  variant?: any;
  size?: any;
}
export function CopyTextButton({
  text,
  className,
  variant,
  size,
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  function handleClick() {
    navigator.clipboard.writeText(text as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant || "ghost"}
      className={`hover:bg-transparent hover:text-black ${className}`}
      size={size}
    >
      {copied ? (
        <CheckCheck className="h-4 w-4 bg-none" />
      ) : (
        <Copy className="h-4 w-4 bg-none" />
      )}
    </Button>
  );
}
