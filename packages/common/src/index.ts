import { ComponentType } from "react";
import DuplicateInteger from "./problem-ui/DuplicateInteger";
import ReverseLL from "./problem-ui/ReverseLL";
import DiameterOfBinaryTree from "./problem-ui/DiameterOfBinaryTree";
import { reverseLL } from "./driver-code/reverseLL";
import { isAnagram } from "./driver-code/isAnagram";
import { invertBTree } from "./driver-code/invertBTree";
import { depthOfBTree } from "./driver-code/depthOfBTree";
import { isSameTree } from "./driver-code/sameBinaryTree";
import { isBalanced } from "./driver-code/balancedBTree";
import { diameterOfBinaryTree } from "./driver-code/diameterOfBinaryTree";
import { isSubtree } from "./driver-code/isSubtree";
import MaxDepthOfBTree from "./problem-ui/MaxDepthofBTree";
import IsSameTree from "./problem-ui/IsSameTree";
import IsBalancedBTree from "./problem-ui/isBalancedBTree";
import InvertTree from "./problem-ui/InvertTree";
import IsSubtree from "./problem-ui/isSubtree";
import NumIslands from "./problem-ui/NumIslands";
import { numIslands } from "./driver-code/numIslands";
import { maxAreaOfIsland } from "./driver-code/maxAreaOfIsland";
import MaxAreaOfIsland from "./problem-ui/MaxAreaOfIsland";
import TwoSum from "./problem-ui/TwoSum";
import IsAnagram from "./problem-ui/IsAnagram";
import { twoSum } from "./driver-code/twoSum";
import { groupAnagrams } from "./driver-code/groupAnagrams";
import { encodeDecode } from "./driver-code/encodeDecode";
import { productExceptSelf } from "./driver-code/productExceptSelf";
import { isValidSudoku } from "./driver-code/isValidSudoku";
import { longestConsecutive } from "./driver-code/longestConsecutive";
import { validPalindrome } from "./driver-code/validPalindrome";
import { twoSumII } from "./driver-code/twoSumII";
import { topKFrequent } from "./driver-code/topKFrequent";
import { hasDuplicate } from "./driver-code/hasDuplicate";

export const problemDriverCode: Record<string, any> = {
  // Arrays & Hashing
  duplicateinteger: hasDuplicate,
  isanagram: isAnagram,
  twosum: twoSum,
  groupanagrams: groupAnagrams,
  topkfrequentelements: topKFrequent,
  encodeanddecodestrings: encodeDecode,
  productofarrayexceptself: productExceptSelf,
  validsoduko: isValidSudoku,
  longestconsecutivesequence: longestConsecutive,

  //Two Pointers
  validpalindrome: validPalindrome,
  twointegersumii: twoSumII,

  reversealinkedlist: reverseLL,
  invertabinarytree: invertBTree,
  maximumdepthofbinarytree: depthOfBTree,
  samebinarytree: isSameTree,
  balancedbinarytree: isBalanced,
  binarytreediameter: diameterOfBinaryTree,
  subtreeofabinarytree: isSubtree,
  numberofislands: numIslands,
  maxareaofisland: maxAreaOfIsland,
};

export const problemDescriptions: Record<string, ComponentType<any>> = {
  "Duplicate Integer": DuplicateInteger,
  "Is Anagram": IsAnagram,
  "Reverse a Linked List": ReverseLL,
  "Binary Tree Diameter": DiameterOfBinaryTree,
  "Maximum Depth of Binary Tree": MaxDepthOfBTree,
  "Same Binary Tree": IsSameTree,
  "Balanced Binary Tree": IsBalancedBTree,
  "Invert A Binary Tree": InvertTree,
  "Subtree of a Binary Tree": IsSubtree,
  "Number of Islands": NumIslands,
  "Max Area of Island": MaxAreaOfIsland,
  "Two Sum": TwoSum,
};

export function unescapeCode(code: string | undefined): string | void {
  if (code === undefined) return;
  else {
    return code
      .replace(/\\r\\n/g, "\n")
      .replace(/\\\//g, "/")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

export function escapeCode(code: string): string {
  return code
    .replace(/\\/g, "\\\\") // Replace \ with \\
    .replace(/"/g, '\\"') // Replace " with \"
    .replace(/'/g, "\\'") // Replace ' with \'
    .replace(/\n/g, "\\n") // Replace newline with \n
    .replace(/\r/g, "\\r") // Replace carriage return with \r
    .replace(/\t/g, "\\t") // Replace tab with \t
    .replace(/\//g, "\\/"); // Replace / with \/
}

export type judge0ValueKeyType = {
  stdout: string | null;
  time: string | null;
  memory: number | null;
  stderr: string;
  token: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string | null };
  output?: string | null;
};
