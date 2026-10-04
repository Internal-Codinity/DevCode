import { problemsData } from "@/data/problems"

interface WorkspaceFile {
  name: string
  contentType: "application/json" | "text/markdown" | "text/plain" | "text/x-python"
  content: string
}

export interface ProblemFixture {
  input: string
  expected: string
}

const RUNNER_TEMPLATE = `# Your submitted Python code is mounted at /workspace/solution.py.
# The execution environment has no network access and only the Python standard library.
print("Write your solution, then select Run Code.")
`

export function getProblemWorkspace(problemId: string): WorkspaceFile[] | undefined {
  const problem = problemsData.find((candidate) => candidate.id === problemId)

  if (!problem) return undefined

  return [
    {
      name: "README.md",
      contentType: "text/markdown",
      content: `# ${problem.title}\n\n${stripHtml(problem.description)}\n`,
    },
    {
      name: "test_input.txt",
      contentType: "text/plain",
      content: problem.exampleInput ?? "",
    },
    {
      name: "solution.py",
      contentType: "text/x-python",
      content: RUNNER_TEMPLATE,
    },
  ]
}

export function getWorkspaceFile(problemId: string, fileName: string): WorkspaceFile | undefined {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(fileName)) return undefined

  return getProblemWorkspace(problemId)?.find((file) => file.name === fileName)
}

export function getProblemFixture(problemId: string, fixtureIndex: number): ProblemFixture | undefined {
  // Canonical fixtures are database-only and are intentionally unavailable to
  // the browser-facing runner endpoint. The judge worker loads them directly
  // from PostgreSQL before calling createJudgeExecution.
  void problemId
  void fixtureIndex
  return undefined
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\n\s+/g, "\n").trim()
}
