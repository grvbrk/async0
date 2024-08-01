"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/ui/resizable";

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { BookOpen, Code, NotebookText } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { useState, useTransition } from "react";
import { codeSubmission } from "@/app/actions/codeSubmission";
import { unescapeCode } from "@repo/common";
import AnimatePanel from "./AnimatePanel";
import ProblemInfoCard from "./ProblemInfoCard";
import ProblemSolutionCard from "./ProblemSolutionCard";
import { Bookmark, Solution, Submission, Testcase } from "@repo/db";
import ProblemSubmissionCard from "./ProblemSubmissionCard";

export type SolutionWithCounts = Solution & {
  _count: {
    likes: number;
    dislikes: number;
  };
  savedBy?: { id: string }[];
  likes?: { id: string }[];
  dislikes?: { id: string }[];
  isSaved?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
};

export type DisplayProblemPropType =
  | {
      id: string;
      name: string;
      link: string | null;
      difficulty: string;
      starterCode: string;
      solutions: SolutionWithCounts[];
      testcases: Testcase[];
      bookmarks?: Bookmark[];
    }
  | null
  | undefined;

export default function DisplayProblem({
  problem,
  submissions,
  problemName,
}: {
  problem: DisplayProblemPropType;
  submissions: Submission[];
  problemName: string;
}) {
  const [problemSubmitStatus, setProblemSubmitStatus] = useState<any>([]);
  const [problemRunStatus, setProblemRunStatus] = useState<any>({});
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
      if (response && Array.isArray(response)) {
        const firstErrorIndex = response.findIndex((problem: any) =>
          [4, 5, 6, 7, 8, 9, 10, 11, 12].includes(problem.value.status.id)
        );
        setErrorIndex(firstErrorIndex);
        const problemsToShow =
          firstErrorIndex !== -1
            ? response.slice(0, firstErrorIndex + 1)
            : response;
        setProblemSubmitStatus(problemsToShow);
      } else {
        setProblemRunStatus(response);
      }
    });
  }
  return (
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
      <ResizablePanel minSize={20} defaultSize={55} className="hidden md:block">
        <CodeEditor
          placeholderCode={unescapeCode(problem?.starterCode || "") || ""}
          handleTestcaseSubmission={handleTestcaseSubmission}
          isPending={isPending}
          problemSubmitStatus={problemSubmitStatus}
          setProblemSubmitStatus={setProblemSubmitStatus}
          problemRunStatus={problemRunStatus}
          setProblemRunStatus={setProblemRunStatus}
          totaltestcases={problem?.testcases.length as number}
          passedtestcases={errorIndex}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
