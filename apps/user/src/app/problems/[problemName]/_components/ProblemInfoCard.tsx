"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import React, { useState } from "react";
import TestCaseBlock from "./TestCaseBlock";
import { DisplayProblemPropType } from "./DisplayProblem";
import { problemDescriptions } from "@repo/common";
import { Badge } from "@repo/ui/components/ui/badge";
import { useTheme } from "next-themes";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/app/actions/bookmarks";
import { useSession } from "next-auth/react";
import { DefaultUser } from "next-auth";

type ProblemInfoCardProps = {
  problem: DisplayProblemPropType;
  isPending: boolean;
  problemSubmitStatus: any;
};

export default function ProblemInfoCard({
  problem,
  isPending,
  problemSubmitStatus,
}: ProblemInfoCardProps) {
  const { data: session } = useSession();
  const DescriptionComponent = problemDescriptions[problem!.name];
  const { theme } = useTheme();

  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    problem?.bookmarks.length! > 0
  );
  return (
    <Card className="h-[75vh] overflow-y-auto ">
      {problem ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center mb-2 ">
              <div className="text-2xl font-extrabold">{problem.name}</div>
              <Bookmark
                className={`h-5 w-5 ml-4 hover:text-primary hover:cursor-pointer mt-1 ${isBookmarked && "fill-primary"}`}
                onClick={async () => {
                  setIsBookmarked(!isBookmarked);
                  const result = await toggleBookmark(
                    session?.user as DefaultUser,
                    problem.id
                  );
                  if (result === false || undefined) {
                    setIsBookmarked(false);
                  } else setIsBookmarked(true);
                }}
              />
              <Badge
                className={`text-background ${problem.difficulty === "Easy" ? "bg-green-600" : problem.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"} ml-auto`}
              >
                {problem.difficulty}
              </Badge>
            </CardTitle>
            <CardDescription>
              {DescriptionComponent ? (
                <DescriptionComponent theme={theme} />
              ) : (
                <h1>No description found</h1>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {problem.testcases.map((testcase, index) => {
              return (
                <TestCaseBlock
                  key={testcase.id}
                  testcase={testcase}
                  index={index + 1}
                  problemSubmitStatus={problemSubmitStatus?.[index]}
                  isPending={isPending}
                />
              );
            })}
          </CardContent>
        </>
      ) : (
        <h1>No problem Found</h1>
      )}
    </Card>
  );
}