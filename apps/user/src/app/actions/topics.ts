"use server";

import { cache } from "react";
import prisma from "@repo/db";

export const getAllTopics = cache(async () => {
  try {
    return await prisma.topic.findMany();
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getSidebarData = cache(async () => {
  try {
    return await prisma.topic.findMany({
      include: { problem: true },
    });
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});
