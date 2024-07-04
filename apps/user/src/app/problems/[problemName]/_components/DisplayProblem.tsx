"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Code, NotebookText } from "lucide-react";
import CodeEditor from "../CodeEditor";
import TestCaseBlock from "./TestCaseBlock";
import { Difficulty } from "@repo/db";
import { useState } from "react";
import getBatchSubmission from "@/driverCode/Duplicate-Integer";
import axios from "axios";

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
  const [testcaseStatus, setTestcaseStatus] = useState<unknown[]>([]);
  const [placeholderCode, setPlaceholderCode] = useState<string>(
    "function hasDuplicate(nums){\n\t// todo\n};"
  );

  async function handleTestcaseSubmission(code: string) {
    setPlaceholderCode(code);
    const batchSubmission = getBatchSubmission(code, problem?.testcases || []);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        JSON.stringify(batchSubmission),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 && response.statusText === "Created") {
        const tokens: string[] = response.data.map((data: any) => {
          return data.token;
        });

        const responses = await Promise.allSettled(
          tokens.map(checkPromiseStatus)
        );

        setTestcaseStatus(responses);
        console.log("RESPONSES", responses);
      }
    } catch (error) {
      console.log("Error submitting code", error);
    }
  }

  function checkPromiseStatus(token: string) {
    return new Promise((resolve) => {
      async function checkStatus() {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`
        );
        if ([3, 4, 5].includes(response.data.status.id)) {
          clearInterval(intervalId);
          resolve(response.data);
        }
      }

      const intervalId = setInterval(checkStatus, 200);
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
            <Card className="h-[75vh] overflow-y-auto">
              {problem ? (
                <>
                  <CardHeader>
                    <CardTitle className="pb-2">{problem.name}</CardTitle>
                    <CardDescription>{/* TBD... */}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {problem.testcases.map((testcase, index) => {
                      return (
                        <TestCaseBlock
                          key={testcase.id}
                          testcase={testcase}
                          index={index + 1}
                          testcaseStatus={testcaseStatus[index]}
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
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
