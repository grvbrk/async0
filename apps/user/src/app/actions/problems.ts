"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const getAllGeneralProblems = cache(async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        name: true,
        link: true,
        difficulty: true,
        topics: {
          select: {
            name: true,
          },
        },
        lists: true,
        ...(user
          ? {
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
              bookmarks: { where: { userId: user.id }, select: { id: true } },
            }
          : {}),

        solutions: {
          orderBy: [{ rank: "desc" }],
        },
        createdAt: true,
      },
    });

    const updatedArray = problems.map((problem) => ({
      ...problem,
      userId: user?.id ?? undefined,
    }));

    return updatedArray;
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getAllNeetcodeProblems = cache(async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const problems = await prisma.problem.findMany({
      where: { lists: { some: { name: "Neetcode" } } },
      select: {
        id: true,
        name: true,
        link: true,
        difficulty: true,
        topics: {
          select: {
            name: true,
          },
        },
        ...(user
          ? {
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
              bookmarks: { where: { userId: user.id }, select: { id: true } },
            }
          : {}),
        solutions: {
          orderBy: [{ rank: "desc" }],
        },
      },
    });
    const updatedArray = problems.map((problem) => {
      return { ...problem, userId: user?.id ?? undefined };
    });

    return updatedArray;
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

export const getDisplayProblemInfo = cache(async (problemName: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const problem = await prisma.problem.findFirst({
      where: { name: problemName },
      include: {
        testcases: true,
        solutions: {
          orderBy: {
            rank: "asc",
          },
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
    if (problem && problem.solutions) {
      problem.solutions = problem.solutions.map((solution) => ({
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
});
