"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import React, { createElement } from "react";
import { DisplayProblemPropType } from "./DisplayProblem";
import { problemSolutions } from "@repo/common";

type ProblemSolutionCardProps = {
  problem: DisplayProblemPropType;
};

export default function ProblemSolutionCard({
  problem,
}: ProblemSolutionCardProps) {
  return (
    <Card className="h-[75vh] overflow-y-auto ">
      {problem ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center">Approaches</CardTitle>
            <CardDescription>
              {problemSolutions[problem.name] ? (
                createElement(problemSolutions[problem.name])
              ) : (
                <h1>No description found</h1>
              )}
            </CardDescription>
          </CardHeader>
        </>
      ) : (
        <h1>No solution Found</h1>
      )}
    </Card>
  );
}
