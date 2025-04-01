"use client";

import Editor from "@/components/Editor";
import ProblemDetails from "@/components/ProblemDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useMobile } from "@/hooks/isMobile";
import { motion } from "motion/react";
import { useState } from "react";

export default function SingleProblemPage() {
  const [code, setCode] = useState("// Write your solution here\n\n");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSubmitMode, setIsSubmitMode] = useState(false);
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      expected: "[0,1]",
      output: "[0,1]",
      passed: true,
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      expected: "[1,2]",
      output: "[1,2]",
      passed: true,
    },
    {
      id: 3,
      input: "nums = [3,3], target = 6",
      expected: "[0,1]",
      output: "[0,1]",
      passed: true,
    },
  ]);
  const [consoleLogs, setConsoleLogs] = useState([
    "Running test case 1...",
    "> twoSum([2,7,11,15], 9)",
    "< [0,1]",
    "✓ Test case 1 passed",
    "",
    "Running test case 2...",
    "> twoSum([3,2,4], 6)",
    "< [1,2]",
    "✓ Test case 2 passed",
    "",
    "Running test case 3...",
    "> twoSum([3,3], 6)",
    "< [0,1]",
    "✓ Test case 3 passed",
  ]);
  const isMobile = useMobile();

  function toggleConsole() {
    setIsConsoleOpen(!isConsoleOpen);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}

      <div className="container mx-auto flex flex-1 flex-col px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold sm:text-2xl">Two Sum</h1>
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            >
              Medium
            </Badge>
          </div>

          <div className="flex gap-2">
            {isMobile && (
              <>
                <Button variant="outline" size="sm">
                  Run
                </Button>
                <Button size="sm">Submit</Button>
              </>
            )}
          </div>
        </div>

        {isMobile ? (
          <ProblemDetails />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[calc(100vh-12rem)] rounded-lg border"
            >
              <ResizablePanel defaultSize={40} minSize={30}>
                <ProblemDetails />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={60} minSize={30}>
                <Editor
                  code={code}
                  setCode={setCode}
                  isConsoleOpen={isConsoleOpen}
                  toggleConsole={toggleConsole}
                  testCases={testCases}
                  consoleLogs={consoleLogs}
                  isSubmitMode={isSubmitMode}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
        )}
      </div>
    </div>
  );
}
