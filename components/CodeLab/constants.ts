
import { TestCase } from '../../types';

export const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "Go", "Rust", "SQL", "Swift"
];

export const LANGUAGE_TEMPLATES: Record<string, string> = {
  "Python": `def solution(input_val):\n    # Write your code here\n    return input_val\n\n# Helper to run test\nif __name__ == "__main__":\n    pass`,
  "JavaScript": `function solution(input) {\n    // Write your code here\n    return input;\n}`,
  "TypeScript": `function solution(input: any): any {\n    // Write your code here\n    return input;\n}`,
  "Java": `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Result");\n    }\n}`,
  "C++": `#include <iostream>\n\nint main() {\n    std::cout << "Result" << std::endl;\n    return 0;\n}`,
  "C": `#include <stdio.h>\n\nint main() {\n    printf("Result\\n");\n    return 0;\n}`,
  "Go": `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Result")\n}`,
  "Rust": `fn main() {\n    println!("Result");\n}`,
  "SQL": `SELECT * FROM users;`,
  "Swift": `print("Result")`
};

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tag: string;
  description: string;
  testCasesList?: TestCase[];
}

const BASE_PROBLEMS: Problem[] = [
  { 
    id: '1', 
    title: 'Two Sum', 
    difficulty: 'Easy', 
    tag: 'Array',
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    testCasesList: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
      { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" }
    ]
  },
  { 
    id: '2', 
    title: 'Reverse Linked List', 
    difficulty: 'Medium', 
    tag: 'LinkedList',
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
    testCasesList: [
      { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { input: "[1,2]", expectedOutput: "[2,1]" },
      { input: "[]", expectedOutput: "[]" }
    ]
  },
  { 
    id: '3', 
    title: 'Valid Parentheses', 
    difficulty: 'Easy', 
    tag: 'Stack',
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    testCasesList: [
      { input: "\"()\"", expectedOutput: "true" },
      { input: "\"()[]{}\"", expectedOutput: "true" },
      { input: "\"(]\"", expectedOutput: "false" }
    ]
  },
  { 
    id: '4', 
    title: 'Merge K Sorted Lists', 
    difficulty: 'Hard', 
    tag: 'Heap',
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    testCasesList: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { input: "[]", expectedOutput: "[]" },
      { input: "[[]]", expectedOutput: "[]" }
    ]
  },
  { 
    id: '5', 
    title: 'Climbing Stairs', 
    difficulty: 'Easy', 
    tag: 'DP',
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    testCasesList: [
      { input: "n = 2", expectedOutput: "2" },
      { input: "n = 3", expectedOutput: "3" },
      { input: "n = 4", expectedOutput: "5" }
    ]
  }
];

// Generate more dummy problems to reach 100
const TAGS = ['Array', 'DP', 'String', 'Graph', 'Tree', 'Greedy', 'Backtracking', 'Math'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export const PROBLEMS: Problem[] = [...BASE_PROBLEMS];

for (let i = 6; i <= 100; i++) {
  const diff = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
  const tag = TAGS[Math.floor(Math.random() * TAGS.length)];
  PROBLEMS.push({
    id: i.toString(),
    title: `${tag} Optimization ${i}`,
    difficulty: diff,
    tag: tag,
    description: `This is a placeholder description for problem ${i}. In a real application, this would contain detailed requirements, constraints, and examples for a ${diff} ${tag} problem.`,
    testCasesList: [
      { input: "Standard Input 1", expectedOutput: "Expected 1" },
      { input: "Standard Input 2", expectedOutput: "Expected 2" },
      { input: "Edge Case", expectedOutput: "Expected Edge" }
    ]
  });
}