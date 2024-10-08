"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/ui/resizable";

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Code,
  NotebookText,
} from "lucide-react";
import CodeEditor from "./CodeEditor";
import { useState, useTransition } from "react";
import { codeSubmission } from "@/app/actions/codeSubmission";
import { judge0ValueKeyType, unescapeCode } from "@repo/common";
import AnimatePanel from "./AnimatePanel";
import ProblemInfoCard from "./ProblemInfoCard";
import ProblemSolutionCard from "./ProblemSolutionCard";
import { Submission, UserSolution } from "@repo/db";
import ProblemSubmissionCard from "./ProblemSubmissionCard";
import { toast } from "sonner";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip";
import Card3D from "../../_components/Card3d";
import { DisplayProblemType } from "../page";
import Link from "next/link";

export default function DisplayProblem({
  problem,
  submissions,
  problemName,
}: {
  problem: DisplayProblemType;
  submissions: (Submission & { userSolution: UserSolution | null })[];
  problemName: string;
}) {
  const [problemSubmitStatus, setProblemSubmitStatus] = useState<
    judge0ValueKeyType[]
  >([]);
  const [problemRunStatus, setProblemRunStatus] =
    useState<judge0ValueKeyType>();
  const [errorIndex, setErrorIndex] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("problem");
  const [direction, setDirection] = useState<"left" | "right">("left");

  function handleTabChange(newTab: string) {
    const tabOrder = ["problem", "solution", "submission"];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);

    if (newIndex > currentIndex) {
      setDirection("left");
    } else {
      setDirection("right");
    }

    setActiveTab(newTab);
  }

  async function handleTestcaseSubmission(userFunction: string, run: boolean) {
    startTransition(async () => {
      // response variable gets the final result from judge0
      const response = await codeSubmission(
        userFunction,
        problem,
        problemName,
        run
      );
      if (response) {
        if (Array.isArray(response)) {
          const firstErrorIndex = response.findIndex(
            (problem: judge0ValueKeyType) =>
              [4, 5, 6, 7, 8, 9, 10, 11, 12, 69].includes(problem.status.id)
          );
          setErrorIndex(firstErrorIndex);
          const problemsToShow =
            firstErrorIndex != -1
              ? response.slice(0, firstErrorIndex + 1)
              : response;
          setProblemSubmitStatus(problemsToShow);
        } else {
          setProblemRunStatus(response);
        }
      } else {
        toast.error("Something went wrong...");
      }
    });
  }

  return (
    <div className="relative">
      {problem && problem.lowerRankProblemName && (
        <Link href={problem.lowerRankProblemName.split(" ").join("-")}>
          <Card3D className="absolute z-10 top-1/4 h-1/2 ml-2 flex items-center text-muted-foreground hover:text-primary  cursor-pointer rounded-lg hover:bg-secondary hover:border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="p-2 h-full">
                  <ChevronsLeft />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {problem.lowerRankProblemName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card3D>
        </Link>
      )}
      {problem && problem.higherRankProblemName && (
        <Link href={problem.higherRankProblemName.split(" ").join("-")}>
          <Card3D className="absolute z-10 right-0 top-1/4 h-1/2 mr-2 flex items-center text-muted-foreground hover:text-primary cursor-pointer rounded-lg hover:bg-secondary hover:border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="p-2 h-full">
                  <ChevronsRight />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {problem.higherRankProblemName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card3D>
        </Link>
      )}
      <ResizablePanelGroup
        direction="horizontal"
        className="md:px-5 grid grid-cols-2 "
      >
        <ResizablePanel defaultSize={45} minSize={25}>
          <Tabs defaultValue="problem" className="p-4">
            <TabsList className="flex justify-around w-full bg-transparent mb-2 ">
              <TabsTrigger
                value="problem"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
                onClick={() => handleTabChange("problem")}
              >
                <BookOpen />
              </TabsTrigger>
              <TabsTrigger
                value="solution"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
                onClick={() => {
                  handleTabChange("solution");
                }}
              >
                <Code />
              </TabsTrigger>
              <TabsTrigger
                value="submission"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
                onClick={() => {
                  handleTabChange("submission");
                }}
              >
                <NotebookText />
              </TabsTrigger>
            </TabsList>
            <AnimatePanel direction={direction} activeTab={activeTab}>
              {activeTab === "problem" ? (
                <ProblemInfoCard
                  problem={problem!}
                  isPending={isPending}
                  problemSubmitStatus={problemSubmitStatus}
                />
              ) : activeTab === "solution" ? (
                <ProblemSolutionCard problem={problem!} />
              ) : (
                <ProblemSubmissionCard submissions={submissions} />
              )}
            </AnimatePanel>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle className="hidden md:block w-1 bg-muted hover:bg-muted-foreground -z-10" />
        <ResizablePanel
          minSize={20}
          defaultSize={55}
          className="hidden md:block"
        >
          <CodeEditor
            placeholderCode={unescapeCode(problem?.starterCode || "") || ""}
            problemName={problemName}
            handleTestcaseSubmission={handleTestcaseSubmission}
            isPending={isPending}
            problemSubmitStatus={problemSubmitStatus}
            setProblemSubmitStatus={setProblemSubmitStatus}
            problemRunStatus={problemRunStatus as judge0ValueKeyType}
            totaltestcases={problem?.testcases.length as number}
            passedtestcases={
              errorIndex === -1 ? problem!.testcases.length : errorIndex
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
