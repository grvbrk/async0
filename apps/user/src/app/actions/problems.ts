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
  async (problemName: string, user: DefaultUser) => {
    try {
      const problem = await prisma.problem.findFirst({
        where: { name: problemName },
        include: {
          testcases: true,
          Solution: {
            include: {
              _count: { select: { likes: true, dislikes: true } },
              ...(user
                ? {
                    savedBy: {
                      where: { userId: user.id },
                      select: { id: true },
                    },
                    likes: {
                      where: { userId: user.id },
                      select: { id: true },
                    },
                    dislikes: {
                      where: { userId: user.id },
                      select: { id: true },
                    },
                  }
                : {}),
            },
          },
          ...(user ? { bookmarks: { where: { userId: user.id } } } : {}),
        },
      });
      if (problem && problem.Solution) {
        problem.Solution = problem.Solution.map((solution) => ({
          ...solution,
          isSaved: solution.savedBy && solution.savedBy.length > 0,
          isLiked: solution.likes && solution.likes.length > 0,
          isDisliked: solution.dislikes && solution.dislikes.length > 0,
        }));
      }
      return problem;
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
