import { DataTable } from "./data-table";
import { getAllGeneralProblems } from "../actions/problems";
import { getAllListData } from "../actions/lists";
import { getAllGeneralTopics } from "../actions/topics";
import UserBookmarkedProblems from "./_components/UserBookmarkedProblems";
import UserUpvotedSolution from "./_components/UserUpvotedSolution";
import { getAllSavedSolutions } from "../actions/solutions";
import { getAllBookmarkedProblems } from "../actions/bookmarks";
import Card3D from "./_components/Card3d";

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
          <Card3D className="mb-5 ">
            <UserBookmarkedProblems
              bookmarkedProblems={bookmarkedProblems ?? []}
            />
          </Card3D>
          <Card3D>
            <UserUpvotedSolution savedSolutions={savedSolutions ?? []} />
          </Card3D>
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
