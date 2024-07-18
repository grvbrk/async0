import { ComponentType } from "react";
import DuplicateInteger from "./problem-ui/DuplicateInteger";
import IsAnagram from "./problem-ui/isAnagram";

export function unescapeCode(code: string | undefined): string | void {
  if (code === undefined) return;
  else {
    return code
      .replace(/\\r\\n/g, "\n")
      .replace(/\\\//g, "/")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

export function escapeCode(code: string): string {
  return code
    .replace(/\\/g, "\\\\") // Replace \ with \\
    .replace(/"/g, '\\"') // Replace " with \"
    .replace(/'/g, "\\'") // Replace ' with \'
    .replace(/\n/g, "\\n") // Replace newline with \n
    .replace(/\r/g, "\\r") // Replace carriage return with \r
    .replace(/\t/g, "\\t") // Replace tab with \t
    .replace(/\//g, "\\/"); // Replace / with \/
}

export const problemDescriptions: Record<string, ComponentType<any>> = {
  "Duplicate Integer": DuplicateInteger,
  "Is Anagram": IsAnagram,
};

export type judge0TokenResponseType = {
  status: string;
  value: judge0ValueKeyType;
};

export type judge0ValueKeyType = {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  output?: string;
};
