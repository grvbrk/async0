import { DataTable } from "./data-table";
import { getAllGeneralProblems } from "../actions/problems";
import { getAllListData } from "../actions/lists";
import { getAllGeneralTopics } from "../actions/topics";
import UserBookmarkedProblems from "./_components/UserBookmarkedProblems";
import UserUpvotedSolution from "./_components/UserUpvotedSolution";
import { getAllSavedSolutions } from "../actions/solutions";
import { getAllBookmarkedProblems } from "../actions/bookmarks";

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
      <div className="container flex flex-col gap-10 items-center xl:flex-row xl:items-start mt-5">
        <div className="flex flex-col md:flex-row md:gap-5 md:items-center xl:flex-col">
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
