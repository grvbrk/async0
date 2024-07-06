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
import CodeEditor from "../CodeEditor";
import TestCaseBlock from "./TestCaseBlock";
import { Difficulty } from "@prisma/client";
import { useState, useTransition } from "react";
import { codeSubmission } from "@/app/actions/codeSubmission";
import ProblemDesc from "@repo/common/problem-ui/DuplicateInteger";

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
}: {
  problem: DisplayProblemPropType;
}) {
  const [problemStatus, setProblemStatus] = useState<unknown[] | undefined>([]);
  const [placeholderCode, setPlaceholderCode] = useState<string>(
    "function hasDuplicate(nums){\n\t// todo\n};"
  );

  const [isPending, startTransition] = useTransition();

  async function handleTestcaseSubmission(code: string) {
    setPlaceholderCode(code);
    startTransition(async () => {
      const response = await codeSubmission(code, problem);
      setProblemStatus(response);
    });
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="grid grid-cols-2">
      <ResizablePanel defaultSize={45} minSize={25}>
        <Tabs defaultValue="problem" className="p-4">
          <TabsList className="flex justify-around w-full bg-transparent">
            <TabsTrigger
              value="problem"
              className="w-full data-[state=active]:bg-muted"
            >
              <BookOpen />
            </TabsTrigger>
            <TabsTrigger
              value="solution"
              className="w-full data-[state=active]:bg-muted"
            >
              <Code />
            </TabsTrigger>
            <TabsTrigger
              value="submission"
              className="w-full data-[state=active]:bg-muted"
            >
              <NotebookText />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="problem">
            <Card className="h-[75vh] overflow-y-auto ">
              {problem ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center mb-2">
                      <div className="text-2xl font-extrabold">
                        {problem.name}
                      </div>
                      <Badge className="text-white bg-green-600 ml-auto">
                        {problem.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <ProblemDesc />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {problem.testcases.map((testcase, index) => {
                      return (
                        <TestCaseBlock
                          key={testcase.id}
                          testcase={testcase}
                          index={index + 1}
                          problemStatus={problemStatus?.[index]}
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
          </TabsContent>
          <TabsContent value="solution">
            <Card className="h-[75vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
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
          </TabsContent>
          <TabsContent value="submission">
            <Card className="h-[75vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
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
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle className="hidden md:block w-1 bg-muted hover:bg-muted-foreground -z-10" />
      <ResizablePanel minSize={20} defaultSize={45} className="hidden md:block">
        <div className="h-9"></div>
        <CodeEditor
          placeholderCode={placeholderCode}
          handleTestcaseSubmission={handleTestcaseSubmission}
          isPending={isPending}
          problemStatus={problemStatus}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
