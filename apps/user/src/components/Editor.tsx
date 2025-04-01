"use client";

import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useTransition,
} from "react";
import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Button } from "./ui/button";
import {
  Dot,
  CheckCheck,
  Copy,
  Settings,
  RotateCcw,
  ChevronUp,
  Send,
  Terminal,
  Minus,
  Plus,
} from "lucide-react";
import { Tabs, TabsList } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { AnimatePresence, motion } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface SettingItemProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function CodeEditor({
  problemName,
  placeholderCode = "Hello",
  isConsoleOpen,
  toggleConsole,
  testCases,
  consoleLogs,
  isSubmitMode,
}: {
  code: string;
  problemName?: string;
  placeholderCode?: string;
  setCode: Dispatch<SetStateAction<string>>;
  isConsoleOpen: boolean;
  toggleConsole: () => void;
  testCases: {
    id: number;
    input: string;
    expected: string;
    output: string;
    passed: boolean;
  }[];
  consoleLogs: string[];
  isSubmitMode: boolean;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useOnClickOutside(consoleRef, () => {
    setTimeout(() => {
      if (isConsoleOpen) {
        toggleConsole();
      }
    }, 100);
  });

  const [value, setValue] = useState<string>(
    window.localStorage.getItem(`${problemName}-code`) || placeholderCode
  );
  const [codeSaved, setCodeSaved] = useState<boolean>(false);
  const [isCodeSavePending, startCodeSaveTransition] = useTransition();
  const [fontSize, setFontSize] = useState<number>(16);
  const [tabSpace, setTabSpace] = useState<number>(2);
  const [lineHeight, setLineHeight] = useState<number>(23);
  const [intellisenseActive, setIntellisenseActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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
    <div className="relative pt-2">
      <Tabs className="py-2 ">
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
              <p className={`text-xs -ml-1`}>Unsaved</p>
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
              <PopoverContent align="end">
                <div className="space-y-3.5">
                  <NumberSetting
                    label="Font Size"
                    value={fontSize}
                    min={8}
                    max={32}
                    onChange={setFontSize}
                  />
                  <NumberSetting
                    label="Tab Space"
                    value={tabSpace}
                    min={1}
                    max={8}
                    onChange={setTabSpace}
                  />
                  <NumberSetting
                    label="Line Height"
                    value={lineHeight}
                    min={10}
                    max={30}
                    step={1}
                    onChange={setLineHeight}
                  />
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wrap-text" className="text-sm font-medium">
                      Intellisense
                    </Label>
                    <Switch
                      id="wrap-text"
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
      <Editor
        className="rounded-xl overflow-hidden z-0 "
        value={value}
        height="75vh"
        theme="custom"
        defaultLanguage="javascript"
        onChange={(value) => setValue(value!)}
        onMount={handleMount}
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
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          copyWithSyntaxHighlighting: true,
          renderLineHighlightOnlyWhenFocus: true,
          overviewRulerLanes: 0,
          guides: { bracketPairs: false, indentation: false },
          renderLineHighlight: "all",
          scrollBeyondLastLine: false,
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
        {isConsoleOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "40%", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className=" absolute bottom-0 w-full"
            ref={consoleRef}
          >
            <div className="flex h-8 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-xs font-medium">Console</h3>
                {isSubmitMode ? (
                  <Badge className="px-2 py-0 text-xs">Passed</Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="px-2 py-0 text-xs"
                  ></Badge>
                )}
              </div>
            </div>

            <ScrollArea className="h-[calc(100%-32px)]">
              <div className="p-3">
                {/* <div className="space-y-2">
                  {testCases.map((testCase) => (
                    <div key={testCase.id} className="rounded-md border p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Test Case {testCase.id}
                        </span>
                        <Badge className="px-2 py-0 text-xs">
                          {testCase.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="grid gap-1 text-xs">
                        <div className="grid grid-cols-[70px_1fr]">
                          <span className="font-mono text-muted-foreground">
                            Input:
                          </span>
                          <span className="font-mono">{testCase.input}</span>
                        </div>
                        <div className="grid grid-cols-[70px_1fr]">
                          <span className="font-mono text-muted-foreground">
                            Expected:
                          </span>
                          <span className="font-mono">{testCase.expected}</span>
                        </div>
                        <div className="grid grid-cols-[70px_1fr]">
                          <span className="font-mono text-muted-foreground">
                            Output:
                          </span>
                          <span className="font-mono">{testCase.output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}

                {consoleLogs.length > 0 && (
                  <div className="rounded-md bg-black p-2 font-mono text-xs text-white">
                    {consoleLogs.map((log, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2 p-4 absolute bottom-0 w-full bg-background">
        <Button
          size="lg"
          className="mr-auto"
          onClick={(e) => {
            e.stopPropagation();
            toggleConsole();
          }}
        >
          Console
          <ChevronUp
            className={` ${isConsoleOpen ? "transition-all duration-400 ease-in-out rotate-180" : "transition-all duration-400 ease-in-out"} `}
            size="14"
          />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-primary"
          type="submit"
          // onClick={handleRun}
          // disabled={isPending}
        >
          Run
        </Button>
        <Button
          size="lg"
          type="submit"
          // onClick={handleSubmit}
          // disabled={isPending}
        >
          Submit
          <Send className="ml-2" size="14" />
        </Button>
      </div>
    </div>
  );
}

function NumberSetting({
  label,
  value,
  min = 1,
  max = 100,
  step = 1,
  onChange,
}: SettingItemProps) {
  const increment = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="text-sm font-medium"
      >
        {label}
      </Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={decrement}
          disabled={value <= min}
        >
          <Minus className="h-3 w-3" />
          <span className="sr-only">Decrease {label}</span>
        </Button>
        <div className="flex h-8 w-10 items-center justify-center border border-x-0 border-input bg-background text-sm tabular-nums">
          {value}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={increment}
          disabled={value >= max}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Increase {label}</span>
        </Button>
      </div>
    </div>
  );
}
