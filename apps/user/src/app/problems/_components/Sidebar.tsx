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
import { AlignJustify, Binary, CodeXml, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Problem } from "@repo/db";
import { useState } from "react";
import { getSidebarData } from "@/app/actions/topics";
import { usePathname } from "next/navigation";

function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
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
          <div className=" w-full px-6  pt-8 bg-background flex-shrink-0">
            <SheetTitle className="text-foreground mb-2">
              {session ? session.user?.name : "User Name"}
            </SheetTitle>
            <SheetTitle className="text-md ">Progress</SheetTitle>
            <Progress className=" mt-1" value={33} />
          </div>

          <div className="overflow-y-auto pt-2 p-6  flex-grow">
            {sidebarData.map((topic: any, index: number) => {
              return (
                <Accordion key={index} type="single" collapsible>
                  <AccordionItem value={topic.name}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <CodeXml className="w-4 h-5" />
                        {topic.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 pl-6 mb-2">
                      {topic && topic.problem.length > 0 ? (
                        topic.problem.map((problem: Problem, index: number) => {
                          return (
                            <div
                              key={index}
                              className="flex gap-2 items-center"
                            >
                              <Binary className="w-4 h-4 text-primary" />
                              <Link
                                href={`/problems/${problem.name.replace(/\s+/g, "-")}`}
                                className="hover:text-primary flex items-center gap-2 "
                              >
                                {problem.name}
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
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
        </SheetContent>
      )}
    </Sheet>
  );
}

export default Sidebar;
