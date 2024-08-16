"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Editor, Monaco } from "@monaco-editor/react";
import {
  CheckCheck,
  ChevronUp,
  Copy,
  Dot,
  RotateCcw,
  Send,
  Settings,
} from "lucide-react";
import { editor } from "monaco-editor";
import {
  Dispatch,
  SetStateAction,
  useTransition,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { judge0ValueKeyType } from "@repo/common";

type CodeEditorPropsType = {
  placeholderCode: string;
  problemName: string;
  handleTestcaseSubmission: (
    userFunction: string,
    run: boolean
  ) => Promise<void>;
  isPending: boolean;
  problemSubmitStatus: judge0ValueKeyType[];
  setProblemSubmitStatus: Dispatch<SetStateAction<judge0ValueKeyType[]>>;
  problemRunStatus: judge0ValueKeyType;
  totaltestcases: number;
  passedtestcases: number;
};

export default function CodeEditor({
  placeholderCode,
  problemName,
  handleTestcaseSubmission,
  isPending,
  problemSubmitStatus,
  setProblemSubmitStatus,
  problemRunStatus,
  totaltestcases,
  passedtestcases,
}: CodeEditorPropsType) {
  const { data: session } = useSession();
  const [value, setValue] = useState<string>(
    window.localStorage.getItem(`${problemName}-code`) || placeholderCode
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [showRunData, setShowRunData] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [tabSpace, setTabSpace] = useState<number>(2);
  const [lineHeight, setLineHeight] = useState<number>(23);
  const [intellisenseActive, setIntellisenseActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [codeSaved, setCodeSaved] = useState<boolean>(false);
  const [isCodeSavePending, startCodeSaveTransition] = useTransition();

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      startCodeSaveTransition(() => {
        editor.getAction("editor.action.formatDocument")?.run();
        if (window) {
          window.localStorage.setItem(`${problemName}-code`, editor.getValue());
        }
        setCodeSaved(true);
      });
    });
  }

  useEffect(() => {
    let disposable: any;

    if (editorRef.current) {
      disposable = editorRef.current.onDidChangeModelContent(() => {
        if (codeSaved) {
          setCodeSaved(false);
        }
      });
    }

    return () => {
      disposable?.dispose();
    };
  }, [codeSaved]);

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

  function handleRun() {
    if (!session) {
      toast.error("You need to login first");
      return;
    }
    handleTestcaseSubmission(value, true);
    setShowConsole(true);
    setShowRunData(true);
    setShowMessages(!showMessages);
    setProblemSubmitStatus([]);
  }

  function handleSubmit() {
    if (!session) {
      toast.error("You need to login first");
      return;
    }

    handleTestcaseSubmission(value, false);
    setShowConsole(true);
    setShowRunData(false);
    setShowMessages(!showMessages);
  }

  function toggleConsole() {
    if (showConsole) {
      setShowConsole(false);
      setShowMessages(false);
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
          <TabsList className="w-full flex items-center bg-transparent">
            <div className="flex items-center">
              <Dot
                className={`${codeSaved && "text-green-600"} ${isCodeSavePending && "text-yellow-600"}`}
              />
              {codeSaved ? (
                <p
                  className={`${codeSaved && "text-green-600"} ${isCodeSavePending && "text-yellow-600"} text-xs italic -ml-1`}
                >
                  Saved
                </p>
              ) : (
                <p className={`text-xs italic -ml-1`}>Unsaved</p>
              )}
              {isCodeSavePending && (
                <p
                  className={` ${codeSaved && "text-green-600"} ${isCodeSavePending && "text-yellow-600"} text-xs italic -ml-1`}
                >
                  Saving...
                </p>
              )}
            </div>

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
                <Card
                  className="absolute bottom-0 h-2/5 w-full rounded-md overflow-y-auto border-y-2 border-gray-600 bg-black font-ubuntu-mono text-lg leading-tight z-50"
                  onClick={(e) => e.stopPropagation()}
                >
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
          <Button size="lg" className="mr-auto " onClick={toggleConsole}>
            Console
            <ChevronUp
              className={`ml-2 ${showConsole ? "transition-all duration-400 ease-in-out rotate-180" : "transition-all duration-400 ease-in-out"} `}
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
  problemSubmitStatus: judge0ValueKeyType[];
  problemRunStatus: judge0ValueKeyType;
  showMessages: boolean;
  showRunData: boolean;
  totaltestcases: number;
  passedtestcases: number;
}) {
  const [showFirstMessage, setShowFirstMessage] = useState<boolean>(false);
  const [showSecondMessage, setShowSecondMessage] = useState<boolean>(false);
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);

  useEffect(() => {
    if (showMessages) {
      setShowFirstMessage(false);
      setShowSecondMessage(false);
      setShowFinalMessage(false);
      const timer1 = setTimeout(() => setShowFirstMessage(true), 1000);
      const timer2 = setTimeout(() => setShowSecondMessage(true), 2000);
      const timer3 = setTimeout(() => setShowFinalMessage(true), 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [showMessages]);

  return (
    <>
      {showFirstMessage && (
        <h1 className="text-gray-300">~ Running Tests...</h1>
      )}
      {showSecondMessage && (
        <h1 className="text-gray-300">~ Gathering Results...</h1>
      )}
      {showFinalMessage && (
        <div className="my-2">
          {!isPending ? (
            showRunData ? (
              <ShowRunConsole problemRunStatus={problemRunStatus} />
            ) : (
              <div>
                {problemSubmitStatus.map(
                  (problem: judge0ValueKeyType, index: number) => {
                    return (
                      <ShowSubmitConsole
                        key={index}
                        problem={problem}
                        index={index}
                      />
                    );
                  }
                )}
                {problemSubmitStatus[0].status.id != 69 && (
                  <div
                    className={`mt-2 ${passedtestcases === totaltestcases ? "text-green-400" : passedtestcases === 0 ? "text-red-500" : "text-yellow-600 "} font-bold text-md`}
                  >
                    {`Testcases passed: ${passedtestcases}/${totaltestcases}`}
                  </div>
                )}
              </div>
            )
          ) : null}
        </div>
      )}
    </>
  );
}

function ShowRunConsole({
  problemRunStatus,
}: {
  problemRunStatus: judge0ValueKeyType;
}) {
  return (
    <>
      <pre className="text-sm text-muted-foreground mt-2 text-wrap">
        {[5, 7, 8, 9, 10, 11, 12].includes(problemRunStatus.status.id)
          ? problemRunStatus.stderr
            ? `Error: ${problemRunStatus.stderr}`
            : "Time limit exceeded"
          : problemRunStatus.stdout
            ? `Output: ${problemRunStatus.stdout}`
            : "There are no logs to show. Consider adding 'console.log' statements."}
      </pre>
    </>
  );
}

function ShowSubmitConsole({
  problem,
  index,
}: {
  problem: judge0ValueKeyType;
  index: number;
}) {
  const getStatusDisplay = () => {
    switch (problem.status.id) {
      case 3:
        return (
          <div className="text-green-400 font-bold text-md">{`~ testcase-${index} PASS`}</div>
        );
      case 4:
        return (
          <>
            <div className="text-red-500 font-bold text-md">{`~ testcase-${index} FAIL`}</div>
            {problem.stdout && (
              <pre className="text-sm text-muted-foreground">{`Output: ${problem.stdout}`}</pre>
            )}
            {problem.stderr && (
              <pre className="text-sm text-muted-foreground">{`Error: ${problem.stderr}`}</pre>
            )}
          </>
        );
      default:
        return (
          <>
            <div className="text-yellow-600 font-bold text-md">{`~ testcase-${index} TLE`}</div>
            {problem.stdout ? (
              <pre className="text-sm text-muted-foreground">{`Output: ${problem.stdout}`}</pre>
            ) : problem.stderr ? (
              <pre className="text-sm text-muted-foreground">{`Error: ${problem.stderr}`}</pre>
            ) : (
              <pre className="text-sm text-muted-foreground">{`Error: Time Limit Exceeded`}</pre>
            )}
          </>
        );
    }
  };

  return <div>{getStatusDisplay()}</div>;
}
