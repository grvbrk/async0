"use client";

import { Submission, UserSolution } from "@repo/db";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/ui/card";
import CodeBlock from "@repo/ui/components/ui/CodeBlock";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function ProblemSubmissionCard({
  submissions,
}: {
  submissions: (Submission & { userSolution: UserSolution | null })[];
}) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="h-[75vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center">Submissions</CardTitle>
        <CardDescription>
          {submissions.length > 0
            ? "All submission results will be shows here"
            : "No submissions found"}
        </CardDescription>
      </CardHeader>
      {submissions.length > 0 ? (
        <>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Solution</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">
                    <p className="line-clamp-1">Testcases Passed</p>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub, index) => {
                  const date = new Date(sub.createdAt);
                  const formattedDate = format(
                    date,
                    "EEEE, d MMM, yyyy, h:mm a"
                  );
                  const timeAgo = formatDistanceToNow(date, {
                    addSuffix: true,
                  });
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <div
                          className={`font-medium ${sub.status === "Accepted" ? "text-green-600" : sub.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}
                        >
                          {sub.status === "Accepted"
                            ? "Pass"
                            : sub.status === "Rejected"
                              ? "Fail"
                              : "TLE"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center sm:table-cell">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={"outline"} size={"sm"}>
                              code
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-2">
                                <div className="w-72 overflow-hidden">
                                  Your Solution
                                </div>
                              </DialogTitle>
                              <DialogDescription className="overflow-auto">
                                <CodeBlock
                                  code={sub.userSolution?.code as string}
                                  theme={mounted ? theme ?? "dark" : "dark"}
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">{`${sub.passedTestcases} / ${sub.totalTestcases}`}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        <div className="font-medium line-clamp-1">
                          {formattedDate}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline md:line-clamp-1">
                          {timeAgo}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </>
      ) : null}
    </Card>
  );
}
