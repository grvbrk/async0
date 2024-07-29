"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function UserBookmarkedProblems({
  bookmarkedProblems,
}: {
  bookmarkedProblems: {
    id: string;
    userId: string;
    problemId: string;
    createdAt: Date;
    updatedAt: Date;
    problem: { name: string };
  }[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [clickedBookmark, setClickedBookmark] = useState<number>();

  function handleLinkClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) {
    e.preventDefault();
    const href = e.currentTarget.href;
    setClickedBookmark(index);
    startTransition(() => {
      router.push(href);
    });
  }
  return (
    <div>
      <Card className="w-[350px] max-h-80 overflow-y-auto">
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
          <CardDescription>
            Your bookmarked problems will be shown here.
          </CardDescription>
        </CardHeader>
        <CardContent className="-mt-2">
          {bookmarkedProblems.length > 0 ? (
            bookmarkedProblems.map((problem, index) => {
              return (
                <div
                  key={index}
                  className="text-sm text-muted-foreground border rounded-lg p-2 mb-2 cursor-pointer hover:bg-muted/50 hover:text-primary"
                >
                  <Link
                    href={`/problems/${problem.problem.name.split(" ").join("-")}`}
                    onClick={(e) => handleLinkClick(e, index)}
                    className="flex"
                  >
                    <div>{problem.problem.name}</div>
                    {clickedBookmark === index && isPending && (
                      <LoaderCircle className="animate-spin size-5 ml-auto" />
                    )}
                  </Link>
                </div>
              );
            })
          ) : (
            <h1 className="text-sm text-muted-foreground">
              No problems to show
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
