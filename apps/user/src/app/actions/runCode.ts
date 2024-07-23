import { cache } from "react";

export const runCode = cache((userFunction: string) => {
  const code = `
    ${userFunction}
    `.trim();
  return {
    language_id: 63,
    source_code: code,
  };
});
