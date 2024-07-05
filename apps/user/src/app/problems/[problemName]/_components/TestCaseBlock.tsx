"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Testcase } from "@repo/db";
import { Check, LoaderCircle, TriangleAlert, X } from "lucide-react";

export default function TestCaseBlock({
  testcase,
  index,
  problemStatus,
  isPending,
}: {
  testcase: Testcase;
  index: number;
  problemStatus: any;
  isPending: boolean;
}) {
  console.log("STATUS", problemStatus);
  return (
    <Card
      className={`${
        problemStatus
          ? problemStatus.value.status.id === 3
            ? "border border-green-600"
            : problemStatus.value.status.id === 4
              ? "border border-red-600"
              : [5, 6, 7, 8, 9, 10, 11].includes(problemStatus.value.status.id)
                ? "border border-yellow-600"
                : ""
          : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`${
            problemStatus
              ? problemStatus.value.status.id === 3
                ? "text-green-600"
                : problemStatus.value.status.id === 4
                  ? "text-red-600"
                  : [5, 6, 7, 8, 9, 10, 11].includes(
                        problemStatus.value.status.id
                      )
                    ? "text-yellow-600"
                    : ""
              : ""
          } text-sm font-medium`}
        >
          problemStatus - {index}
        </CardTitle>
        {isPending ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : problemStatus ? (
          problemStatus.value.status.id === 3 ? (
            <Check className="text-green-600 size-5" />
          ) : problemStatus.value.status.id === 4 ? (
            <X className="text-red-600 size-5" />
          ) : [5, 6, 7, 8, 9, 10, 11].includes(
              problemStatus.value.status.id
            ) ? (
            <TriangleAlert className="text-yellow-600 size-5" />
          ) : null
        ) : null}
      </CardHeader>
      <Separator className="w-20 mx-6" />
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
          {testcase.input}
        </p>
        <p className="text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
          {`Output: ${testcase.output}`}
        </p>
      </CardContent>
    </Card>
  );
}
