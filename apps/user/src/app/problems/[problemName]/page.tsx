import { getDisplayProblemInfo } from "@/app/actions/problems";
import DisplayProblem from "./_components/DisplayProblem";
import { getAllSubmissions } from "@/app/actions/submissions";
import { Problem, Solution, Testcase, Topic, Bookmark, List } from "@repo/db";
export const dynamic = "force-dynamic";

export type DisplayProblemType =
  | (Problem & {
      testcases: Testcase[];

      solutions: Array<
        Solution & {
          _count: {
            likes: number;
            dislikes: number;
          };
          isSaved: boolean;
          isLiked: boolean;
          isDisliked: boolean;
        }
      >;

      isSolved?: boolean;
      bookmarks?: Bookmark[];

      higherRankProblemName: string | null;
      lowerRankProblemName: string | null;

      topics?: Topic[];
      lists?: List[];
    })
  | undefined;

export default async function page({
  params: { problemName },
}: {
  params: { problemName: string };
}) {
  const problem = (await getDisplayProblemInfo(
    problemName.split("-").join(" ")
  )) as DisplayProblemType;
  const submissions = await getAllSubmissions(problem?.id as string);
  return (
    <>
      <DisplayProblem
        problem={problem}
        problemName={problemName.toLowerCase().replace(/[^a-z0-9]/g, "")}
        submissions={submissions ?? []}
      />
    </>
  );
}
