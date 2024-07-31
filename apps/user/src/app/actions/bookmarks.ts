"use server";

import prisma from "@repo/db";
import { cache } from "react";
import { findUser } from "./users";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const toggleBookmark = cache(async (problemId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    const userExists = await findUser(user.email as string);
    if (!userExists) return false;
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return false;
    }

    await prisma.bookmark.create({
      data: {
        userId: user.id,
        problemId,
      },
    });
    return true;
  } catch (error) {
    console.log("ERROR ADDING BOOKMARK", error);
  }
  revalidatePath("/problems");
  revalidatePath("/neetcode");
  revalidatePath("/problems/[problemName]");
});

export const getAllBookmarkedProblems = cache(async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return;
  try {
    const problems = await prisma.bookmark.findMany({
      ...(user
        ? {
            where: { userId: user.id },
          }
        : {}),
      include: { problem: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return problems;
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});

// function wait(ms: number) {
//   return new Promise((res) => {
//     setTimeout(res, ms);
//   });
// }
