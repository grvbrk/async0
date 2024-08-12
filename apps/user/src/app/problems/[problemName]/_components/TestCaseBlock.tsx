"use client";

import React, { ReactNode } from "react";
import { Card } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Testcase } from "@repo/db";
import { Check, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { judge0ValueKeyType, unescapeCode } from "@repo/common";

export default function TestCaseBlock({
  testcase,
  index,
  problemSubmitStatus,
  isPending,
}: {
  testcase: Testcase;
  index: number;
  problemSubmitStatus: judge0ValueKeyType;
  isPending: boolean;
}) {
  return (
    <Card
      className={`${
        problemSubmitStatus
          ? problemSubmitStatus.status.id === 3
            ? " border-green-600"
            : problemSubmitStatus.status.id === 4
              ? " border-red-600"
              : [5, 6, 7, 8, 9, 10, 11].includes(problemSubmitStatus.status.id)
                ? " border-yellow-600"
                : ""
          : ""
      } border px-4 py-4 mb-6 font-fira-code text-sm text-muted-foreground overflow-x-auto text-nowrap`}
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <code
          className={`${
            problemSubmitStatus
              ? problemSubmitStatus.status.id === 3
                ? "text-green-600"
                : problemSubmitStatus.status.id === 4
                  ? "text-red-600"
                  : [5, 6, 7, 8, 9, 10, 11].includes(
                        problemSubmitStatus.status.id
                      )
                    ? "text-yellow-600"
                    : ""
              : ""
          }`}
        >
          Testcase - {index}
        </code>
        {isPending ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : problemSubmitStatus ? (
          problemSubmitStatus.status.id === 3 ? (
            <Check className="text-green-600 size-5" />
          ) : problemSubmitStatus.status.id === 4 ? (
            <X className="text-red-600 size-5" />
          ) : [5, 6, 7, 8, 9, 10, 11].includes(
              problemSubmitStatus.status.id
            ) ? (
            <TriangleAlert className="text-yellow-600 size-5" />
          ) : null
        ) : null}
      </div>
      <Separator className="mb-2 w-5/6" />
      <div>
        <pre className="overflow-x-auto ">
          <code>{unescapeCode(testcase.input) as ReactNode}</code>
        </pre>
        <pre className="overflow-x-auto ">
          {`Output: ${unescapeCode(testcase.output)}`}
        </pre>
      </div>
    </Card>
  );
}
