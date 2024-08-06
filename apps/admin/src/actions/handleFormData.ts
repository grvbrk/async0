import { escapeCode } from "@repo/common";
import { addProblem, updateProblem } from "./problems";
import { Difficulty, PopularLists } from "@repo/db";

export async function addOneProblem(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const testcases: { input: string; output: string }[] = [];
  const solutions: string[] = [];

  for (let key in data) {
    if (key.startsWith("input")) {
      const id = Number(key.split("-")[1]);
      testcases.push({
        input: escapeCode(String(data[key])).trim(),
        output: escapeCode(String(data[`output-${id}`])).trim(),
      });
      delete data[key];
    }
    if (key.startsWith("output")) {
      delete data[key];
    }
    if (key.startsWith("$ACTION")) {
      delete data[key];
    }
    if (key.startsWith("solution")) {
      solutions.push(String(data[key]));
      delete data[key];
    }
  }
  const name = data.name as string;
  const link = data.link as string;
  const difficulty = data.difficulty as Difficulty;
  const listName = data.list as PopularLists;
  const topicName = data.topic as string;
  const starterCode = escapeCode(data.placeholderCode as string);

  try {
    await addProblem(
      name,
      link,
      difficulty,
      starterCode,
      testcases,
      solutions,
      topicName,
      listName
    );
  } catch (error) {
    console.log("ERROR ADDING PROBLEM AND TESTCASES", error);
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
  const solutions: string[] = [];

  for (let key in data) {
    if (key.startsWith("input")) {
      const id = Number(key.split("-")[1]);
      testcases.push({
        input: escapeCode(String(data[key])).trim(),
        output: escapeCode(String(data[`output-${id}`])).trim(),
      });
      delete data[key];
    }
    if (key.startsWith("output")) {
      delete data[key];
    }
    if (key.startsWith("$ACTION")) {
      delete data[key];
    }
    if (key.startsWith("solution")) {
      solutions.push(String(data[key]));
      delete data[key];
    }
  }

  const name = data.name as string;
  const link = data.link as string;
  const difficulty = data.difficulty as Difficulty;
  const listName = data.list as PopularLists;
  const topicName = data.topic as string;
  const starterCode = escapeCode(data.placeholderCode as string);
  try {
    await updateProblem(
      id,
      name,
      link,
      difficulty,
      starterCode,
      testcases,
      solutions,
      topicName,
      listName
    );
  } catch (error) {
    console.log("ERROR UPDATING PROBLEM AND TESTCASES", error);
    return error;
  }
}
