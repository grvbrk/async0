import { addProblem, updateProblem } from "./problems";
import { Difficulty, PopularLists } from "@repo/db";
import { redirect } from "next/navigation";

export async function addOneProblem(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const testcases: { input: string; output: string }[] = [];

  for (let key in data) {
    if (key.startsWith("input")) {
      const id = Number(key.split("-")[1]);
      testcases.push({
        input: String(data[key]),
        output: String(data[`output-${id}`]),
      });
      delete data[key];
    }
    if (key.startsWith("output")) {
      delete data[key];
    }
    if (key.startsWith("$ACTION")) {
      delete data[key];
    }
  }
  const name = data.name as string;
  const difficulty = data.difficulty as Difficulty;
  const listName = data.list as PopularLists;
  const topicName = data.topic as string;
  const starterCode = data.placeholderCode as string;

  try {
    await addProblem(
      name,
      difficulty,
      starterCode,
      testcases,
      topicName,
      listName
    );
    redirect("/problems");
  } catch (error) {
    console.log("ERROR ADDING PROBLEM AND TESTCASES");
    return error;
  }
}

export async function updateOneProblem(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  const testcases: { input: string; output: string }[] = [];

  for (let key in data) {
    if (key.startsWith("input")) {
      const id = Number(key.split("-")[1]);
      testcases.push({
        input: String(data[key]),
        output: String(data[`output-${id}`]),
      });
      delete data[key];
    }
    if (key.startsWith("output")) {
      delete data[key];
    }
    if (key.startsWith("$ACTION")) {
      delete data[key];
    }
  }
  const name = data.name as string;
  const difficulty = data.difficulty as Difficulty;
  const listName = data.list as PopularLists;
  const topicName = data.topic as string;
  const starterCode = data.placeholderCode as string;

  try {
    await updateProblem(
      id,
      name,
      difficulty,
      starterCode,
      testcases,
      topicName,
      listName
    );
    redirect("/problems");
  } catch (error) {
    console.log("ERROR UPDATING PROBLEM AND TESTCASES");
    return error;
  }
}
