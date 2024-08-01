"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Bookmark, Check, Code, X } from "lucide-react";
import type {
  Bookmark as BookmarkType,
  Difficulty,
  List,
  Solution,
  Status,
  Topic,
} from "@repo/db";
import { Badge } from "@repo/ui/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { toggleBookmark } from "../actions/bookmarks";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type userProblemDetailsType = {
  id: string;
  name: string;
  link: string | null;
  difficulty: Difficulty;
  topics: { name: string }[];
  lists: List[];
  hasUserSolved?: {
    id: string;
    submissionId: string | null;
    userId: string | null;
    problemId: string | null;
    createdAt: Date;
    updatedAt: Date;
    Submission?: {
      status: Status;
      passedTestcases: number;
      totalTestcases: number;
    } | null;
  }[];
  bookmarks?: BookmarkType[];
  solutions: Solution[];
}[];

export function useUserProblemColumns(): ColumnDef<userProblemDetailsType>[] {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return useMemo(() => {
    const columns: ColumnDef<userProblemDetailsType>[] = [
      {
        accessorKey: "hasUserSolved",
        header: ({ column }) => {
          return <div className="flex justify-center">Status</div>;
        },
        cell: ({ row }) => {
          const userSolvedStatus = row.getValue("hasUserSolved") as {
            Submission: {
              status: Status;
              passedTestcases: number;
              totalTestcases: number;
            };
          };
          const isSolved = userSolvedStatus?.Submission?.status === "Accepted";

          return (
            <div className="flex justify-center">
              {isSolved ? (
                <Check className="text-green-600" />
              ) : (
                <Code className=" size-5" />
              )}
            </div>
          );
        },
        size: 100,
      },

      {
        accessorKey: "bookmarks",
        header: ({ column }) => {
          return <div className="flex justify-center">Bookmark</div>;
        },
        cell: ({ row }) => {
          const problemData =
            row.original as unknown as userProblemDetailsType[0];
          const [isBookmarked, setIsBookmarked] = useState<boolean>(
            problemData.bookmarks?.length! > 0
          );
          return (
            <div className="flex justify-center">
              {
                <Bookmark
                  size={16}
                  className={`${isBookmarked && "fill-primary text-primary"}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (session) {
                      setIsBookmarked(!isBookmarked);
                      const result = await toggleBookmark(problemData.id);
                      if (result === false || undefined) {
                        setIsBookmarked(false);
                      } else setIsBookmarked(true);

                      router.refresh();
                    } else {
                      toast.error(
                        "You need to login before bookmarking problems"
                      );
                      return;
                    }
                  }}
                />
              }
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          //@ts-ignore
          const userBookmarks = row.getValue(columnId) as BookmarkType[];
          const isBookmarked = userBookmarks.length > 0;
          return filterValue ? isBookmarked : true;
        },
        size: 100,
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
        size: 200,
      },
      {
        accessorKey: "solutions",
        header: ({ column }) => {
          return (
            <div className="flex justify-center cursor-pointer ">
              <h1>Solutions</h1>
            </div>
          );
        },
        cell: ({ row }) => {
          const solutionArray = row.getValue("solutions") as Solution[];
          return (
            <div className="flex justify-center"> {solutionArray.length} </div>
          );
        },
        size: 100,
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
            <div className="flex self-center justify-center">
              <Badge
                className={`${difficulty === "Easy" ? "text-background bg-green-600" : difficulty === "Medium" ? "text-background bg-yellow-600" : "text-background bg-red-600"} w-20 flex justify-center`}
              >
                {row.getValue("difficulty")}
              </Badge>
            </div>
          );
        },
        sortingFn: (a, b) => {
          const difficultyOrder = ["Easy", "Medium", "Hard", "NA"];
          return (
            difficultyOrder.indexOf(a.getValue("difficulty")) -
            difficultyOrder.indexOf(b.getValue("difficulty"))
          );
        },
        size: 100,
      },
      {
        accessorKey: "topics",
        header: ({ column }) => {
          return <div className="flex justify-center">Topic</div>;
        },
        cell: ({ row }) => {
          const topicList = row.getValue("topics") as Topic[];
          return (
            <div className="line-clamp-1 text-center">{topicList[0].name}</div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const topics = row.getValue(columnId) as Topic[];
          return topics.some((topic) => topic.name === filterValue);
        },
        size: 100,
      },
      {
        accessorKey: "lists",
        header: ({ column }) => {
          return <div className=" flex justify-center">List</div>;
        },
        cell: ({ row }) => {
          const lists = row.getValue("lists") as List[];
          return <div className=" flex justify-center">{lists[0].name}</div>;
        },
        filterFn: (row, columnId, filterValue) => {
          const lists = row.getValue(columnId) as List[];
          return lists.some((list) => list.name === filterValue);
        },
        size: 100,
      },
    ];

    return columns;
  }, []);
}
