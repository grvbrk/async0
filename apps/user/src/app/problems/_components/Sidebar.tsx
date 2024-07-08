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
import { AlignJustify } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function Sidebar({ topics }: { topics: any[] }) {
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger className="flex items-center gap-1" asChild>
        <AlignJustify className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetTitle className="flex justify-start mb-2">
          {session ? session.user?.name : "User Name"}
        </SheetTitle>
        <SheetTitle>Your Progress</SheetTitle>
        <Progress value={33} className="mt-1" />
        {topics.map((topic, index) => {
          return (
            <Accordion key={index} type="single" collapsible className="mt-2">
              <AccordionItem value={topic.name}>
                <AccordionTrigger>{topic.name}</AccordionTrigger>
                <AccordionContent className="flex flex-col">
                  <Link href="/problems/anagrams" className="w-fit">
                    Link to a problem
                  </Link>
                  <Link href="/problems/anagrams" className="w-fit">
                    Link to a problem
                  </Link>
                  <Link href="/problems/anagrams" className="w-fit">
                    Link to a problem
                  </Link>
                  <Link href="/problems/anagrams" className="w-fit">
                    Link to a problem
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}

        <SheetDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
