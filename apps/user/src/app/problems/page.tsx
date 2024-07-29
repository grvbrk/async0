import { DataTable } from "./data-table";
import {
  getAllBookmarkedProblems,
  getAllGeneralProblems,
} from "../actions/problems";
import { getAllListData } from "../actions/lists";
import { getAllGeneralTopics } from "../actions/topics";
import UserBookmarkedProblems from "./_components/UserBookmarkedProblems";
import UserUpvotedSolution from "./_components/UserUpvotedSolution";
import { getAllSavedSolutions } from "../actions/solutions";

export default async function ProblemsPage() {
  const userProblemDetails = await getAllGeneralProblems();
  const listsData = await getAllListData();
  const allTopicsData = await getAllGeneralTopics();
  const bookmarkedProblems = await getAllBookmarkedProblems();
  const savedSolutions = await getAllSavedSolutions();
  if (!userProblemDetails) {
    return <h1>Not found</h1>;
  }

  return (
    <>
      <div className="container flex flex-col gap-10 items-center md:flex-row md:items-start mt-5">
        <div>
          <div className="mb-5">
            <UserBookmarkedProblems
              bookmarkedProblems={bookmarkedProblems ?? []}
            />
          </div>
          <div>
            <UserUpvotedSolution savedSolutions={savedSolutions ?? []} />
          </div>
        </div>
        <div>
          <DataTable
            data={userProblemDetails}
            tag="general"
            lists={listsData ?? []}
            allTopics={allTopicsData ?? []}
          />
        </div>
      </div>
    </>
  );
}
