"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Send } from "lucide-react";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type CodeEditorPropsType = {
  placeholderCode: string;
  handleTestcaseSubmission: (code: string) => void;
};

export default function CodeEditor({
  placeholderCode,
  handleTestcaseSubmission,
}: CodeEditorPropsType) {
  const { data: session } = useSession();
  const [value, setValue] = useState<string>("");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, []>>({
    submissions: [],
  });

  function handleMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }

  function showValue() {
    if (editorRef.current) {
      setValue(editorRef.current.getValue());
    }
  }

  return (
    <>
      <div className="p-4 mt-2">
        <Card className="relative">
          <Editor
            className="rounded-xl overflow-hidden"
            height="75vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={value}
            defaultValue={placeholderCode}
            onChange={(value) => setValue(value!)}
            onMount={handleMount}
            options={{
              fontSize: 14,
              lineNumbers: "on",
              minimap: { enabled: false },
              padding: { top: 20 },
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              wordBasedSuggestions: "currentDocument",
            }}
          />
        </Card>
        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="lg"
            className="border border-black"
            type="submit"
            onClick={(e) => {
              handleTestcaseSubmission(value);
              if (!session) {
                toast.error("You need to login first");
                e.preventDefault();
              }
            }}
          >
            Run
          </Button>
          <Button
            size="lg"
            type="submit"
            onClick={(e) => {
              handleTestcaseSubmission(value);
              if (!session) {
                toast.error("You need to login first");
                e.preventDefault();
              }
            }}
          >
            Submit
            <Send className="ml-2" size="14" />
          </Button>
        </div>
      </div>
    </>
  );
}
