import { env } from "next-runtime-env";
import { Solution } from "./types";

export async function getSolutionsByProblemId(problemID: string) {
  const res = await fetch(
    `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/solutions/problem/${problemID}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch solutions: ${res.statusText} for problem ID ${problemID}`,
    );
  }

  const solutions = (await res.json()) as { data: Solution[] };
  return solutions;
}
