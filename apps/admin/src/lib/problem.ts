import { Problem, ProblemBody } from "@/lib/types";
import { env } from "next-runtime-env";

export async function createProblem(data: ProblemBody) {
  try {
    const response = await fetch(
      `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/problems`,
      {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating problem", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create problem. Please try again.");
  }
}

export async function updateProblem(data: ProblemBody, problemID: string) {
  try {
    const response = await fetch(
      `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/problems/${problemID}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating problem", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to update problem. Please try again.");
  }
}

export async function getAllProblems(): Promise<{ data: Problem[] }> {
  const response = await fetch(
    `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/problems`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch problems: ${response.statusText}`);
  }

  return response.json();
}

export async function getProblemById(id: string): Promise<{ data: Problem }> {
  const response = await fetch(
    `${env("NEXT_PUBLIC_BACKEND_URL")}/admin/problems/${id}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch problems: ${response.statusText}`);
  }

  return response.json();
}
