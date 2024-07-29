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

// function wait(ms: number) {
//   return new Promise((res) => {
//     setTimeout(res, ms);
//   });
// }
