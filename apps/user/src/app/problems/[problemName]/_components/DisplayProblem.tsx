"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/ui/resizable";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Badge } from "@repo/ui/components/ui/badge";
import { BookOpen, Code, NotebookText } from "lucide-react";
import CodeEditor from "./CodeEditor";
import TestCaseBlock from "./TestCaseBlock";
import { Difficulty } from "@prisma/client";
import { createElement, useState, useTransition } from "react";
import { codeSubmission } from "@/app/actions/codeSubmission";
import { problemComponents, unescapeCode } from "@repo/common";
import AnimatePanel from "./AnimatePanel";

type DisplayProblemPropType =
  | ({
      testcases: {
        id: string;
        input: string;
        output: string;
        problemId: string | null;
      }[];
    } & {
      id: string;
      name: string;
      difficulty: Difficulty;
      isActiveForSubmission: boolean;
      starterCode: string;
      createdAt: Date;
      updatedAt: Date;
    })
  | null
  | undefined;

export default function DisplayProblem({
  problem,
  problemName,
}: {
  problem: DisplayProblemPropType;
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

  async function handleTestcaseSubmission(code: string, run: boolean) {
    startTransition(async () => {
      // response variable gets the final result from judge0
      const response = await codeSubmission(code, problem, problemName, run);
      // console.log("RESPONSE", response);
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
          <TabsList className="flex justify-around w-full bg-transparent mb-2">
            <TabsTrigger
              value="problem"
              className="w-full data-[state=active]:bg-muted"
              onClick={() => handleTabChange("problem")}
            >
              <BookOpen />
            </TabsTrigger>
            <TabsTrigger
              value="solution"
              className="w-full data-[state=active]:bg-muted"
              onClick={() => {
                handleTabChange("solution");
              }}
            >
              <Code />
            </TabsTrigger>
            <TabsTrigger
              value="submission"
              className="w-full data-[state=active]:bg-muted"
              onClick={() => {
                handleTabChange("submission");
              }}
            >
              <NotebookText />
            </TabsTrigger>
          </TabsList>
          <AnimatePanel direction={direction}>
            {activeTab === "problem" ? (
              <Card className="h-[75vh] overflow-y-auto ">
                {problem ? (
                  <>
                    <CardHeader>
                      <CardTitle className="flex items-center mb-2 ">
                        <div className="text-2xl font-extrabold">
                          {problem.name}
                        </div>
                        <Badge className="text-white bg-green-600 ml-auto">
                          {problem.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {problemComponents[problem.name] ? (
                          createElement(problemComponents[problem.name])
                        ) : (
                          <h1>No description found</h1>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {problem.testcases.map((testcase, index) => {
                        return (
                          <TestCaseBlock
                            key={testcase.id}
                            testcase={testcase}
                            index={index + 1}
                            problemSubmitStatus={problemSubmitStatus?.[index]}
                            isPending={isPending}
                          />
                        );
                      })}
                    </CardContent>
                  </>
                ) : (
                  <h1>No problem Found</h1>
                )}
              </Card>
            ) : activeTab === "solution" ? (
              <Card className="h-[75vh] overflow-y-auto ">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[75vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
              </Card>
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
