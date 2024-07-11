import { getProblemByNameAndTestcases } from "@/app/actions/problems";
import DisplayProblem from "./_components/DisplayProblem";
import AnimatePanel from "./_components/AnimatePanel";
export const dynamic = "force-dynamic";
export default async function page({
  params: { problemName },
}: {
  params: { problemName: string };
}) {
  const problem = await getProblemByNameAndTestcases(
    problemName.split("-").join(" ")
  );

  return (
    <>
      <DisplayProblem
        problem={problem}
        problemName={problemName.toLowerCase().replace(/[^a-z0-9]/g, "")}
      />
      {/* <AnimatePanel /> */}
    </>
  );
}
