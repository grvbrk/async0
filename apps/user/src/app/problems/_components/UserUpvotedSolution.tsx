"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function UserUpvotedSolution({
  savedSolutions,
}: {
  savedSolutions: {
    problemId: string;
    problemName: string;
    solutions: {
      id: string;
      code: string;
      createdAt: Date;
      updatedAt: Date;
      rank: number;
    }[];
  }[];
}) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Card className="w-[350px] max-h-80 overflow-y-auto">
        <CardHeader>
          <CardTitle>Solutions</CardTitle>
          <CardDescription>
            Your liked solutions/approaches will be shown here.
          </CardDescription>
        </CardHeader>
        <CardContent className="-mt-2">
          {savedSolutions.length > 0 ? (
            savedSolutions.map((solution, index: number) => {
              return (
                <div
                  key={index}
                  className="text-sm text-muted-foreground border rounded-lg p-2 mb-2 "
                >
                  <div className="flex items-center">
                    <div className=" w-48 overflow-hidden ">
                      {solution.problemName}
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {solution.solutions.map((s, idx) => {
                        return (
                          <Dialog key={idx}>
                            <DialogTrigger asChild>
                              <Button variant={"outline"} size={"sm"}>
                                {s.rank + 1}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="mb-2">
                                  <div className="w-72 overflow-hidden">
                                    {`Problem: ${solution.problemName}`}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">{`Solution ${s.rank + 1}`}</div>
                                </DialogTitle>
                                <DialogDescription className="overflow-auto">
                                  <CodeBlock
                                    code={s.code}
                                    theme={mounted ? theme ?? "dark" : "dark"}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-sm text-muted-foreground">
              No solutions to show
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
