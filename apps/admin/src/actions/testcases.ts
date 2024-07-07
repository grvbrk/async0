import { Testcase } from "@repo/db";
import { cache } from "react";

export const addTestcases = cache(
  async (testcases: Testcase[], problemId: string) => {
    // connectDB();
    // let promiseArray = [];
    // for (let testcase of testcases) {
    //   promiseArray.push(addSingleTestcase(testcase, problemId));
    // }
    // await Promise.all(promiseArray);
  }
);

const addSingleTestcase = cache(
  async ({ description, solution }: any, problemId: string) => {
    //   await pool.query(
    //     `
    //   INSERT INTO testcases(description, solution, problemId)
    //   VALUES ($1, $2, $3)
    // `,
    //     [description, solution, problemId]
    //   );
  }
);
