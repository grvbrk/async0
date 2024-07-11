"use server";

import { cache } from "react";
import prisma from "@repo/db";

export const findUser = cache(async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  } catch (error) {
    console.log("ERROR FINDING USER", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const addUser = cache(async (email: string) => {
  try {
    await prisma.user.create({
      data: {
        email: email,
      },
    });
  } catch (error) {
    console.log("ERROR ADDING USER", error);
  } finally {
    await prisma.$disconnect();
  }
});
