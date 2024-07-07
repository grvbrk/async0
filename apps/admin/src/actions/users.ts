"use server";

import { cache } from "react";
import prisma from "@repo/db";

export const findUser = cache(async (email: string) => {
  try {
    return await prisma.user.findUnique({ where: { email: email } });
  } catch (error) {
    console.log("Error finding user");
    return undefined;
  } finally {
    await prisma.$disconnect();
  }
});

export const addUser = cache(async (email: string) => {
  try {
    return await prisma.user.create({
      data: {
        email: email,
      },
    });
  } catch (error) {
    console.log("Error adding user");
  } finally {
    await prisma.$disconnect();
  }
});
