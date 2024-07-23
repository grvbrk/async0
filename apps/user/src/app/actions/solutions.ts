"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/authOptions";

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
    console.log(isSolutionDisliked);

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
