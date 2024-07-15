import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import { getAllNeetcodeProblems } from "../actions/problems";
import { DataTable } from "../problems/data-table";

export default async function NeetcodePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const neetCodeProblemDetails = await getAllNeetcodeProblems(user);

  if (!neetCodeProblemDetails || !user) {
    return <h1>Not found</h1>;
  }

  return (
    <div className="container mt-5">
      <DataTable data={neetCodeProblemDetails} tag="neetcode" />
    </div>
  );
}
