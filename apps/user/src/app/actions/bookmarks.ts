"use server";

import prisma from "@repo/db";
import { cache } from "react";
import { findUser } from "./users";
import { DefaultUser } from "next-auth";
import { revalidatePath } from "next/cache";

export const toggleBookmark = cache(
  async (user: DefaultUser, problemId: string) => {
    // await wait(5000);
    console.log("Called");
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
    revalidatePath("/problems/[problemName]", "layout");
  }
);

// function wait(ms: number) {
//   return new Promise((res) => {
//     setTimeout(res, ms);
//   });
// }
