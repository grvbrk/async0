import React from "react";
import prisma from "@repo/db";
import ProblemForm from "@/components/ProblemForm";
import { Separator } from "@repo/ui/components/ui/separator";
import { getAllLists } from "@/actions/lists";
import { getAllTopics } from "@/actions/topics";

export default async function EditProductPage({
  params: { problemId },
}: {
  params: { problemId: string };
}) {
  const listsPromise = getAllLists();
  const topicsPromise = getAllTopics();

  const problemPromise = prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      testcases: true,
      lists: true,
      topics: true,
      solutions: true,
    },
  });

  const [lists, topics, problem] = await Promise.all([
    listsPromise,
    topicsPromise,
    problemPromise,
  ]);
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Edit Problem</h3>
        <p className="text-sm ">
          Edit problem here. Minimum 1 and maximum 5 testcases allowed at
          present.
        </p>
      </div>
      <Separator className="mb-4" />
      {problem ? (
        <ProblemForm problem={problem} lists={lists} topics={topics} />
      ) : (
        <h1>No problem found</h1>
      )}
    </>
  );
}
