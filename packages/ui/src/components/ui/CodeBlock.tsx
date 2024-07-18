import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyTextButton } from "./CopyTextButton";

export default function CodeBlock({
  code,
  theme,
}: {
  code: string;
  theme: string;
}) {
  return (
    <div className={`relative rounded-lg overflow-hidden `}>
      <CopyTextButton text={code} className="absolute top-1 right-0" />
      <SyntaxHighlighter
        language={"javascript"}
        style={theme === "dark" ? vscDarkPlus : prism}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
