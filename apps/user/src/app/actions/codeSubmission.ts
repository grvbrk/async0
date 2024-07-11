"use server";

import { Difficulty } from "@repo/db";
import axios from "axios";
import { cache } from "react";
import { duplicateInteger, isAnagram } from "@repo/common/driver/driver-code";
import { judge0TokenResponseType } from "@repo/common";

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

const problemTable: Record<string, any> = {
  duplicateinteger: duplicateInteger,
  isanagram: isAnagram,
};

export const codeSubmission = cache(
  async (
    code: string,
    problem: DisplayProblemPropType,
    problemName: string,
    run: boolean
  ) => {
    const batchSubmission = problemTable[problemName](
      code,
      problem?.testcases || [],
      run
    );
    console.log("CODE", code);
    if (run) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/?base64_encoded=false`,
          JSON.stringify(batchSubmission),
          { headers: { "Content-Type": "application/json" } }
        );
        return await checkPromiseStatus(response.data.token);
      } catch (error) {
        console.log("Error submitting RUN code");
      }
    } else {
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
          const responses: PromiseSettledResult<judge0TokenResponseType>[] =
            await Promise.allSettled(
              tokens.map((token) => checkPromiseStatus(token))
            );

          return responses;
        }
      } catch (error) {
        console.log("Error submitting SUBMIT code");
      }
    }
  }
);

function checkPromiseStatus(token: string): Promise<judge0TokenResponseType> {
  return new Promise((resolve) => {
    async function checkStatus() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`
      );

      if ([3, 4, 5, 7, 8, 9, 10, 11, 12].includes(response.data.status.id)) {
        clearInterval(intervalId);
        resolve(response.data);
      }
    }

    const intervalId = setInterval(checkStatus, 200);
  });
}
