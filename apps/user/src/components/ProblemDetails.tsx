import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function ProblemDetails() {
  return (
    <div className="h-full overflow-auto p-4">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="hints">Hints</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Given an array of integers <code>nums</code> and an integer{" "}
              <code>target</code>, return indices of the two numbers such that
              they add up to <code>target</code>.
            </p>
            <p>
              You may assume that each input would have{" "}
              <strong>exactly one solution</strong>, and you may not use the
              same element twice.
            </p>
            <p>You can return the answer in any order.</p>

            <h3>Constraints:</h3>
            <ul>
              <li>
                2 ≤ nums.length ≤ 10<sup>4</sup>
              </li>
              <li>
                -10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup>
              </li>
              <li>
                -10<sup>9</sup> ≤ target ≤ 10<sup>9</sup>
              </li>
              <li>
                <strong>Only one valid answer exists.</strong>
              </li>
            </ul>

            <h3>Follow-up:</h3>
            <p>
              Can you come up with an algorithm that is less than O(n²) time
              complexity?
            </p>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
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

        <TabsContent value="hints" className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-2 font-medium">Hint 1:</h3>
            <p>
              A really brute force way would be to search for all possible pairs
              of numbers but that would be too slow.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-2 font-medium">Hint 2:</h3>
            <p>
              Try to use a hashmap to reduce the looking up time complexity.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
