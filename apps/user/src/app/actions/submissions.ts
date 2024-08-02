"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { judge0ValueKeyType } from "@repo/common";
import { revalidatePath } from "next/cache";

export const createSubmission = cache(
  async (
    successfulResponses: judge0ValueKeyType[],
    totalTestcases: number,
    problemId: string,
    userFunction: string
  ) => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.id) return;

    const firstErrorIndex = successfulResponses.findIndex((res: any) =>
      [4, 5, 6, 7, 8, 9, 10, 11, 12].includes(res.status.id)
    );

    if (firstErrorIndex != -1) {
      const firstErrorResponse = successfulResponses[firstErrorIndex];
      const status = [1, 2].includes(firstErrorResponse.status.id)
        ? "Pending"
        : firstErrorResponse.status.id === 3
          ? "Accepted"
          : firstErrorResponse.status.id === 4
            ? "Rejected"
            : "TimeLimit";
      try {
        await prisma.$transaction(async () => {
          const submission = await prisma.submission.create({
            data: {
              status: status,
              userId: user.id,
              totalTestcases: totalTestcases,
              passedTestcases:
                firstErrorIndex === -1 ? totalTestcases : firstErrorIndex,
              testcaseResults: JSON.stringify(successfulResponses),
              problemId,
            },
          });

          await prisma.userSolution.create({
            data: {
              code: userFunction,
              submissionId: submission.id,
              userId: user.id,
            },
          });
        });
      } catch (error) {
        console.log("ERROR CREATING SUBMISSION");
      }
    } else {
      try {
        await prisma.$transaction(async () => {
          const submission = await prisma.submission.create({
            data: {
              status: "Accepted",
              userId: user.id,
              totalTestcases: totalTestcases,
              passedTestcases: totalTestcases,
              testcaseResults: JSON.stringify(successfulResponses),
              problemId,
            },
          });

          await prisma.userSolution.create({
            data: {
              code: userFunction,
              submissionId: submission.id,
              userId: user.id,
            },
          });

          await prisma.hasUserSolved.create({
            data: {
              submissionId: submission.id,
              userId: user.id,
              problemId,
            },
          });
        });
      } catch (error) {
        console.log("ERROR CREATING SUBMISSION");
      }
    }
    revalidatePath("/");
    revalidatePath("/problems");
  }
);

export const getAllSubmissions = cache(async (problemId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) return;

  try {
    const submissions = await prisma.submission.findMany({
      where: {
        userId: user.id,
        problemId,
      },
      include: { userSolution: true },
      orderBy: { createdAt: "desc" },
    });

    return submissions;
  } catch (error) {
    console.log("ERROR FETCHING ALL SUBMISSIONS");
  }
});
