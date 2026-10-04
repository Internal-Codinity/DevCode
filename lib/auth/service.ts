import "server-only"

import { randomUUID } from "node:crypto"
import nodemailer from "nodemailer"
import { query, transaction } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { hashSecret, newOpaqueToken, type SessionUser } from "@/lib/auth/session"

interface UserRecord extends SessionUser {
  passwordHash: string
  emailVerifiedAt: string | null
}

const AUTH_WINDOW_MINUTES = 15
const AUTH_MAX_ATTEMPTS = 8

export async function registerUser(input: { email: string; displayName: string; password: string }, request: Request) {
  const email = normalizeEmail(input.email)
  const displayName = input.displayName.trim()
  if (displayName.length < 2 || displayName.length > 80) throw new AuthValidationError("Display name must be between 2 and 80 characters.")
  await assertRateLimit("register", rateLimitIdentifier(request, email))

  const passwordHash = await hashPassword(input.password)
  const user = await transaction(async (client) => {
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rowCount) throw new AuthConflictError("An account already exists for this email address.")
    const id = randomUUID()
    await client.query("INSERT INTO users (id, email, display_name, password_hash) VALUES ($1, $2, $3, $4)", [id, email, displayName, passwordHash])
    return { id, email, displayName }
  })

  const verification = await createAccountToken(user.id, "verify_email", 24 * 60 * 60)
  const verificationUrl = `${appUrl()}/api/auth/verify-email?token=${encodeURIComponent(verification)}`
  await sendAccountEmail({ to: email, subject: "Verify your Codura account", text: `Verify your email by opening this link: ${verificationUrl}`, developmentUrl: verificationUrl })
  return { user, developmentVerificationUrl: process.env.NODE_ENV === "production" ? undefined : verificationUrl }
}

export async function authenticateUser(input: { email: string; password: string }, request: Request) {
  const email = normalizeEmail(input.email)
  await assertRateLimit("login", rateLimitIdentifier(request, email))
  const result = await query<UserRecord>(
    `SELECT id, email, display_name AS "displayName", password_hash AS "passwordHash", email_verified_at AS "emailVerifiedAt"
     FROM users WHERE email = $1 LIMIT 1`,
    [email],
  )
  const user = result.rows[0]
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) throw new AuthValidationError("Invalid email or password.")
  if (!user.emailVerifiedAt) throw new EmailVerificationRequiredError()
  return { id: user.id, email: user.email, displayName: user.displayName }
}

export async function verifyEmail(token: string) {
  const userId = await consumeAccountToken(token, "verify_email")
  if (!userId) throw new AuthValidationError("This verification link is invalid or has expired.")
  await query("UPDATE users SET email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW() WHERE id = $1", [userId])
  return userId
}

export async function requestPasswordReset(emailInput: string, request: Request) {
  const email = normalizeEmail(emailInput)
  await assertRateLimit("password_reset", rateLimitIdentifier(request, email))
  const result = await query<{ id: string }>("SELECT id FROM users WHERE email = $1 AND email_verified_at IS NOT NULL LIMIT 1", [email])
  const user = result.rows[0]
  if (!user) return undefined
  const token = await createAccountToken(user.id, "reset_password", 60 * 60)
  const resetUrl = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`
  await sendAccountEmail({ to: email, subject: "Reset your Codura password", text: `Reset your password by opening this link: ${resetUrl}`, developmentUrl: resetUrl })
  return process.env.NODE_ENV === "production" ? undefined : resetUrl
}

export async function resetPassword(token: string, password: string) {
  const userId = await consumeAccountToken(token, "reset_password")
  if (!userId) throw new AuthValidationError("This password reset link is invalid or has expired.")
  const passwordHash = await hashPassword(password)
  await transaction(async (client) => {
    await client.query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [passwordHash, userId])
    await client.query("DELETE FROM user_sessions WHERE user_id = $1", [userId])
  })
  return userId
}

async function createAccountToken(userId: string, purpose: "verify_email" | "reset_password", lifetimeSeconds: number) {
  const token = newOpaqueToken()
  const expiresAt = new Date(Date.now() + lifetimeSeconds * 1000)
  await transaction(async (client) => {
    await client.query("DELETE FROM account_tokens WHERE user_id = $1 AND purpose = $2", [userId, purpose])
    await client.query("INSERT INTO account_tokens (id, user_id, token_hash, purpose, expires_at) VALUES ($1, $2, $3, $4, $5)", [randomUUID(), userId, hashSecret(token), purpose, expiresAt])
  })
  return token
}

async function consumeAccountToken(token: string, purpose: "verify_email" | "reset_password") {
  return transaction(async (client) => {
    const result = await client.query<{ user_id: string }>(
      `UPDATE account_tokens SET consumed_at = NOW()
       WHERE token_hash = $1 AND purpose = $2 AND consumed_at IS NULL AND expires_at > NOW()
       RETURNING user_id`,
      [hashSecret(token), purpose],
    )
    return result.rows[0]?.user_id
  })
}

async function assertRateLimit(action: "register" | "login" | "password_reset", identifierHash: string) {
  const attempts = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM auth_attempts
     WHERE action = $1 AND identifier_hash = $2 AND attempted_at > NOW() - ($3::text || ' minutes')::interval`,
    [action, identifierHash, AUTH_WINDOW_MINUTES],
  )
  if (Number(attempts.rows[0]?.count ?? 0) >= AUTH_MAX_ATTEMPTS) throw new AuthRateLimitError()
  await query("INSERT INTO auth_attempts (action, identifier_hash) VALUES ($1, $2)", [action, identifierHash])
}

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthValidationError("Enter a valid email address.")
  return email
}

function rateLimitIdentifier(request: Request, email: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  return hashSecret(`${ip}:${email}`)
}

function appUrl() {
  const configured = process.env.APP_URL
  if (configured) return configured.replace(/\/$/, "")
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000"
  throw new Error("APP_URL is required in production.")
}

async function sendAccountEmail({ to, subject, text, developmentUrl }: { to: string; subject: string; text: string; developmentUrl: string }) {
  const host = process.env.SMTP_HOST
  const from = process.env.SMTP_FROM
  if (!host || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Codura development email] ${subject} for ${to}: ${developmentUrl}`)
      return
    }
    throw new Error("SMTP_HOST and SMTP_FROM are required in production.")
  }
  const port = Number(process.env.SMTP_PORT ?? 587)
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  })
  await transporter.sendMail({ from, to, subject, text })
}

export class AuthValidationError extends Error {}
export class AuthConflictError extends Error {}
export class AuthRateLimitError extends Error {}
export class EmailVerificationRequiredError extends Error {}
