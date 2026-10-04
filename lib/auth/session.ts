import "server-only"

import { createHash, randomBytes, randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-codium_session" : "codium_session"

export interface SessionUser {
  id: string
  email: string
  displayName: string
}

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function newOpaqueToken() {
  return randomBytes(32).toString("base64url")
}

export async function createSession(userId: string, request: Request) {
  const token = newOpaqueToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000)
  await query(
    `INSERT INTO user_sessions (id, user_id, token_hash, expires_at, ip_hash, user_agent_hash)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [randomUUID(), userId, hashSecret(token), expiresAt, clientIpHash(request), clientAgentHash(request)],
  )
  return { token, expiresAt }
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return findSessionUser(token)
}

export async function findSessionUser(token: string): Promise<SessionUser | null> {
  const result = await query<SessionUser>(
    `SELECT users.id, users.email, users.display_name AS "displayName"
     FROM user_sessions
     JOIN users ON users.id = user_sessions.user_id
     WHERE user_sessions.token_hash = $1 AND user_sessions.expires_at > NOW()
     LIMIT 1`,
    [hashSecret(token)],
  )
  return result.rows[0] ?? null
}

export async function revokeCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) await query("DELETE FROM user_sessions WHERE token_hash = $1", [hashSecret(token)])
  await clearSessionCookie()
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new AuthenticationError()
  return user
}

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication is required.")
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return
  if (origin !== new URL(request.url).origin) throw new AuthenticationError()
}

function clientIpHash(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  return hashSecret(ip)
}

function clientAgentHash(request: Request) {
  return hashSecret(request.headers.get("user-agent") ?? "unknown")
}
