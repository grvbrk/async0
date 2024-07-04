"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Testcase } from "@repo/db";
import { Check, TriangleAlert, X } from "lucide-react";

export default function TestCaseBlock({
  testcase,
  index,
  testcaseStatus,
}: {
  testcase: Testcase;
  index: number;
  testcaseStatus: any;
}) {
  console.log("STATUS", testcaseStatus);
  return (
    <Card
      className={`${
        testcaseStatus
          ? testcaseStatus.value.status.id === 3
            ? "border border-green-600"
            : testcaseStatus.value.status.id === 4
              ? "border border-red-600"
              : testcaseStatus.value.status.id === 5
                ? "border border-yellow-600"
                : ""
          : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`${
            testcaseStatus
              ? testcaseStatus.value.status.id === 3
                ? "text-green-600"
                : testcaseStatus.value.status.id === 4
                  ? "text-red-600"
                  : testcaseStatus.value.status.id === 5
                    ? "text-yellow-600"
                    : ""
              : ""
          } text-sm font-medium`}
        >
          testcaseStatus - {index}
        </CardTitle>
        {testcaseStatus ? (
          testcaseStatus.value.status.id === 3 ? (
            <Check className="text-green-600 size-5" />
          ) : testcaseStatus.value.status.id === 4 ? (
            <X className="text-red-600 size-5" />
          ) : testcaseStatus.value.status.id === 5 ? (
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

{
  /* <LoaderCircle /> */
}
