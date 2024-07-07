import DuplicateInteger from "./problem-ui/DuplicateInteger";
import IsAnagram from "./problem-ui/isAnagram";

export function unescapeCode(code: string): string {
  return code
    .replace(/\\r\\n/g, "\n") // Replace \r\n with actual newline
    .replace(/\\\//g, "/") // Replace \/ with /
    .replace(/\\n/g, "\n") // Replace \n with actual newline
    .replace(/\\t/g, "\t") // Replace \t with actual tab
    .replace(/\\'/g, "'") // Replace \' with '
    .replace(/\\"/g, '"') // Replace \" with "
    .replace(/\\\\/g, "\\"); // Replace \\ with \
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

export const problemComponents: Record<string, () => JSX.Element> = {
  "Duplicate Integer": DuplicateInteger,
  "Is Anagram": IsAnagram,
};
