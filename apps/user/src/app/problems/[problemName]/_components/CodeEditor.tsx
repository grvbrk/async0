"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import Editor, { Monaco } from "@monaco-editor/react";
import {
  CheckCheck,
  ChevronUp,
  Copy,
  RotateCcw,
  Send,
  Settings,
} from "lucide-react";
import { editor } from "monaco-editor";
import { Dispatch, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import { Switch } from "@repo/ui/components/ui/switch";
import { Tabs, TabsList } from "@repo/ui/components/ui/tabs";
import Counter from "./Counter";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

type CodeEditorPropsType = {
  placeholderCode: string;
  handleTestcaseSubmission: (code: string, run: boolean) => void;
  isPending: boolean;
  problemSubmitStatus: any;
  setProblemSubmitStatus: Dispatch<any>;
  problemRunStatus: any;
  setProblemRunStatus: Dispatch<any>;
  totaltestcases: number;
  passedtestcases: number;
};

export default function CodeEditor({
  placeholderCode,
  handleTestcaseSubmission,
  isPending,
  problemSubmitStatus,
  setProblemSubmitStatus,
  problemRunStatus,
  setProblemRunStatus,
  totaltestcases,
  passedtestcases,
}: CodeEditorPropsType) {
  const { data: session } = useSession();
  const [value, setValue] = useState<string>(placeholderCode);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [showRunData, setShowRunData] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [tabSpace, setTabSpace] = useState<number>(2);
  const [lineHeight, setLineHeight] = useState<number>(23);
  const [intellisenseActive, setIntellisenseActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  }

  function handleBeforeMount(monaco: Monaco) {
    monaco.editor.defineTheme("custom", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#080c16",
        "editor.lineHighlightBackground": "#252526",
        "editorLineNumber.activeForeground": "#FFD700",
      },
    });
  }

  function handleSubmit() {
    if (!session) {
      toast.error("You need to login first");
      return;
    }
    handleTestcaseSubmission(value, false);
    setProblemRunStatus({});
    setShowConsole(true);
    setShowMessages(true);
    setShowRunData(false);
  }

  function handleRun() {
    if (!session) {
      toast.error("You need to login first");
      return;
    }
    handleTestcaseSubmission(value, true);
    setProblemSubmitStatus([]);
    setShowConsole(true);
    setShowMessages(true);
    setShowRunData(true);
  }

  function toggleConsole() {
    if (showConsole) {
      setShowConsole(false);
      setTimeout(() => setShowMessages(false), 300);
    } else {
      setShowConsole(true);
    }
  }

  function handleCodeDownload() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    // const element = document.createElement("a");
    // const file = new Blob([value], { type: "text/plain" });
    // element.href = URL.createObjectURL(file);
    // element.download = "code.txt";
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
  }

  return (
    <>
      <div className="px-4 pt-2">
        <Tabs defaultValue="problem" className="py-2 ">
          <TabsList className="w-full flex items-center bg-transparent ">
            <div className="ml-auto">
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleCodeDownload}
                className="hover:bg-transparent"
              >
                {copied ? (
                  <CheckCheck className="h-5 w-5  " />
                ) : (
                  <Copy className="h-5 w-5 " />
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent"
                  >
                    <Settings className="h-5 w-5 " />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit text-sm " sideOffset={8}>
                  <div className="flex items-center mb-2">
                    <p className="font-medium leading-none">Font Size: </p>
                    <Counter value={fontSize} setValue={setFontSize}>
                      {fontSize}
                    </Counter>
                  </div>

                  <div className="flex items-center mb-2">
                    <p className="font-medium leading-none">Tab Space: </p>
                    <Counter value={tabSpace} setValue={setTabSpace}>
                      {tabSpace}
                    </Counter>
                  </div>

                  <div className="flex items-center mb-2">
                    <p className="font-medium leading-none">Line Height: </p>
                    <Counter value={lineHeight} setValue={setLineHeight}>
                      {lineHeight}
                    </Counter>
                  </div>

                  <div className="flex items-center">
                    <p className="font-medium leading-none">Intellisense: </p>
                    <div className="flex justify-center items-center  w-[90px]">
                      <Switch
                        checked={intellisenseActive}
                        onCheckedChange={setIntellisenseActive}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  setValue(placeholderCode);
                }}
                className="hover:bg-transparent"
              >
                <RotateCcw className="h-5 w-5 " />
              </Button>
            </div>
          </TabsList>
        </Tabs>
        <Card className="relative">
          <Editor
            className=" rounded-xl overflow-hidden z-0"
            height="75vh"
            theme="custom"
            defaultLanguage="javascript"
            value={value}
            // defaultValue={placeholderCode}
            onChange={(value) => setValue(value!)}
            onMount={handleMount}
            beforeMount={handleBeforeMount}
            options={{
              fontSize: fontSize,
              tabSize: tabSpace,
              lineNumbers: "on",
              lineHeight: lineHeight,
              minimap: { enabled: false },
              padding: { top: 40 },
              multiCursorModifier: "alt",
              cursorBlinking: "smooth",
              mouseWheelScrollSensitivity: 3,
              find: {
                cursorMoveOnType: true,
                addExtraSpaceOnTop: true,
                loop: true,
              },
              smoothScrolling: true,
              tabCompletion: "on",
              // formatOnPaste: true,
              // formatOnType: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              copyWithSyntaxHighlighting: true,
              renderLineHighlightOnlyWhenFocus: true,
              overviewRulerLanes: 0,
              guides: { bracketPairs: false, indentation: false },
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              // fontLigatures: "true",
              // fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              quickSuggestions: intellisenseActive,
              scrollbar: {
                // vertical: "hidden",
                handleMouseWheel: true,
                alwaysConsumeMouseWheel: false,
                verticalScrollbarSize: 10,
                verticalHasArrows: true,
                horizontal: "auto",
                horizontalScrollbarSize: 10,
                horizontalHasArrows: true,
              },
            }}
          />
          <AnimatePresence>
            {showConsole && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "100%", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="absolute bottom-0 w-full z-50"
              >
                <Card className="absolute bottom-0 h-2/5 w-full rounded-md overflow-y-auto border-y-2 border-gray-600 bg-black font-ubuntu-mono text-lg leading-tight z-50 ">
                  <CardContent className="mt-4">
                    <ShowResults
                      isPending={isPending}
                      problemSubmitStatus={problemSubmitStatus}
                      problemRunStatus={problemRunStatus}
                      showMessages={showMessages}
                      showRunData={showRunData}
                      totaltestcases={totaltestcases}
                      passedtestcases={passedtestcases}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="lg" className="mr-auto" onClick={toggleConsole}>
            Console
            <ChevronUp
              className={`ml-2 ${showConsole ? "transition-all duration-400 ease-in-out rotate-180" : "transition-all duration-400 ease-in-out"}`}
              size="14"
            />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary"
            type="submit"
            onClick={handleRun}
            disabled={isPending}
          >
            Run
          </Button>
          <Button
            size="lg"
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
          >
            Submit
            <Send className="ml-2" size="14" />
          </Button>
        </div>
      </div>
    </>
  );
}

function ShowResults({
  isPending,
  problemSubmitStatus,
  problemRunStatus,
  showMessages,
  showRunData,
  totaltestcases,
  passedtestcases,
}: {
  isPending: boolean;
  problemSubmitStatus: any;
  problemRunStatus: any;
  showMessages: boolean;
  showRunData: boolean;
  totaltestcases: number;
  passedtestcases: number;
}) {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  useEffect(() => {
    if (showMessages) {
      setShowFirstMessage(false);
      setShowSecondMessage(false);
      const timer1 = setTimeout(() => setShowFirstMessage(true), 1000);
      const timer2 = setTimeout(() => setShowSecondMessage(true), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showMessages]);

  if (!showMessages) {
    return (
      <>
        {!isPending && showRunData ? (
          <ShowRunConsole problem={problemRunStatus} />
        ) : (
          problemSubmitStatus.map((problem: any, index: number) => {
            return (
              <ConsoleData
                key={index}
                problem={problem}
                index={index}
                error={index === problemSubmitStatus.length - 1}
              />
            );
          })
        )}
      </>
    );
  }

  return (
    <>
      {showFirstMessage && (
        <h1 className="text-gray-300">~ Running Tests...</h1>
      )}
      {showSecondMessage && (
        <h1 className="text-gray-300">~ Gathering Results...</h1>
      )}
      <div className="my-2">
        {!isPending && showRunData ? (
          <ShowRunConsole problem={problemRunStatus} />
        ) : (
          problemSubmitStatus.map((problem: any, index: number) => {
            return (
              <ConsoleData
                problem={problem}
                index={index}
                key={index}
                error={index === problemSubmitStatus.length - 1}
              />
            );
          })
        )}
      </div>
      {!isPending && !showRunData && !showMessages && (
        <div
          className={`${passedtestcases === totaltestcases ? "text-green-400" : passedtestcases === 0 ? "text-red-500" : "text-yellow-600 "} font-bold text-md`}
        >{`Testcases passed: ${passedtestcases}/${totaltestcases}`}</div>
      )}
    </>
  );
}

function ShowRunConsole(problem: any) {
  return (
    <>
      <pre className="text-sm text-muted-foreground mt-2 text-wrap">
        {[5, 7, 8, 9, 10, 11, 12].includes(problem.problem.status.id)
          ? problem.problem.stderr.startsWith("run: ")
            ? "Either output too big or time limit exceeded"
            : `Output: ${problem.problem.stdout}`
          : problem.problem.stdout
            ? `Output: ${problem.problem.stdout}`
            : "There are no logs to show. Consider adding 'console.log' statements."}
      </pre>
    </>
  );
}

function ConsoleData({
  problem,
  index,
  error,
}: {
  problem: any;
  index?: number;
  error?: boolean;
}) {
  return (
    <>
      <div className="text-md">
        <span>
          {problem.value.status.id === 3 ? (
            <div className="text-green-400 font-bold text-md">
              {`~ testcase-${index} PASS `}
              <span>{`${(problem.value.time * 1000).toFixed(0)}ms `}</span>
            </div>
          ) : problem.value.status.id === 4 ? (
            <>
              <div className="text-red-500 font-bold text-md">
                {`~ testcase-${index} FAIL `}
                <span>{`${(problem.value.time * 1000).toFixed(0)}ms `}</span>
              </div>

              {error && problem.value.stdout && (
                <pre className="text-sm text-muted-foreground">
                  {`Your Output: ${problem.value.stdout}`}
                </pre>
              )}

              {error && problem.value.stderr && (
                <pre className="text-sm text-muted-foreground">
                  {`Your Output: ${problem.value.stderr}`}
                </pre>
              )}
            </>
          ) : (
            <>
              <div className="text-yellow-600 font-bold text-md">
                {`~ testcase-${index} TLE `}
                <span className="text-red-500">{`${(problem.value.time * 1000).toFixed(0)}ms `}</span>
              </div>

              {(error &&
                problem.value.stderr &&
                problem.value.stderr.startsWith("run: ")) ||
              problem.value.status.id === 5 ? (
                <pre className="text-sm text-muted-foreground text-wrap">
                  Error: Time Limit Exceeded. Please check if the function isn't
                  running into an infinite loop.
                </pre>
              ) : (
                <pre className="text-sm text-muted-foreground">
                  {`Error: ${problem.value.stderr}`}
                </pre>
              )}
            </>
          )}
        </span>
      </div>
    </>
  );
}
