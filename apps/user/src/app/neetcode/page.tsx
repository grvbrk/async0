import React from "react";
import { getAllNeetcodeProblems } from "../actions/problems";
import { DataTable } from "../problems/data-table";
import { getAllNeetcodeTopics } from "../actions/topics";

export default async function NeetcodePage() {
  const neetCodeProblemDetails = await getAllNeetcodeProblems();
  const neetcodeTopics = await getAllNeetcodeTopics();
  if (!neetCodeProblemDetails) {
    return <h1>Not found</h1>;
  }

  return (
    <div className="container mt-5">
      <DataTable
        data={neetCodeProblemDetails}
        tag="neetcode"
        allTopics={neetcodeTopics ?? []}
      />
    </div>
  );
}
