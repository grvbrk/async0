"use server";

import { cache } from "react";
import prisma, { Solution } from "@repo/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/authOptions";

export const getAllSavedSolutions = cache(async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    if (!user) return;
    const groupedSolutions = await prisma.problem.findMany({
      where: {
        solutions: {
          some: {
            savedBy: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        solutions: {
          where: {
            savedBy: {
              some: {
                userId: user.id,
              },
            },
          },
          select: {
            id: true,
            code: true,
            rank: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return groupedSolutions.map((problem) => ({
      problemId: problem.id,
      problemName: problem.name,
      solutions: problem.solutions,
    }));
  } catch (error) {
    console.log("ERROR FETCHING ALL SAVED SOLUTIONS", error);
  }
});

export const toggleSolutionLikes = cache(async (solutionId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const isSolutionLiked = await prisma.like.findUnique({
      where: { userId_solutionId: { userId: user.id, solutionId } },
    });

    if (isSolutionLiked) {
      await prisma.like.delete({
        where: { id: isSolutionLiked.id },
      });
    } else {
      await prisma.like.create({ data: { userId: user.id, solutionId } });
    }
  } catch (error) {
    console.log("ERROR ADDING SOLUTION LIKE", error);
  } finally {
    await prisma.$disconnect();
  }
  revalidatePath("/problems");
});
export const toggleSolutionDislikes = cache(async (solutionId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const isSolutionDisliked = await prisma.dislike.findUnique({
      where: { userId_solutionId: { userId: user.id, solutionId } },
    });

    if (isSolutionDisliked) {
      await prisma.dislike.delete({
        where: { id: isSolutionDisliked.id },
      });
    } else {
      await prisma.dislike.create({ data: { userId: user.id, solutionId } });
    }
  } catch (error) {
    console.log("ERROR DELETING SOLUTION LIKE", error);
  } finally {
    await prisma.$disconnect();
  }
  revalidatePath("/problems");
});

export const toggleSolutionSave = cache(async (solutionId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const isSolutionSaved = await prisma.likedSolution.findUnique({
      where: { userId_solutionId: { userId: user.id, solutionId } },
    });
    if (isSolutionSaved) {
      await prisma.likedSolution.delete({
        where: { id: isSolutionSaved.id },
      });
      revalidatePath("/problems");

      return;
    }
    await prisma.likedSolution.create({
      data: { userId: user.id, solutionId },
    });
  } catch (error) {
    console.log("ERROR DELETING SOLUTION LIKE", error);
  } finally {
    await prisma.$disconnect();
  }

  revalidatePath("/problems");
});
