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
    const source = axios.CancelToken.source();
    const timeId = setTimeout(() => {
      source.cancel();
    }, 10000);

    if (run) {
      const submission = runCode(userFunction);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/?base64_encoded=false`,
          JSON.stringify(submission),
          {
            headers: { "Content-Type": "application/json" },
            cancelToken: source.token,
          }
        );
        clearTimeout(timeId);
        return await checkPromiseStatus(response.data.token);
      } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
          return Promise.resolve({
            stdout: null,
            time: null,
            memory: null,
            stderr:
              "Server is down at the moment. Please try again in some time.",
            token: null,
            compile_output: null,
            message: null,
            status: { id: 11, description: null },
            output: null,
          });
        }

        clearTimeout(timeId);
        if (axios.isCancel(error)) {
          return Promise.resolve({
            stdout: null,
            time: null,
            memory: null,
            stderr: "Server took too long to respond.",
            token: null,
            compile_output: null,
            message: null,
            status: { id: 11, description: null },
            output: null,
          });
        }
        return Promise.resolve({
          stdout: null,
          time: null,
          memory: null,
          stderr: "Something went wrong...",
          token: null,
          compile_output: null,
          message: null,
          status: { id: 11, description: null },
          output: null,
        });
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
          {
            headers: { "Content-Type": "application/json" },
            cancelToken: source.token,
          }
        );

        clearTimeout(timeId);

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

          const totalTestcases = problem?.testcases.length;
          const problemId = problem?.id;

          await createSubmission(
            successfulResponses,
            totalTestcases as number,
            problemId as string,
            userFunction
          );

          return successfulResponses;
        }
      } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
          return Promise.resolve([
            {
              stdout: null,
              time: null,
              memory: null,
              stderr:
                "Server is down at the moment. Please try again in some time.",
              token: null,
              compile_output: null,
              message: null,
              status: { id: 11, description: null },
              output: null,
            },
          ]);
        }

        clearTimeout(timeId);
        if (axios.isCancel(error)) {
          return Promise.resolve([
            {
              stdout: null,
              time: null,
              memory: null,
              stderr: "Server took too long to respond.",
              token: null,
              compile_output: null,
              message: null,
              status: { id: 11, description: null },
              output: null,
            },
          ]);
        }

        return Promise.resolve([
          {
            stdout: null,
            time: null,
            memory: null,
            stderr: "Something went wrong...",
            token: null,
            compile_output: null,
            message: null,
            status: { id: 11, description: null },
            output: null,
          },
        ]);
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
