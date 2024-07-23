import { DataTable } from "./data-table";
import { DefaultUser, getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllGeneralProblems } from "../actions/problems";
import { getAllListData } from "../actions/lists";
import { getAllGeneralTopics } from "../actions/topics";

export default async function ProblemsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as DefaultUser;
  const userProblemDetails = await getAllGeneralProblems();
  const listsData = await getAllListData();
  const allTopicsData = await getAllGeneralTopics();
  if (!userProblemDetails) {
    return <h1>Not found</h1>;
  }

  return (
    <>
      <div className="container mt-5">
        <DataTable
          data={userProblemDetails}
          tag="general"
          lists={listsData ?? []}
          allTopics={allTopicsData ?? []}
        />
      </div>
    </>
  );
}
