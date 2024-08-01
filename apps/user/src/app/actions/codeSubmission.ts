"use server";

import axios from "axios";
import { cache } from "react";
import { judge0ValueKeyType, problemDriverCode } from "@repo/common";
import { DisplayProblemPropType } from "../problems/[problemName]/_components/DisplayProblem";
import { runCode } from "./runCode";
import { requestBody } from "@repo/common/driver/types";
import { createSubmission } from "./submissions";

export const codeSubmission = cache(
  async (
    userFunction: string,
    problem: DisplayProblemPropType,
    problemName: string,
    run: boolean
  ) => {
    if (run) {
      const submission = runCode(userFunction);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/?base64_encoded=false`,
          JSON.stringify(submission),
          { headers: { "Content-Type": "application/json" } }
        );
        return await checkPromiseStatus(response.data.token);
      } catch (error) {
        console.log("Error submitting RUN code");
      }
    } else {
      const batchSubmission: requestBody = problemDriverCode[problemName](
        userFunction,
        problem?.testcases || []
      );
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
            tokens.map((token) => checkPromiseStatus(token))
          );

          const successfulResponses = responses
            .filter(
              (result): result is PromiseFulfilledResult<judge0ValueKeyType> =>
                result.status === "fulfilled"
            )
            .map((result) => result.value);
          // TODO: Map responses and call a server action to hasUserSolvedTable
          const totalTestcases = batchSubmission.submissions.length;
          const problemId = problem?.id;

          await createSubmission(
            successfulResponses,
            totalTestcases,
            problemId as string
          );

          return responses;
        }
      } catch (error) {
        console.log("Error submitting SUBMIT code", error);
      }
    }
  }
);

export async function checkPromiseStatus(
  token: string
): Promise<judge0ValueKeyType> {
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
