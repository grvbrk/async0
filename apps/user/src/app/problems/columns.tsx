"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Code, X } from "lucide-react";
import { Difficulty, List, Status, Submission, Topic } from "@repo/db";
import { Badge } from "@repo/ui/components/ui/badge";
import { useMemo } from "react";

export type userProblemDetailsType = {
  id: string;
  name: string;
  difficulty: Difficulty;
  topics: Topic[];
  List: List[];
  hasUserSolved?: {
    Submission: Submission | null;
  }[];
}[];

export function useGeneralColumns(): ColumnDef<userProblemDetailsType>[] {
  return useMemo(() => {
    const columns: ColumnDef<userProblemDetailsType>[] = [
      {
        accessorKey: "hasUserSolved",
        header: ({ column }) => {
          return <div className="flex justify-center">Status</div>;
        },
        cell: ({ row }) => {
          const hasUserSolved = row.getValue("hasUserSolved") as {
            Submission: {
              status: Status;
              passedTestcases: number;
              totalTestcases: number;
            };
          };
          const isSolved = hasUserSolved?.Submission?.status === "Accepted";

          return (
            <div className="flex justify-center">
              {isSolved ? (
                <Check className="text-green-600" />
              ) : (
                <Code className="text-muted-foreground size-5" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer w-fit"
              onClick={() => {
                column.toggleSorting();
              }}
            >
              <h1>Problem</h1>
              <ArrowUpDown className="ml-2 h-3 w-3 " />
            </div>
          );
        },
        cell: ({ row }) => {
          const problemName = row.getValue("name") as string;
          return <div className="text-muted-foreground"> {problemName} </div>;
        },
      },
      {
        accessorKey: "difficulty",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => column.toggleSorting()}
            >
              <h1>Difficulty</h1>
              <ArrowUpDown className="ml-2 h-3 w-3 cursor-pointer" />
            </div>
          );
        },
        cell: ({ row }) => {
          const difficulty = row.getValue("difficulty") as Difficulty;
          return (
            <Badge
              className={`${difficulty === "Easy" ? "text-background bg-green-600" : difficulty === "Medium" ? "text-background bg-yellow-600" : "text-background bg-red-600"} flex justify-center`}
            >
              {row.getValue("difficulty")}
            </Badge>
          );
        },

        sortingFn: (a, b) => {
          const difficultyOrder = ["Easy", "Medium", "Hard", "NA"];
          return (
            difficultyOrder.indexOf(a.getValue("difficulty")) -
            difficultyOrder.indexOf(b.getValue("difficulty"))
          );
        },
      },

      {
        accessorKey: "topics",
        header: ({ column }) => {
          return <div className="flex justify-center">Topic</div>;
        },
        cell: ({ row }) => {
          const topics = row.getValue("topics") as [{ name: string }];
          return (
            <div className="text-muted-foreground flex justify-center">
              {" "}
              {topics[0].name}{" "}
            </div>
          );
        },
      },
      {
        accessorKey: "List",
        header: ({ column }) => {
          return <div className=" flex justify-center">List</div>;
        },
        cell: ({ row }) => {
          const list = row.getValue("List") as [List];
          return (
            <div className="text-muted-foreground flex justify-center">
              {list[0].name}
            </div>
          );
        },
      },
    ];

    return columns;
  }, []);
}
