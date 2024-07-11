"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Code, X } from "lucide-react";
import { Difficulty, List, Status } from "@repo/db";
import { Badge } from "@repo/ui/components/ui/badge";

type userProblemDetails = {
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

export const columns: ColumnDef<userProblemDetails>[] = [
  {
    accessorKey: "hasUserSolved",
    header: "Status",
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
        <div className="flex justify-start pl-2">
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
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Difficulty;
      return (
        <Badge
          className={`${difficulty === "Easy" ? "text-white bg-green-600" : difficulty === "Medium" ? "text-white bg-yellow-600" : "text-white bg-red-600"}`}
        >
          {row.getValue("difficulty")}
        </Badge>
      );
    },
  },

  {
    accessorKey: "topics",
    header: "Topic",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as [{ name: string }];
      return topics[0].name;
    },
  },
  {
    accessorKey: "List",
    header: "List",
    cell: ({ row }) => {
      const list = row.getValue("List") as [List];
      return list[0].name;
    },
  },
];
