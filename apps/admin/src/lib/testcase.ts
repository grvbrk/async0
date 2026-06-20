import { env } from "next-runtime-env";
import { Testcase } from "./types";

export async function getTestcasesByProblemId(problemID: string) {
  const res = await fetch(
    `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/testcases/problem/${problemID}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch testcases: ${res.statusText} for problem ID ${problemID}`,
    );
  }

  const testcases = (await res.json()) as { data: Testcase[] };
  return testcases;
}
