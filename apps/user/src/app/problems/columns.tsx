"use client";

import { ProblemTableData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Clock, Users } from "lucide-react";

export const columns: ColumnDef<ProblemTableData>[] = [
  {
    accessorKey: "hasSolved",
    header: () => {
      return <div className="flex justify-center">Status</div>;
    },
    cell: ({ row }) => {
      const hasSolved = row.getValue("hasSolved") as boolean;
      return (
        <div className="flex justify-center">
          {hasSolved ? (
            <Check className="text-green-600" />
          ) : (
            <Clock className="size-5" />
          )}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "totalBookmarks",
    header: () => {
      return <div className="flex justify-center">Bookmarks</div>;
    },
    cell: ({ row }) => {
      const totalBookmarks = row.getValue("totalBookmarks") as number;
      return (
        <div className="flex justify-start items-center gap-1">
          <Users className="h-4 w-4" />
          <p className="text-center">{totalBookmarks}</p>
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
      return <div className="line-clamp-1"> {problemName} </div>;
    },
  },
  {
    accessorKey: "topics",
    header: () => {
      return <div className="flex justify-center">Topic</div>;
    },
    cell: ({ row }) => {
      const topicList = row.getValue("topics") as string[];
      return <div className="line-clamp-1 text-center">{topicList[0]}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const topics = row.getValue(columnId) as string[];
      return topics.some((topic) => topic === filterValue);
    },
  },
  { accessorKey: "lists", header: "Lists" },
  { accessorKey: "difficulty", header: "Difficulty" },
  { accessorKey: "totalUsersSolved", header: "Users Solved" },
];
