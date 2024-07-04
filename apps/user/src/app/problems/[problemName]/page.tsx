import { getProblemByNameAndTestcases } from "@/app/actions/problems";
import DisplayProblem from "./_components/DisplayProblem";

export const dynamic = "force-dynamic";

export default async function page({
  params: { problemName },
}: {
  params: { problemName: string };
}) {
  problemName = problemName.split("-").join(" ");
  const problem = await getProblemByNameAndTestcases(problemName);

  return (
    <>
      <DisplayProblem problem={problem} />
    </>
  );
}
