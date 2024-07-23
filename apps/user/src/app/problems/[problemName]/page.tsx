import { getDisplayProblemInfo } from "@/app/actions/problems";
import DisplayProblem from "./_components/DisplayProblem";
export const dynamic = "force-dynamic";
export default async function page({
  params: { problemName },
}: {
  params: { problemName: string };
}) {
  const problem = await getDisplayProblemInfo(problemName.split("-").join(" "));
  return (
    <>
      <DisplayProblem
        problem={problem}
        problemName={problemName.toLowerCase().replace(/[^a-z0-9]/g, "")}
      />
    </>
  );
}
