import { randomUUID } from "node:crypto"
import { Client } from "pg"
import { problemsData } from "../data/problems"
import { problemFixtures } from "../data/problem-fixtures.server"

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed problems.")
  const client = new Client({ connectionString: databaseUrl, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined })
  await client.connect()
  try {
    await client.query("BEGIN")
    for (const problem of problemsData) {
    await client.query(
      `INSERT INTO problems (id, title, description, difficulty, category, tags, requirements, example_input, example_output, constraints, is_published)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10::jsonb, TRUE)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, difficulty = EXCLUDED.difficulty,
         category = EXCLUDED.category, tags = EXCLUDED.tags, requirements = EXCLUDED.requirements, example_input = EXCLUDED.example_input,
         example_output = EXCLUDED.example_output, constraints = EXCLUDED.constraints, is_published = TRUE, updated_at = NOW()`,
      [problem.id, problem.title, problem.description, problem.difficulty, problem.category, JSON.stringify(problem.tags), JSON.stringify(problem.requirements ?? []), problem.exampleInput ?? null, problem.exampleOutput ?? null, JSON.stringify(problem.constraints ?? [])],
    )
    for (const fixture of problemFixtures[problem.id] ?? []) {
      await client.query(
        `INSERT INTO problem_test_cases (id, problem_id, ordinal, name, input, expected_output, visibility)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (problem_id, ordinal) DO UPDATE SET name = EXCLUDED.name, input = EXCLUDED.input,
           expected_output = EXCLUDED.expected_output, visibility = EXCLUDED.visibility`,
        [randomUUID(), problem.id, fixture.ordinal, fixture.name, fixture.input, fixture.expectedOutput, fixture.visibility],
      )
    }
    }
    await client.query("COMMIT")
    console.info(`Seeded ${problemsData.length} published problems and private fixtures.`)
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

void main().catch((error) => { console.error(error); process.exitCode = 1 })
