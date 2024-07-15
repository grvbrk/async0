"use server";

import { cache } from "react";
import prisma from "@repo/db";

export const findAllProblemsForUser = cache(async (user: any) => {
  try {
    return await prisma.problem.findMany({
      select: {
        id: true,
        name: true,
        difficulty: true,
        topics: {
          select: {
            name: true,
          },
        },
        List: true,
        hasUserSolved: {
          where: { userId: user.id },
          select: {
            Submission: {
              select: {
                status: true,
                passedTestcases: true,
                totalTestcases: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getAllProblems = cache(async () => {
  try {
    return await prisma.problem.findMany();
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getProblemById = cache(async (problemId: string) => {
  try {
    return await prisma.problem.findMany({
      where: { id: problemId },
    });
  } catch (error) {
    console.log("ERROR FETCHING PROBLEM BY ID", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getDisplayProblemInfo = cache(
  async (problemName: string, user: any) => {
    try {
      return await prisma.problem.findFirst({
        where: { name: problemName },
        include: { testcases: true, bookmarks: { where: { userId: user.id } } },
      });
    } catch (error) {
      console.log("ERROR FETCHING PROBLEM BY NAME", error);
    } finally {
      await prisma.$disconnect();
    }
  }
);

export const getAllNeetcodeProblems = cache(async (user: any) => {
  try {
    return await prisma.problem.findMany({
      where: { List: { some: { name: "Neetcode" } } },
      select: {
        id: true,
        name: true,
        difficulty: true,
        topics: {
          select: {
            name: true,
          },
        },
        hasUserSolved: {
          where: { userId: user.id },
          select: {
            Submission: {
              select: {
                status: true,
                passedTestcases: true,
                totalTestcases: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});
