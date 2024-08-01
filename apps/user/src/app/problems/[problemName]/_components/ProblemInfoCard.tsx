"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import React, { useEffect, useState } from "react";
import TestCaseBlock from "./TestCaseBlock";
import { DisplayProblemPropType } from "./DisplayProblem";
import { problemDescriptions } from "@repo/common";
import { Badge } from "@repo/ui/components/ui/badge";
import { useTheme } from "next-themes";
import { Bookmark, ExternalLink } from "lucide-react";
import { toggleBookmark } from "@/app/actions/bookmarks";
import { useSession } from "next-auth/react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import Link from "next/link";

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
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const DescriptionComponent = problemDescriptions[problem!.name];
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    problem?.bookmarks?.length! > 0
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading")
    return (
      <Card className="h-[75vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-5 ml-4" />
            <Skeleton className="h-6 w-16 ml-auto" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
        </CardContent>
      </Card>
    );
  return (
    <Card className="h-[75vh] overflow-y-auto ">
      {problem ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center mb-2 ">
              <div className="text-2xl font-extrabold">{problem.name}</div>
              <Link
                href={problem.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer ml-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>

              {session && (
                <Bookmark
                  className={`h-5 w-5 ml-4 hover:text-primary hover:cursor-pointer ${isBookmarked && "fill-primary"}`}
                  onClick={async () => {
                    setIsBookmarked(!isBookmarked);
                    const result = await toggleBookmark(problem.id);
                    if (result === false || undefined) {
                      setIsBookmarked(false);
                    } else setIsBookmarked(true);
                  }}
                />
              )}

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
                <h1>No notes found.</h1>
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
        <h1>No problem Found.</h1>
      )}
    </Card>
  );
}
