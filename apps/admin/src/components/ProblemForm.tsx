"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ButtonHTMLAttributes, useState } from "react";
import { addOneProblem, updateOneProblem } from "@/actions/handleFormData";
import { DIFFICULTY } from "@/lib/constant";
import { X, CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";
import { List, Problem, Topic } from "@repo/db";
import { toast } from "sonner";
import { Testcase } from "@repo/db";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { deleteOneProblem, updateProblem } from "@/actions/problems";

type ProblemFormType = {
  problem?: {
    List: List[];
    topics: Topic[];
    testcases: Testcase[];
  } & Problem;
  lists?: List[];
  topics?: Topic[];
};

export default function ProblemForm({
  problem,
  lists,
  topics,
}: ProblemFormType) {
  const { data: session } = useSession();
  const [error, action] = useFormState(
    problem ? updateOneProblem.bind(null, problem.id) : addOneProblem,
    {}
  );

  const [testCases, setTestCases] = useState<Partial<Testcase>[]>(
    problem?.testcases.map((tc) => ({
      input: tc.input,
      output: tc.output,
    })) || [{ input: "", output: "" }]
  );
  const [selectedLevel, setSelectedLevel] = useState<string>(
    problem?.difficulty || ""
  );
  const [selectedList, setSelectedList] = useState<string>(
    problem?.List[0]?.name || ""
  );
  const [selectedTopic, setSelectedTopic] = useState<string>(
    problem?.topics[0].name || ""
  );

  function handleTestCaseChange(
    idx: number,
    field: keyof Testcase,
    value: string
  ) {
    const updatedTestCases = [...testCases];
    updatedTestCases[idx][field] = value;
    setTestCases(updatedTestCases);
  }

  function addTestCase() {
    setTestCases([...testCases, { input: "", output: "" }]);
  }

  function removeTestCase(idx: number) {
    setTestCases(testCases.filter((_, i) => i !== idx));
  }

  return (
    <form action={action}>
      <div className="flex items-end gap-4 mb-2 md:flex md:items-end">
        <div className="md:w-full md:min-w-[100px]">
          <Label htmlFor="name">Problem Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={problem?.name || ""}
            required
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 md:justify-start">
        <Select onValueChange={setSelectedList} value={selectedList}>
          <SelectTrigger
            className="w-[180px]"
            disabled={!lists || lists.length === 0}
          >
            <SelectValue placeholder="List" />
          </SelectTrigger>
          <SelectContent>
            {lists &&
              lists.map((list, idx) => {
                return (
                  <SelectItem key={idx} value={list.name}>
                    {list.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedTopic} value={selectedTopic}>
          <SelectTrigger className="w-[180px]" disabled={topics ? false : true}>
            <SelectValue placeholder="Topics" />
          </SelectTrigger>
          <SelectContent>
            {topics &&
              topics.map((topic, idx) => {
                return (
                  <SelectItem key={`$topic-${idx}`} value={topic.name}>
                    {topic.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedLevel} value={selectedLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY.map((level, idx) => {
              return (
                <SelectItem key={idx} value={level}>
                  {level}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="placeholderCode">Placeholder Code</Label>
        <Textarea
          id="placeholderCode"
          name="placeholderCode"
          placeholder="starter code..."
          defaultValue={problem?.starterCode || ""}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="Description">Testcases</Label>
        {testCases.map((testcase, idx) => {
          return (
            <div key={idx} className="flex gap-4 items-end">
              <div>
                <Label htmlFor={`input-${idx}`}>Input</Label>
                <Input
                  type="text"
                  id={`input-${idx}`}
                  name={`input-${idx}`}
                  value={testcase.input}
                  onChange={(e) =>
                    handleTestCaseChange(idx, "input", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor={`output-${idx}`}>Output</Label>
                <Input
                  type="text"
                  id={`output-${idx}`}
                  name={`output-${idx}`}
                  value={testcase.output}
                  onChange={(e) =>
                    handleTestCaseChange(idx, "output", e.target.value)
                  }
                  required
                />
              </div>
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0"
                onClick={() => removeTestCase(idx)}
                disabled={testCases.length === 1}
              >
                <X className="mr-2" />
              </Button>
            </div>
          );
        })}

        <Button
          variant="ghost"
          className="hover:bg-transparent p-0"
          onClick={addTestCase}
          disabled={testCases.length === 5}
        >
          <CirclePlus className="mr-2" />
          Add Testcase
        </Button>
      </div>

      <SubmitButton
        className="mt-6"
        onClick={(e) => {
          if (!session) {
            toast.error("You need to login first");
            e.preventDefault();
          }
        }}
      />

      {problem && (
        <DeleteButton
          className="ml-4"
          onClick={async (e) => {
            if (!session) {
              toast.error("You need to login first");
              e.preventDefault();
            }
            await deleteOneProblem(problem?.id || "");
          }}
        />
      )}

      <input type="hidden" name="difficulty" value={selectedLevel} />
      <input type="hidden" name="list" value={selectedList} />
      <input type="hidden" name="topic" value={selectedTopic} />
    </form>
  );
}

function SubmitButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

function DeleteButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} variant="destructive" {...props}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
