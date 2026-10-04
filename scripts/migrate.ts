import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { Client } from "pg"

async function main() {
  const migrationDirectory = join(process.cwd(), "database", "migrations")
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required to apply migrations.")
  const client = new Client({ connectionString: databaseUrl, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined })
  await client.connect()
  try {
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())")
    const applied = new Set((await client.query<{ name: string }>("SELECT name FROM schema_migrations")).rows.map((row) => row.name))
    const migrations = (await readdir(migrationDirectory)).filter((name) => name.endsWith(".sql")).sort()
    for (const name of migrations) {
      if (applied.has(name)) continue
      const sql = await readFile(join(migrationDirectory, name), "utf8")
      await client.query("BEGIN")
      try {
        await client.query(sql)
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name])
        await client.query("COMMIT")
        console.info(`Applied ${name}`)
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      }
    }
  } finally {
    await client.end()
  }
}

void main().catch((error) => { console.error(error); process.exitCode = 1 })
