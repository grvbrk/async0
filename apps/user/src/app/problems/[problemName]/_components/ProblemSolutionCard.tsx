"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import React, { startTransition, useOptimistic, useTransition } from "react";
import { DisplayProblemPropType, SolutionWithCounts } from "./DisplayProblem";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import CodeBlock from "@repo/ui/components/ui/CodeBlock";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import {
  toggleSolutionLikes,
  toggleSolutionDislikes,
  toggleSolutionSave,
} from "@/app/actions/solutions";
import { toast } from "sonner";

type ProblemSolutionCardProps = {
  problem: DisplayProblemPropType;
};

export default function ProblemSolutionCard({
  problem,
}: ProblemSolutionCardProps) {
  const { data: session } = useSession();
  const user: any = session?.user;
  const { theme } = useTheme();
  const [optimisticSolutions, setOptimisticSolutions] = useOptimistic<
    SolutionWithCounts[]
  >(problem?.solutions ?? []);
  const [isPending, startTransition] = useTransition();

  async function handleLikeToggle(solutionId: string) {
    if (session?.user && problem) {
      const currentSolutionIndex = optimisticSolutions.findIndex(
        (s) => s.id === solutionId
      );
      if (currentSolutionIndex === -1) return;
      const currentSolution = optimisticSolutions[currentSolutionIndex];
      const newOptimisticSolutions = [...optimisticSolutions];
      newOptimisticSolutions[currentSolutionIndex] = {
        ...currentSolution,
        isLiked: !currentSolution.isLiked,
        _count: {
          ...currentSolution._count,
          likes: currentSolution.isLiked
            ? currentSolution._count.likes - 1
            : currentSolution._count.likes + 1,
        },
      };
      setOptimisticSolutions(newOptimisticSolutions);

      try {
        await toggleSolutionLikes(solutionId);
      } catch (error) {
        toast.error("Failed to update. Please try again.");
        setOptimisticSolutions(optimisticSolutions);
      }
    } else {
      toast.error("You need to login first");
    }
  }

  async function handleDislikeToggle(solutionId: string) {
    if (session?.user && problem) {
      const currentSolutionIndex = optimisticSolutions.findIndex(
        (s) => s.id === solutionId
      );
      if (currentSolutionIndex === -1) return;
      const currentSolution = optimisticSolutions[currentSolutionIndex];
      const newOptimisticSolutions = [...optimisticSolutions];
      newOptimisticSolutions[currentSolutionIndex] = {
        ...currentSolution,
        isDisliked: !currentSolution.isDisliked,
        _count: {
          ...currentSolution._count,
          dislikes: currentSolution.isDisliked
            ? currentSolution._count.dislikes - 1
            : currentSolution._count.dislikes + 1,
        },
      };
      setOptimisticSolutions(newOptimisticSolutions);

      try {
        await toggleSolutionDislikes(solutionId);
      } catch (error) {
        toast.error("Failed to update. Please try again.");
        setOptimisticSolutions(optimisticSolutions);
      }
    } else {
      toast.error("You need to login first");
    }
  }

  async function handleSaveToggle(solutionId: string) {
    if (session?.user && problem) {
      const currentSolutionIndex = optimisticSolutions.findIndex(
        (s) => s.id === solutionId
      );
      if (currentSolutionIndex === -1) return;
      const currentSolution = optimisticSolutions[currentSolutionIndex];
      const newOptimisticSolutions = [...optimisticSolutions];
      newOptimisticSolutions[currentSolutionIndex] = {
        ...currentSolution,
        isSaved: !currentSolution.isSaved,
      };
      setOptimisticSolutions(newOptimisticSolutions);

      try {
        await toggleSolutionSave(solutionId);
      } catch (error) {
        toast.error("Failed to update. Please try again.");
        setOptimisticSolutions(optimisticSolutions);
      }
    } else {
      toast.error("You need to login first");
    }
  }

  return (
    <Card className="h-[75vh] overflow-y-auto">
      {problem ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center">Approaches</CardTitle>
            <CardDescription>
              {problem.solutions.length > 0 ? (
                <>
                  <p className="mb-4 flex flex-col gap-2">
                    Some approaches which I find intuitive.
                  </p>
                  {optimisticSolutions.map((solution, index) => {
                    return (
                      <div key={index}>
                        <div className="flex text-muted-foreground mb-2">
                          <div className="ml-auto flex items-center gap-4 mr-2">
                            <div className="flex gap-2 items-center">
                              <ThumbsUp
                                className={`h-4 w-4 hover:text-primary hover:cursor-pointer ${solution.isLiked && "fill-primary text-primary"}`}
                                onClick={() =>
                                  !solution.isDisliked &&
                                  startTransition(() =>
                                    handleLikeToggle(solution.id)
                                  )
                                }
                              />
                              <p>{solution._count.likes}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <ThumbsDown
                                className={`h-4 w-4 hover:text-primary hover:cursor-pointer ${solution.isDisliked && "fill-primary text-primary"}`}
                                onClick={() =>
                                  !solution.isLiked &&
                                  startTransition(() =>
                                    handleDislikeToggle(solution.id)
                                  )
                                }
                              />
                              <p>
                                {solution._count.dislikes > 0
                                  ? `-${solution._count.dislikes}`
                                  : solution._count.dislikes}
                              </p>
                            </div>
                            <Heart
                              className={`h-4 w-4 hover:text-primary hover:cursor-pointer ${solution.isSaved && "fill-red-600 stroke-red-600  text-primary"}`}
                              onClick={() =>
                                startTransition(() =>
                                  handleSaveToggle(solution.id)
                                )
                              }
                            />
                          </div>
                        </div>
                        <Card className="relative rounded-lg text-muted-foreground font-fira-code overflow-auto mb-4 ">
                          <CodeBlock
                            code={solution.code}
                            theme={theme || "light"}
                          />
                        </Card>
                      </div>
                    );
                  })}
                </>
              ) : (
                <h1>No solution found.</h1>
              )}
            </CardDescription>
          </CardHeader>
        </>
      ) : (
        <h1>No solution Found.</h1>
      )}
    </Card>
  );
}
