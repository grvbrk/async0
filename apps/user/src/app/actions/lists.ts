"use server";

import { cache } from "react";
import prisma from "@repo/db";

// export const getSidebarData = cache(async () => {
//   try {
//     return await prisma.list.findMany({
//       include: { topic: { include: { problem: true } } },
//     });
//   } catch (error) {
//     console.log("ERRROR FETCHING ALL TOPICS", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// });