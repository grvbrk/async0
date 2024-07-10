"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Plus, Minus } from "lucide-react";
import React, { Dispatch, ReactNode, SetStateAction } from "react";

export default function Counter({
  children,
  value,
  setValue,
  className,
}: {
  children: ReactNode;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  className?: string;
}) {
  function increaseCount() {
    setValue(value + 1);
  }

  function decreaseCount() {
    setValue(value - 1);
  }

  return (
    <div
      className={`${className} flex justify-between items-center ml-auto rounded-2xl px-3 w-[90px] `}
    >
      <Button
        size={"icon"}
        variant="secondary"
        className="h-[20px] w-[20px] rounded-full hover:bg-primary hover:text-white p-1"
        onClick={increaseCount}
        disabled={value >= 50}
      >
        <Plus />
      </Button>
      <div>{children}</div>
      <Button
        size={"icon"}
        variant="secondary"
        className="h-[20px] w-[20px] rounded-full hover:bg-primary hover:text-white p-1"
        onClick={decreaseCount}
        disabled={value <= 0}
      >
        <Minus />
      </Button>
    </div>
  );
}
