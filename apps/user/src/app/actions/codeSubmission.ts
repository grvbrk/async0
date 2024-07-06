"use server";

import { Difficulty } from "@repo/db";
import axios from "axios";
import { cache } from "react";
import getBatchSubmission from "@repo/common/driver/duplicateinteger";

type DisplayProblemPropType =
  | ({
      testcases: {
        id: string;
        input: string;
        output: string;
        problemId: string | null;
      }[];
    } & {
      id: string;
      name: string;
      difficulty: Difficulty;
      isActiveForSubmission: boolean;
      starterCode: string;
      createdAt: Date;
      updatedAt: Date;
    })
  | null
  | undefined;

export const codeSubmission = cache(
  async (code: string, problem: DisplayProblemPropType) => {
    const batchSubmission = getBatchSubmission(code, problem?.testcases || []);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        JSON.stringify(batchSubmission),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 && response.statusText === "Created") {
        const tokens: string[] = response.data.map((data: any) => {
          return data.token;
        });

        // FINAL RESPONSE FROM JUDGE0
        const responses = await Promise.allSettled(
          tokens.map(checkPromiseStatus)
        );

        return responses;
      }
    } catch (error) {
      console.log("Error submitting code", error);
    }
  }
);

function checkPromiseStatus(token: string) {
  return new Promise((resolve) => {
    async function checkStatus() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`
      );
      if ([3, 4, 5].includes(response.data.status.id)) {
        clearInterval(intervalId);
        resolve(response.data);
      }

      if ([7, 8, 9, 10, 11, 12].includes(response.data.status.id)) {
        clearInterval(intervalId);
        resolve(response.data);
      }
    }

    const intervalId = setInterval(checkStatus, 200);
  });
}
