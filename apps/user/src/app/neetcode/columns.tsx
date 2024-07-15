"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Code, ExternalLink, X } from "lucide-react";
import { Difficulty, List, Status } from "@repo/db";
import { Badge } from "@repo/ui/components/ui/badge";
import { useMemo } from "react";

export type NeetcodeProblemDetails = {
  id: string;
  name: string;
  difficulty: Difficulty;
  topics: {
    name: string;
  }[];
  hasUserSolved: {
    Submission: {
      status: Status;
      passedTestcases: number;
      totalTestcases: number;
    } | null;
  }[];
};

export function useNeetcodeColumns() {
  return useMemo(() => {
    const columns: ColumnDef<NeetcodeProblemDetails>[] = [
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
            <div className="flex items-center">
              <h1 className="cursor-default hover:bg-transparent">Problem</h1>
              <ArrowUpDown
                className="ml-2 h-3 w-3 cursor-pointer"
                onClick={() => {
                  column.toggleSorting();
                }}
              />
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
          return <div className=" flex justify-center">Difficulty</div>;
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
        accessorKey: "Link",
        header: ({ column }) => {
          return <div className=" flex justify-center">Neetcode Link</div>;
        },
        cell: ({ row }) => {
          // const list = row.getValue("List") as [List];
          return (
            <div className="text-muted-foreground flex justify-center">
              <ExternalLink className="h-5 w-5" />
            </div>
          );
        },
      },
    ];

    return columns;
  }, []);
}
