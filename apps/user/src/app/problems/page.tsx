import { DataTable } from "./data-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { findAllProblemsForUser } from "../actions/problems";

export default async function ProblemsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userProblemDetails = await findAllProblemsForUser(user);
  if (!userProblemDetails || !user) {
    return <h1>Not found</h1>;
  }

  return (
    <>
      <div className="container mt-5">
        <DataTable data={userProblemDetails} tag="general" />
      </div>
    </>
  );
}
