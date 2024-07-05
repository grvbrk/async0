"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Editor, { Monaco } from "@monaco-editor/react";
import { ChevronUp, Send } from "lucide-react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type CodeEditorPropsType = {
  placeholderCode: string;
  handleTestcaseSubmission: (code: string) => void;
  isPending: boolean;
  problemStatus: any;
};

export default function CodeEditor({
  placeholderCode,
  handleTestcaseSubmission,
  isPending,
  problemStatus,
}: CodeEditorPropsType) {
  const { data: session } = useSession();
  const [value, setValue] = useState<string>("");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    editor.focus();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  }

  function handleRunOrSubmit() {
    if (!session) {
      toast.error("You need to login first");
      return;
    }
    handleTestcaseSubmission(value);
    setShowConsole(true);
    setShowMessages(true);
  }

  function toggleConsole() {
    setShowConsole(!showConsole);
    if (showConsole) {
      setShowMessages(false);
    }
  }
  return (
    <>
      <div className="p-4 mt-2">
        <Card className="relative ">
          <Editor
            className="rounded-md overflow-hidden z-10"
            height="75vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={value}
            defaultValue={placeholderCode}
            onChange={(value) => setValue(value!)}
            onMount={handleMount}
            options={{
              fontSize: 16,
              lineNumbers: "on",
              lineHeight: 23,
              minimap: { enabled: false },
              padding: { top: 20 },
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
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
              formatOnPaste: true,
              formatOnType: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              copyWithSyntaxHighlighting: true,
            }}
          />
          {showConsole && (
            <Card className="absolute bottom-0 h-2/5 w-full rounded-md  transition-all duration-400 ease-in-out overflow-y-auto box-border border border-gray-600 bg-grey-900 font-fira-code z-50">
              <CardContent className="mt-4">
                <ShowResults
                  isPending={isPending}
                  problemStatus={problemStatus}
                  showMessages={showMessages}
                />
              </CardContent>
            </Card>
          )}
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
            className="border border-black"
            type="submit"
            onClick={handleRunOrSubmit}
            disabled={isPending}
          >
            Run
          </Button>
          <Button
            size="lg"
            type="submit"
            onClick={handleRunOrSubmit}
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

function ConsoleData({ problem, index }: { problem: any; index: number }) {
  return (
    <>
      <h1 className="text-md text-white ">
        <span>
          {problem.value.status.id === 3 ? (
            <span className="text-green-400 font-bold text-md">
              {`~ testcase-${index} PASS `}
              <span>{`${problem.value.time * 1000}ms `}</span>
            </span>
          ) : problem.value.status.id === 4 ? (
            <span className="text-red-500 font-bold text-md">
              {`~ testcase-${index} FAIL `}
              <span>{`${problem.value.time * 1000}ms `}</span>
            </span>
          ) : [5, 6, 7, 8, 9, 10, 11, 12].includes(problem.value.status.id) ? (
            <>
              <span className="text-yellow-600 font-bold text-md ">
                {`~ testcase-${index} TLE `}
                <span className="text-red-500">{`${problem.value.time * 1000}ms `}</span>
              </span>
              {/* <pre className=""> {problem.value.stderr}</pre> */}
            </>
          ) : (
            ""
          )}
        </span>
      </h1>
    </>
  );
}

function ShowResults({
  isPending,
  problemStatus,
  showMessages,
}: {
  isPending: boolean;
  problemStatus: any;
  showMessages: boolean;
}) {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  useEffect(() => {
    if (showMessages) {
      console.log("messages true");
      setShowFirstMessage(false);
      setShowSecondMessage(false);
      const timer1 = setTimeout(() => setShowFirstMessage(true), 1000);
      const timer2 = setTimeout(() => setShowSecondMessage(true), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
    console.log("messages false");
  }, [showMessages]);

  if (!showMessages) {
    return (
      <>
        {!isPending &&
          problemStatus.map((problem: any, index: number) => (
            <ConsoleData key={index} problem={problem} index={index} />
          ))}
      </>
    );
  }

  return (
    <>
      {showFirstMessage && <h1 className="text-white">~ Running Tests...</h1>}
      {showSecondMessage && (
        <h1 className="text-white">~ Gathering Results...</h1>
      )}
      {!isPending &&
        problemStatus.map((problem: any, index: number) => {
          return <ConsoleData problem={problem} index={index} />;
        })}
    </>
  );
}
