import { getDisplayProblemInfo } from "@/app/actions/problems";
import DisplayProblem from "./_components/DisplayProblem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export const dynamic = "force-dynamic";
export default async function page({
  params: { problemName },
}: {
  params: { problemName: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const problem = await getDisplayProblemInfo(
    problemName.split("-").join(" "),
    user
  );
  return (
    <>
      <DisplayProblem
        problem={problem}
        problemName={problemName.toLowerCase().replace(/[^a-z0-9]/g, "")}
      />
    </>
  );
}
