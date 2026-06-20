"use client";

import { getAllLists } from "@/lib/list";
import { getAllTopics } from "@/lib/topic";
import { createProblem } from "@/lib/problem";
import {
  List,
  ProblemBody,
  ProblemFormdata,
  Solution,
  Testcase,
  Topic,
} from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export default function ProblemForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (data: ProblemBody) => {
      return await createProblem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Problem created successfully!");
    },
    onError: (error) => {
      console.error("Failed to submit problem:", error);
      toast.error("Failed to submit problem. Check console for more info.");
    },
  });

  const { data: listData } = useQuery({
    queryKey: ["list"],
    queryFn: getAllLists,
  });

  const { data: topicData } = useQuery({
    queryKey: ["topic"],
    queryFn: getAllTopics,
  });

  const [formData, setFormData] = useState<ProblemFormdata>({
    name: "",
    slug: "",
    description: "",
    link: "",
    problem_number: 0,
    difficulty: "NA",
    starter_code: "",
    time_limit: 2000,
    memory_limit: 256,
    is_active: true,
    selectedTopics: [],
    selectedLists: [],
    testcases: [{ ui: "", input: "", output: "" }],
    solutions: [],
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listData) {
      setLists(listData.data);
    } else {
      toast.error("Failed to load lists");
    }

    if (topicData) {
      setTopics(topicData.data);
    } else {
      toast.error("Failed to load topics");
    }
  }, [listData, topicData]);

  function handleInputChange(field: keyof ProblemFormdata, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function handleTopicToggle(topicId: string) {
    setFormData((prev) => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topicId)
        ? prev.selectedTopics.filter((id) => id !== topicId)
        : [...prev.selectedTopics, topicId],
    }));
  }

  function handleListToggle(listId: string) {
    setFormData((prev) => ({
      ...prev,
      selectedLists: prev.selectedLists.includes(listId)
        ? prev.selectedLists.filter((id) => id !== listId)
        : [...prev.selectedLists, listId],
    }));
  }

  function handleTestCaseChange(
    index: number,
    field: keyof Testcase,
    value: string,
  ) {
    setFormData((prev) => ({
      ...prev,
      testcases: prev.testcases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc,
      ),
    }));
  }

  function handleSolutionChange(
    index: number,
    field: keyof Solution,
    value: string | number | boolean,
  ) {
    setFormData((prev) => ({
      ...prev,
      solutions: prev.solutions.map((sol, i) =>
        i === index ? { ...sol, [field]: value } : sol,
      ),
    }));
  }

  function addSolution() {
    setFormData((prev) => ({
      ...prev,
      solutions: [
        ...prev.solutions,
        {
          title: "",
          hint: "",
          description: "",
          code: "",
          code_explanation: "",
          notes: "",
          time_complexity: "",
          space_complexity: "",
          difficulty_level: "MEDIUM",
          display_order: prev.solutions.length,
          author: "",
          is_active: true,
        },
      ],
    }));
  }

  function removeSolution(index: number) {
    setFormData((prev) => ({
      ...prev,
      solutions: prev.solutions
        .filter((_, i) => i !== index)
        .map((sol, i) => ({ ...sol, display_order: i })),
    }));
  }

  function addTestCase() {
    if (formData.testcases.length < 5) {
      setFormData((prev) => ({
        ...prev,
        testcases: [...prev.testcases, { ui: "", input: "", output: "" }],
      }));
    }
  }

  function removeTestCase(index: number) {
    if (formData.testcases.length > 1) {
      setFormData((prev) => ({
        ...prev,
        testcases: prev.testcases.filter((_, i) => i !== index),
      }));
    }
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Problem name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.starter_code.trim())
      newErrors.starter_code = "Starter code is required";
    if (
      formData.testcases.some(
        (tc) => !tc.ui.trim() || !tc.input.trim() || !tc.output.trim(),
      )
    ) {
      newErrors.testcases = "All test case fields are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submissionData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        link: formData.link,
        problem_number: formData.problem_number ? formData.problem_number : 0,
        difficulty: formData.difficulty as "EASY" | "MEDIUM" | "HARD" | "NA",
        starter_code: formData.starter_code,
        time_limit: formData.time_limit,
        memory_limit: formData.memory_limit,
        is_active: formData.is_active,
        topics: formData.selectedTopics,
        lists: formData.selectedLists,
        testcases: formData.testcases.map((testCase, index) => ({
          ...testCase,
          position: index,
        })),
        solutions: formData.solutions.map((solution, index) => ({
          ...solution,
          display_order: index,
        })),
      };

      mutate(submissionData);

      // router.push("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Failed to create problem. Please check your JSON syntax.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-primary">
      <div className="container mx-auto py-12 max-w-5xl">
        <div className="flex items-center gap-6 mb-10">
          <Button
            variant="ghost"
            onClick={() => router.push("/problems")}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problems
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mx-6">
          <Card className="border-1 border-primary/50 backdrop-blur-sm bg-secondary">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Problem Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Two Sum"
                    className="h-12 text-base"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="slug"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="two-sum"
                    className="h-12 text-base font-mono"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-medium text-muted-foreground"
                >
                  Problem Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                  rows={4}
                  className="text-base resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="problem_number"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Problem Number
                  </Label>
                  <Input
                    id="problem_number"
                    type="number"
                    value={formData.problem_number}
                    onChange={(e) =>
                      handleInputChange("problem_number", e.target.value)
                    }
                    placeholder="1"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="difficulty"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Difficulty
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleInputChange("difficulty", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                      <SelectItem value="NA">Not Assigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="link"
                    className="text-base font-medium text-muted-foreground"
                  >
                    External Link
                  </Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    placeholder="https://leetcode.com/problems/two-sum"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="time_limit"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Time Limit (ms)
                  </Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) =>
                      handleInputChange("time_limit", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="memory_limit"
                    className="text-base font-medium text-muted-foreground"
                  >
                    Memory Limit (MB)
                  </Label>
                  <Input
                    id="memory_limit"
                    type="number"
                    value={formData.memory_limit}
                    onChange={(e) =>
                      handleInputChange("memory_limit", e.target.value)
                    }
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_active", checked)
                  }
                  className="w-5 h-5"
                />
                <Label
                  htmlFor="is_active"
                  className="text-base font-medium text-muted-foreground"
                >
                  Problem is active
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-1 border-primary/50 backdrop-blur-sm bg-secondary">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Code Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="starter_code"
                  className="text-base font-medium text-muted-foreground"
                >
                  Starter Code (JSON) *
                </Label>
                <Textarea
                  id="starter_code"
                  value={formData.starter_code}
                  onChange={(e) =>
                    handleInputChange("starter_code", e.target.value)
                  }
                  placeholder="function productExceptSelf(nums) {\r\n    \/\/ todo\r\n}"
                  rows={4}
                  className="text-base"
                />
                {errors.starter_code && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.starter_code}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-1 border-primary/50 backdrop-blur-sm bg-secondary">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Topics & Lists
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium text-muted-foreground">
                  Topics
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant={
                        formData.selectedTopics.includes(topic.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleTopicToggle(topic.id)}
                    >
                      {topic.name}
                      {formData.selectedTopics.includes(topic.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium text-muted-foreground">
                  Lists
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lists.map((list) => (
                    <Badge
                      key={list.id}
                      variant={
                        formData.selectedLists.includes(list.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleListToggle(list.id)}
                    >
                      {list.name}
                      {formData.selectedLists.includes(list.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-1 border-primary/50 backdrop-blur-sm bg-secondary">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Test Cases (1-5 required)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.testcases.map((testCase, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Test Case {index + 1}</h4>
                    {formData.testcases.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestCase(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Test Case Name</Label>
                      <Input
                        value={testCase.ui}
                        onChange={(e) =>
                          handleTestCaseChange(index, "ui", e.target.value)
                        }
                        placeholder="Basic test"
                        className="h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Input</Label>
                      <Textarea
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(index, "input", e.target.value)
                        }
                        placeholder="[2,7,11,15], 9"
                        rows={2}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expected Output</Label>
                      <Textarea
                        value={testCase.output}
                        onChange={(e) =>
                          handleTestCaseChange(index, "output", e.target.value)
                        }
                        placeholder="[0,1]"
                        rows={2}
                        className="text-base"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {errors.testcases && (
                <p className="text-sm text-red-600">{errors.testcases}</p>
              )}

              {formData.testcases.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTestCase}
                  className="flex items-center gap-2 bg-transparent text-base font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Test Case
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-1 border-primary/50 backdrop-blur-sm bg-secondary">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Problem Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {formData.solutions.map((solution, index) => (
                <div key={index} className="border-2 rounded-xl p-6 space-y-6 ">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">
                      Solution {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSolution(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Solution Title
                      </Label>
                      <Input
                        value={solution.title}
                        onChange={(e) =>
                          handleSolutionChange(index, "title", e.target.value)
                        }
                        placeholder="Brute Force Approach"
                        className="h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Hint
                      </Label>
                      <Input
                        value={solution.hint}
                        onChange={(e) =>
                          handleSolutionChange(index, "hint", e.target.value)
                        }
                        placeholder="Use a hash map for O(1) lookup"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-muted-foreground">
                      Description
                    </Label>
                    <Textarea
                      value={solution.description}
                      onChange={(e) =>
                        handleSolutionChange(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Detailed explanation of the approach..."
                      rows={3}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-muted-foreground">
                      Solution Code
                    </Label>
                    <Textarea
                      value={solution.code}
                      onChange={(e) =>
                        handleSolutionChange(index, "code", e.target.value)
                      }
                      placeholder="def two_sum(nums, target):&#10;    # Your solution code here&#10;    pass"
                      rows={6}
                      className="text-base font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-muted-foreground">
                      Code Explanation
                    </Label>
                    <Textarea
                      value={solution.code_explanation}
                      onChange={(e) =>
                        handleSolutionChange(
                          index,
                          "code_explanation",
                          e.target.value,
                        )
                      }
                      placeholder="Step-by-step explanation of the code..."
                      rows={3}
                      className="text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Time Complexity
                      </Label>
                      <Input
                        value={solution.time_complexity}
                        onChange={(e) =>
                          handleSolutionChange(
                            index,
                            "time_complexity",
                            e.target.value,
                          )
                        }
                        placeholder="O(n)"
                        className="h-12 text-base font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Space Complexity
                      </Label>
                      <Input
                        value={solution.space_complexity}
                        onChange={(e) =>
                          handleSolutionChange(
                            index,
                            "space_complexity",
                            e.target.value,
                          )
                        }
                        placeholder="O(n)"
                        className="h-12 text-base font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Difficulty Level
                      </Label>
                      <Select
                        value={solution.difficulty_level}
                        onValueChange={(value) =>
                          handleSolutionChange(index, "difficulty_level", value)
                        }
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium text-muted-foreground">
                        Author
                      </Label>
                      <Input
                        value={solution.author}
                        onChange={(e) =>
                          handleSolutionChange(index, "author", e.target.value)
                        }
                        placeholder="John Doe"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-muted-foreground">
                      Additional Notes
                    </Label>
                    <Textarea
                      value={solution.notes}
                      onChange={(e) =>
                        handleSolutionChange(index, "notes", e.target.value)
                      }
                      placeholder="Any additional notes or considerations..."
                      rows={2}
                      className="text-base"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={solution.is_active}
                      onCheckedChange={(checked) =>
                        handleSolutionChange(index, "is_active", checked)
                      }
                      className="w-5 h-5"
                    />
                    <Label className="text-base font-medium text-muted-foreground">
                      Solution is active
                    </Label>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSolution}
                className="flex items-center gap-2 bg-transparent text-base font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Solution
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-40 h-12 text-base font-medium bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Creating..." : "Create Problem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
