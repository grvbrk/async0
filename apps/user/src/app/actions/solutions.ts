"use server";

import { Solution } from "@repo/db";
import { cache } from "react";
import prisma from "@repo/db";
import { DefaultUser } from "next-auth";

export const getSolutionsData = cache(async (solutionArray: Solution[]) => {
  try {
    const promiseArray = solutionArray.map((s) => {
      return prisma.solution.findUnique({ where: { id: s.id } });
    });

    return await Promise.all(promiseArray);
  } catch (error) {
    console.log("ERROR FETCHING SOLUTION DATA", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const toggleSolutionLikes = cache(
  async (solutionId: string, user: DefaultUser) => {
    try {
      const isLikePresent = await prisma.like.findUnique({
        where: { userId_solutionId: { userId: user.id, solutionId } },
      });

      if (isLikePresent) {
        await prisma.like.delete({
          where: { userId_solutionId: { userId: user.id, solutionId } },
        });
        return;
      }

      await prisma.like.create({ data: { userId: user.id, solutionId } });
    } catch (error) {
      console.log("ERROR ADDING SOLUTION LIKE", error);
    } finally {
      await prisma.$disconnect();
    }
  }
);
export const toggleSolutionDislikes = cache(
  async (solutionId: string, user: DefaultUser) => {
    try {
      const isDislikePresent = await prisma.dislike.findUnique({
        where: { userId_solutionId: { userId: user.id, solutionId } },
      });

      if (isDislikePresent) {
        await prisma.dislike.delete({
          where: { userId_solutionId: { userId: user.id, solutionId } },
        });
        return;
      }
      await prisma.dislike.create({ data: { userId: user.id, solutionId } });
    } catch (error) {
      console.log("ERROR DELETING SOLUTION LIKE", error);
    } finally {
      await prisma.$disconnect();
    }
  }
);
