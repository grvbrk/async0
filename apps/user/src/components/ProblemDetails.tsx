import {
  BarChart2,
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  ExternalLink,
  Lightbulb,
  NotebookText,
  Tag,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";

const problem = {
  title: "Maximum Value of an Ordered Triplet I",
  difficulty: "Medium",
  description:
    "You are given a 0-indexed integer array nums. Return the maximum value over all triplets of indices (i, j, k) such that i < j < k. If all such triplets have a negative value, return 0. The value of a triplet of indices (i, j, k) is equal to (nums[i] - nums[j]) * nums[k].",
  examples: [
    {
      input: "nums = [12,6,1,2,7]",
      output: "77",
      explanation:
        "The value of the triplet (0, 2, 4) is (nums[0] - nums[2]) * nums[4] = (12 - 1) * 7 = 77. It can be shown that there's no triplet with a value greater than 77.",
    },
    {
      input: "nums = [1,10,3,4,19]",
      output: "133",
      explanation:
        "The value of the triplet (1, 2, 4) is (nums[1] - nums[2]) * nums[4] = (10 - 3) * 19 = 133. It can be shown that there's no triplet with a value greater than 133.",
    },
    {
      input: "nums = [1,10,3,4,19]",
      output: "133",
      explanation:
        "The value of the triplet (1, 2, 4) is (nums[1] - nums[2]) * nums[4] = (10 - 3) * 19 = 133. It can be shown that there's no triplet with a value greater than 133.",
    },
  ],
  timeComplexity: "O(n³)",
  spaceComplexity: "O(1)",
  tags: ["Array", "Enumeration"],
  company: "Google",
  recommendedDuration: "15 mins",
  usersCompleted: "9.54k done",
  stats: {
    acceptanceRate: "42.8%",
    submissions: "22.3k",
    recentSubmissions: "+342",
    optimalSolution: "O(n) time, O(1) space",
    beatPercentage: "98%",
  },
};

const difficultyColor = {
  Easy: "bg-green-100 text-green-800 hover:bg-green-100",
  Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Hard: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function ProblemDetails() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Tabs defaultValue="problem" className="w-full p-4">
      <TabsList className="grid w-full grid-cols-3 bg-transparen">
        <TabsTrigger
          className=" data-[state=active]:bg-foreground data-[state=active]:text-background"
          value="problem"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Problem</span>
        </TabsTrigger>
        <TabsTrigger
          className=" data-[state=active]:bg-foreground data-[state=active]:text-background"
          value="solutiion"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Solutions</span>
        </TabsTrigger>
        <TabsTrigger
          className=" data-[state=active]:bg-foreground data-[state=active]:text-background "
          value="submission"
        >
          <NotebookText className="h-3.5 w-3.5" />
          <span>Submissions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="problem">
        <Card className="mx-auto overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-800">
                  {problem.title}
                </CardTitle>
                <CardDescription className=" flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>{problem.recommendedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>{problem.usersCompleted}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${difficultyColor["Medium"]} font-medium border-0 `}
                >
                  {problem.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent>
            <div className="space-y-4">
              <div>
                <div
                  className={`text-slate-700 leading-relaxed ${!expanded && problem.description.length > 200 ? "line-clamp-3" : ""}`}
                >
                  {problem.description}
                </div>
                {problem.description.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 p-0 h-auto font-normal mt-1 group hover:bg-transparent"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <span className="flex items-center">
                        Show less
                        <ChevronUp className="ml-1 h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Show more
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {problem.examples
                  .slice(0, expanded ? problem.examples.length : 1)
                  .map((example, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 p-3 rounded-md border border-slate-100 "
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-sm text-slate-700">
                            Example {index + 1}:
                          </span>
                        </div>
                        <div className="pl-4 space-y-1.5">
                          <div className="font-mono text-sm text-slate-700">
                            <span className="text-slate-500">Input: </span>
                            {example.input}
                          </div>
                          <div className="font-mono text-sm text-slate-700">
                            <span className="text-slate-500">Output: </span>
                            {example.output}
                          </div>
                          {example.explanation && (
                            <div className="text-sm text-slate-600">
                              <span className="text-slate-500">
                                Explanation:{" "}
                              </span>
                              {example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {problem.examples.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 p-0 h-auto font-normal group transition-all "
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <span className="flex items-center ">
                        Show less
                        <ChevronUp className="ml-1 h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Show {problem.examples.length - 1} more example
                        {problem.examples.length > 2 ? "s" : ""}
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>
                )}
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700 p-2 rounded-md">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>Time: {problem.timeComplexity}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 p-2 rounded-md">
                  <BarChart2 className="h-4 w-4 text-slate-500" />
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-slate-50 text-slate-700  "
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="solutiion" className="space-y-4">
        <Card className="p-4">
          <h3 className="mb-2 font-medium">Example 1:</h3>
          <div className="rounded-md bg-muted p-3 font-mono text-sm">
            <p>
              <strong>Input:</strong> nums = [2,7,11,15], target = 9
            </p>
            <p>
              <strong>Output:</strong> [0,1]
            </p>
            <p>
              <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we
              return [0, 1].
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 font-medium">Example 2:</h3>
          <div className="rounded-md bg-muted p-3 font-mono text-sm">
            <p>
              <strong>Input:</strong> nums = [3,2,4], target = 6
            </p>
            <p>
              <strong>Output:</strong> [1,2]
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 font-medium">Example 3:</h3>
          <div className="rounded-md bg-muted p-3 font-mono text-sm">
            <p>
              <strong>Input:</strong> nums = [3,3], target = 6
            </p>
            <p>
              <strong>Output:</strong> [0,1]
            </p>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="submission" className="space-y-4">
        <Card className="p-4">
          <h3 className="mb-2 font-medium">Hint 1:</h3>
          <p>
            A really brute force way would be to search for all possible pairs
            of numbers but that would be too slow.
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 font-medium">Hint 2:</h3>
          <p>Try to use a hashmap to reduce the looking up time complexity.</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
