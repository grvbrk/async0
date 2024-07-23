"use server";

import { cache } from "react";
import prisma from "@repo/db";

export const getAllGeneralTopics = cache(async () => {
  try {
    return await prisma.topic.findMany();
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getAllNeetcodeTopics = cache(async () => {
  try {
    return await prisma.topic.findMany({
      where: { List: { name: "Neetcode" } },
    });
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getTopicsByList = cache(async (listId: string) => {
  try {
    return await prisma.topic.findMany({ where: { listId } });
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const getSidebarData = cache(async () => {
  try {
    return await prisma.topic.findMany({
      include: { problems: true },
    });
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});
