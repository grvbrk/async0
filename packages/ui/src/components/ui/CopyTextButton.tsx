"use client";

import React, { useState } from "react";

import { Copy, CheckCheck } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export default function CopyTextButton({ text, ...props }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  function handleClick() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div {...props}>
      <Button
        onClick={handleClick}
        variant="ghost"
        className="hover:bg-transparent hover:text-white"
      >
        {copied ? (
          <CheckCheck className="h-4 w-4 bg-none" />
        ) : (
          <Copy className="h-4 w-4 bg-none" />
        )}
      </Button>
    </div>
  );
}
