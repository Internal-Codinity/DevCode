import { Pool, type PoolClient, type QueryResultRow } from "pg"

declare global {
  var __codiumDbPool: Pool | undefined | null
}

function databaseUrl() {
  return process.env.DATABASE_URL ?? null
}

function createPool() {
  const url = databaseUrl()
  if (!url) return null
  return new Pool({
    connectionString: url,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  })
}

export const db: Pool | null = global.__codiumDbPool ?? (global.__codiumDbPool = createPool())

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: readonly unknown[] = []) {
  if (!db) throw new Error("No database configured")
  return db.query<T>(text, [...values])
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  if (!db) throw new Error("No database configured")
  const client = await db.connect()
  try {
    await client.query("BEGIN")
    const value = await work(client)
    await client.query("COMMIT")
    return value
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export function isDatabaseError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error)
}
