"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

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
  const session = await getServerSession(authOptions);
  const user = session?.user;
  try {
    if (!session || !user) {
      const data = await prisma.topic.findMany({
        include: {
          problems: true,
        },
      });
      return data;
    } else {
      const data = await prisma.topic.findMany({
        include: {
          problems: {
            include: { hasUserSolved: { where: { userId: user.id } } },
          },
        },
      });

      const transformedData = data.map((topic) => ({
        ...topic,
        problems: topic.problems.map((problem) => ({
          ...problem,
          solved: problem.hasUserSolved.length > 0,
        })),
      }));
      console.log(transformedData);
      return transformedData;
    }
  } catch (error) {
    console.log("ERRROR FETCHING ALL TOPICS", error);
  } finally {
    await prisma.$disconnect();
  }
});
