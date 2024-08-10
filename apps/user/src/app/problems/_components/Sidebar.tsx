"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { Progress } from "@repo/ui/components/ui/progress";
import {
  AlignJustify,
  Binary,
  CodeXml,
  ExternalLink,
  LibraryBig,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { getProgressData, getSidebarData } from "@/app/actions/topics";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

function Sidebar() {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [sidebarData, setSidebarData] = useState<any[]>([]);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const handleSidebarClick = useCallback(() => {
    if (!dataFetched) {
      startTransition(async () => {
        const data = await getSidebarData();
        const progress = await getProgressData();
        setSidebarData(data || []);
        setProgressVal(progress ?? 0);
        setDataFetched(true);
      });
    }
  }, [dataFetched]);

  return (
    <Sheet>
      <SheetTrigger onClick={handleSidebarClick} asChild>
        <AlignJustify className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="left" className="h-full flex flex-col">
        <SheetTitle className="pl-6 text-2xl font-black mt-4">
          Async0
        </SheetTitle>

        {status === "loading" ? (
          <div className="flex items-center gap-4 px-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : session && session.user ? (
          <div className="w-full px-6 bg-background flex-shrink-0">
            <SheetTitle className="text-foreground flex gap-1">
              <div className="flex items-center justify-center gap-1">
                <LibraryBig className="h-5 w-5" />
                <div className="text-sm">All Problems</div>
              </div>
              <div className="flex ml-auto items-center justify-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <div className="text-sm">{session.user.name}</div>
              </div>
            </SheetTitle>
            <Progress className="mt-1" value={progressVal} />
          </div>
        ) : (
          <div className="w-full px-6 bg-background flex-shrink-0">
            <SheetTitle className="text-foreground flex gap-1">
              <div className="flex items-center justify-center gap-1">
                <LibraryBig className="h-5 w-5" />
                <div className="text-sm">All Problems</div>
              </div>
              <div className="flex ml-auto items-center justify-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <div className="text-sm">User</div>
              </div>
            </SheetTitle>
            <Progress className="mt-1" value={80} />
          </div>
        )}

        <div className="overflow-y-auto px-6 flex-grow">
          {isPending
            ? Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center gap-2 w-full pr-4">
                    <Skeleton className="w-4 h-5" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="ml-auto h-4 w-16" />
                  </div>
                </div>
              ))
            : sidebarData.map((topic: any, index: number) => {
                const totalProblemsInList = topic.problems.length;
                let totalSolvedProblemsInList = 0;
                topic.problems.forEach((p: any) => {
                  if (p.solved) {
                    totalSolvedProblemsInList += 1;
                  }
                });
                const isListSolved =
                  totalProblemsInList === totalSolvedProblemsInList;

                return (
                  <Accordion key={index} type="single" collapsible>
                    <AccordionItem value={topic.name}>
                      <AccordionTrigger>
                        <div
                          className={`flex items-center gap-2 ${isListSolved && "text-green-600"} w-full pr-4`}
                        >
                          <CodeXml className="w-4 h-4 flex-shrink-0" />
                          <p className="line-clamp-1 flex-grow min-w-0 text-left">
                            {topic.name}
                          </p>
                          <p
                            className={`ml-auto text-sm ${isListSolved ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {`${totalSolvedProblemsInList}/${totalProblemsInList}`}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2 pl-6 mb-2 text-muted-foreground">
                        {topic.problems.length > 0 ? (
                          topic.problems.map((problem: any, index: number) => (
                            <div
                              key={index}
                              className="flex gap-2 items-center"
                            >
                              <Binary
                                className={`flex-shrink-0 w-4 h-4 ${problem.solved ? "text-green-600 hover:text-green-400" : "text-muted-foreground hover:text-primary"}`}
                              />
                              <Link
                                href={`/problems/${problem.name.replace(/\s+/g, "-")}`}
                                className={`flex items-center gap-2 ${problem.solved ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-primary"}`}
                              >
                                <p className="line-clamp-1 flex-grow min-w-0 text-left">
                                  {problem.name}
                                </p>
                                <ExternalLink className="flex-shrink-0 w-3 h-3 text-muted-foreground" />
                              </Link>
                            </div>
                          ))
                        ) : (
                          <h1>No problem found</h1>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
        </div>
        <SheetDescription></SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
