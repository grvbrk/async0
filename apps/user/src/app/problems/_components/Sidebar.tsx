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
import { Problem } from "@repo/db";
import { useState } from "react";
import { getSidebarData } from "@/app/actions/topics";

function Sidebar() {
  const { data: session } = useSession();
  const [sidebarData, setSidebarData] = useState<any>([]);
  async function handleSidebarClick() {
    const data = await getSidebarData();
    setSidebarData(data);
  }

  return (
    <Sheet>
      <SheetTrigger onClick={handleSidebarClick} asChild>
        <AlignJustify className="h-6 w-6" />
      </SheetTrigger>
      {sidebarData && (
        <SheetContent side="left" className="h-full flex flex-col">
          <SheetTitle className="pl-6 text-2xl font-black mt-4">
            Async0
          </SheetTitle>

          {session && session.user ? (
            <>
              <div className=" w-full px-6 bg-background flex-shrink-0 ">
                <SheetTitle className="text-foreground flex gap-1">
                  <div className="flex  items-center justify-center gap-1">
                    <LibraryBig className="h-5 w-5" />
                    <div className="text-sm">All Problems</div>
                  </div>
                  <div className="flex ml-auto items-center justify-center gap-1 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <div className="text-sm">{session.user.name}</div>
                  </div>
                </SheetTitle>
                <Progress className="mt-1" value={80} />
              </div>
            </>
          ) : (
            <>
              <div className=" w-full px-6 bg-background flex-shrink-0 ">
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
            </>
          )}
          <div className="overflow-y-auto px-6 flex-grow ">
            {sidebarData.map((topic: any, index: number) => {
              const isListSolved: boolean = topic.problems.every((p: any) => {
                p.solved === true;
              });
              return (
                <Accordion key={index} type="single" collapsible>
                  <AccordionItem value={topic.name}>
                    <AccordionTrigger>
                      <div
                        className={`flex items-center gap-2 ${isListSolved && "text-green-600"}`}
                      >
                        <CodeXml className="w-4 h-5" />
                        {topic.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 pl-6 mb-2 text-muted-foreground">
                      {topic && topic.problems.length > 0 ? (
                        topic.problems.map((problem: any, index: number) => {
                          return (
                            <div
                              key={index}
                              className="flex gap-2 items-center"
                            >
                              <Binary
                                className={`w-4 h-4  ${problem.solved ? "text-green-600" : "text-primary"}`}
                              />
                              <Link
                                href={`/problems/${problem.name.replace(/\s+/g, "-")}`}
                                className={`flex items-center gap-2 ${problem.solved ? "text-green-600 hover:text-green-400" : "text-primary hover:text-primary"}`}
                              >
                                <p className="line-clamp-1">{problem.name}</p>
                                <ExternalLink
                                  className={`w-3 h-3 text-muted-foreground`}
                                />
                              </Link>
                            </div>
                          );
                        })
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
      )}
    </Sheet>
  );
}

export default Sidebar;
