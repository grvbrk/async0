import { getAllLists } from "@/actions/lists";
import ProblemForm from "../../../components/ProblemForm";
import { getAllTopics } from "@/actions/topics";
import { Separator } from "@repo/ui/components/ui/separator";

export default async function NewProblemPage() {
  const listsPromise = getAllLists();
  const topicsPromise = getAllTopics();

  const [lists, topics] = await Promise.all([listsPromise, topicsPromise]);

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Add Problem</h3>
        <p className="text-sm ">
          Add a new problem. Minimum 1 and maximum 5 testcases allowed at
          present.
        </p>
      </div>
      <Separator className="mb-4" />
      <ProblemForm lists={lists} topics={topics} />
    </>
  );
}
