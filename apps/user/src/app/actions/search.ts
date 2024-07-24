"use server";

import { cache } from "react";
import prisma from "@repo/db";
import { MAX_QUERY_LENGTH } from "@/lib/utils";

export const searchProblemQuery = cache(async (query: string) => {
  if (query.length > MAX_QUERY_LENGTH) {
    return;
  }
  try {
    const results = await prisma.$queryRaw`
    SELECT id, name, difficulty, link,
           ts_rank(search_vector, plainto_tsquery('english', ${query})) AS rank
    FROM "Problem"
    WHERE search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT 10
  `;
    return results;
  } catch (error) {
    console.log("ERROR SEARCHING PROBLEMS", error);
  }
});
