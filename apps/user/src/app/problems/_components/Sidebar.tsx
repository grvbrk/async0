"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
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
import { AlignJustify, Binary, CodeXml } from "lucide-react";
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
    console.log(data);
    setSidebarData(data);
  }

  return (
    <Sheet>
      <SheetTrigger onClick={handleSidebarClick} asChild>
        <AlignJustify className="h-6 w-6" />
      </SheetTrigger>
      {sidebarData && (
        <SheetContent side="left" className="h-full">
          <div className=" w-full px-6 pb-6 pt-8 bg-foreground ">
            <SheetTitle className="text-white mb-2">
              {session ? session.user?.name : "User Name"}
            </SheetTitle>
            <SheetTitle className="text-md text-white">Progress</SheetTitle>
            <Progress className="text-white mt-1" value={33} />
          </div>

          <div className="overflow-y-auto overflow-x-hidden pt-2 p-6">
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
                    <AccordionContent className="flex flex-col gap-1 pl-6 mb-2 text-muted-foreground">
                      {topic && topic.problem.length > 0 ? (
                        topic.problem.map((problem: Problem, index: number) => {
                          return (
                            <div key={index} className="flex gap-2">
                              <Binary className="w-4 h-5 text-muted-foreground" />
                              <Link
                                href={`/problems/${problem.name.replace(/\s+/g, "-")}`}
                                className="hover:text-foreground"
                              >
                                {problem.name}
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

          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetContent>
      )}
    </Sheet>
  );
}

export default Sidebar;
