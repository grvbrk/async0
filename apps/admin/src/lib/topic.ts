import { Topic } from "@/lib/types";
import { env } from "next-runtime-env";

export async function getAllTopics(): Promise<{ data: Topic[] }> {
  const res = await fetch(`${env("NEXT_PUBLIC_BACKEND_URL")}/admin/topics`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch topics: ${res.statusText}`);
  }

  const topics = (await res.json()) as { data: Topic[] };
  return topics;
}

export async function getTopicsByProblemId(problemID: string) {
  const res = await fetch(
    `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/topics/problem/${problemID}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch topics: ${res.statusText} for problem ID ${problemID}`,
    );
  }

  const topics = (await res.json()) as { data: Topic[] };
  return topics;
}
