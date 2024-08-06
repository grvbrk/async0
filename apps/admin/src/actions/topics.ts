import { cache } from "react";
import prisma from "@repo/db";

export const getAllTopics = cache(async () => {
  try {
    return await prisma.topic.findMany();
  } catch (error) {
    console.log("ERROR FETCHING ALL TOPICS");
  } finally {
    await prisma.$disconnect();
  }
});
