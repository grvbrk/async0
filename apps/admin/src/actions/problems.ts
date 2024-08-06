"use server";

import { Difficulty, PopularLists } from "@repo/db";
import { cache } from "react";
import prisma from "@repo/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addProblem = cache(
  async (
    name: string,
    link: string,
    difficulty: Difficulty,
    starterCode: string,
    testcases: { input: string; output: string }[],
    solutions: string[],
    topicName: string,
    listName: PopularLists
  ) => {
    try {
      const topic = await prisma.topic.findFirst({
        where: {
          name: topicName,
        },
      });

      const list = await prisma.list.findFirst({
        where: { name: listName },
      });

      if (!topic || !list) {
        console.log("TOPIC OR LIST NOT FOUND");
        return;
      }

      await prisma.problem.create({
        data: {
          name,
          link,
          difficulty,
          starterCode,
          solutions: {
            create: solutions.map((solution, index) => ({
              code: solution,
              rank: index,
            })),
          },
          testcases: { create: testcases },
          topics: {
            connect: [{ id: topic.id }],
          },
          lists: {
            connect: [{ id: list.id }],
          },
        },
      });
    } catch (error) {
      console.log("ERROR CREATING PROBLEM", error);
    } finally {
      await prisma.$disconnect();
    }
    revalidatePath("/");
    revalidatePath("/problems");
    redirect("/problems");
  }
);

export const updateProblem = cache(
  async (
    id: string,
    name: string,
    link: string,
    difficulty: Difficulty,
    starterCode: string,
    testcases: { input: string; output: string }[],
    solutions: string[],
    topicName: string,
    listName: PopularLists
  ) => {
    try {
      const topic = await prisma.topic.findFirst({
        where: {
          name: topicName,
        },
      });

      const list = await prisma.list.findFirst({
        where: { name: listName },
      });

      if (!topic || !list) {
        console.log("TOPIC OR LIST NOT FOUND");
        return;
      }

      await prisma.problem.update({
        where: { id },
        data: {
          name,
          link,
          difficulty,
          starterCode,
          testcases: { deleteMany: {}, create: testcases },
          solutions: {
            deleteMany: {},
            create: solutions.map((solution, index) => ({
              code: solution,
              rank: index,
            })),
          },
          topics: { set: [], connect: [{ id: topic.id }] },
          lists: { set: [], connect: [{ id: list.id }] },
        },
      });
    } catch (error) {
      console.error("ERROR UPDATING PROBLEM", error);
    } finally {
      await prisma.$disconnect();
    }
    revalidatePath("/");
    revalidatePath("/problems");
    redirect("/problems");
  }
);

export const getAllProblemsWithTestcasesAndTopic = cache(async () => {
  try {
    const problems = await prisma.problem.findMany({
      include: { testcases: true, topics: true, lists: true },
    });
    return problems;
  } catch (error) {
    console.log("ERROR FETCHING ALL PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }
});

export const deleteOneProblem = cache(async (id: string) => {
  try {
    await prisma.problem.delete({ where: { id } });
  } catch (error) {
    console.log("ERROR DELETING ONE PROBLEMS", error);
  } finally {
    await prisma.$disconnect();
  }

  revalidatePath("/");
  revalidatePath("/problems");
  redirect("/problems");
});
