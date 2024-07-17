"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { DefaultUser } from "next-auth";

export const findAllProblemsForUser = cache(async (user: DefaultUser) => {
  try {
    if (user) {
      const problems = await prisma.problem.findMany({
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
      return problems;
    } else {
      const problems = await prisma.problem.findMany({
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
        },
      });
      return problems;
    }
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
      if (user) {
        const problem = await prisma.problem.findFirst({
          where: { name: problemName },
          include: {
            testcases: true,
            Solution: {
              include: {
                _count: { select: { likes: true, dislikes: true } },
                savedBy: { where: { userId: user.id }, select: { id: true } },
              },
            },
            bookmarks: { where: { userId: user.id } },
          },
        });
        return problem;
      } else {
        const problem = await prisma.problem.findFirst({
          where: { name: problemName },
          include: {
            testcases: true,
            Solution: {
              include: { _count: { select: { likes: true, dislikes: true } } },
            },
          },
        });
        return problem;
      }
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
