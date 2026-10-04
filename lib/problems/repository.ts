import "server-only"

import { query } from "@/lib/db"
import { isDatabaseError } from "@/lib/db"
import type { Problem } from "@/types/problem"
import { problemsData } from "@/data/problems"

interface ProblemRow {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  tags: string[]
  requirements: string[]
  exampleInput: string | null
  exampleOutput: string | null
  constraints: string[]
}

const publicFields = `id, title, description, difficulty, category, tags, requirements,
  example_input AS "exampleInput", example_output AS "exampleOutput", constraints`

export async function listPublishedProblems(): Promise<Problem[]> {
  try {
    const result = await query<ProblemRow>(`SELECT ${publicFields} FROM problems WHERE is_published = TRUE ORDER BY created_at ASC`)
    return result.rows.map(toProblem)
  } catch (error) {
    if (isDatabaseError(error)) throw error
    // Fallback to local data when DB is not configured (dev/demo)
    return problemsData
  }
}

export async function findPublishedProblem(id: string): Promise<Problem | null> {
  try {
    const result = await query<ProblemRow>(`SELECT ${publicFields} FROM problems WHERE id = $1 AND is_published = TRUE LIMIT 1`, [id])
    const row = result.rows[0]
    if (!row) return null
    const samples = await query<{ name: string; input: string; expected: string }>(
      `SELECT name, input, expected_output AS expected
       FROM problem_test_cases WHERE problem_id = $1 AND visibility = 'sample' ORDER BY ordinal ASC`,
      [id],
    )
    return { ...toProblem(row), sampleTests: samples.rows }
  } catch (error) {
    if (isDatabaseError(error)) throw error
    // Fallback: find in local data
    const local = problemsData.find((p) => p.id === id) ?? null
    if (!local) return null
    try {
      const { problemFixtures } = await import("@/data/problem-fixtures.server")
      const fixtures = (problemFixtures as Record<string, any>)[id] ?? []
      const samples = fixtures.filter((f: any) => f.visibility === "sample").map((f: any) => ({ name: f.name, input: f.input, expected: f.expectedOutput ?? f.expected }))
      return { ...local, sampleTests: samples }
    } catch {
      return local
    }
  }
}

function toProblem(row: ProblemRow): Problem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    tags: row.tags,
    requirements: row.requirements,
    exampleInput: row.exampleInput ?? undefined,
    exampleOutput: row.exampleOutput ?? undefined,
    constraints: row.constraints,
  }
}
