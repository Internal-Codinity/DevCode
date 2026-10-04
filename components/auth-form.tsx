"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const verified = searchParams.get("verification") === "complete"

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null)
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      const payload = await response.json() as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? "Unable to sign in.")
      router.replace("/problems")
      router.refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign in.") } finally { setBusy(false) }
  }
  return <AuthCard title="Sign in" description="Access your submissions, verdicts, and solved problems."><form className="space-y-4" onSubmit={submit}>{verified ? <Notice text="Your email is verified. You can now sign in." /> : null}<Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" /><Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" /><ErrorText error={error} /><Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button><div className="flex justify-between text-sm"><Link className="underline" href="/forgot-password">Forgot password?</Link><Link className="underline" href="/register">Create account</Link></div></form></AuthCard>
}

export function RegisterForm() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [developmentUrl, setDevelopmentUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null); setMessage(null)
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName, email, password }) })
      const payload = await response.json() as { error?: string; developmentVerificationUrl?: string }
      if (!response.ok) throw new Error(payload.error ?? "Unable to create your account.")
      setMessage("Check your email for the verification link before signing in.")
      setDevelopmentUrl(payload.developmentVerificationUrl ?? null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create your account.") } finally { setBusy(false) }
  }
  return <AuthCard title="Create account" description="Your submissions and verdicts will be stored securely with this account."><form className="space-y-4" onSubmit={submit}><Field id="display-name" label="Display name" value={displayName} onChange={setDisplayName} autoComplete="name" /><Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" /><Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 12 characters, with upper/lowercase letters and a number." /><ErrorText error={error} />{message ? <Notice text={message} /> : null}{developmentUrl ? <p className="rounded border border-amber-500/50 p-3 text-sm">Development-only verification link: <a className="underline" href={developmentUrl}>verify account</a></p> : null}<Button className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button><p className="text-center text-sm">Already have an account? <Link className="underline" href="/login">Sign in</Link></p></form></AuthCard>
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [developmentUrl, setDevelopmentUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null)
    try {
      const response = await fetch("/api/auth/password/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      const payload = await response.json() as { error?: string; developmentResetUrl?: string }
      if (!response.ok) throw new Error(payload.error ?? "Unable to process the request.")
      setMessage("If that verified account exists, a password reset email has been sent.")
      setDevelopmentUrl(payload.developmentResetUrl ?? null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to process the request.") } finally { setBusy(false) }
  }
  return <AuthCard title="Reset password" description="We will send a one-time reset link to your verified email."><form className="space-y-4" onSubmit={submit}><Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" /><ErrorText error={error} />{message ? <Notice text={message} /> : null}{developmentUrl ? <p className="rounded border border-amber-500/50 p-3 text-sm">Development-only reset link: <a className="underline" href={developmentUrl}>reset password</a></p> : null}<Button className="w-full" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button><p className="text-center text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></form></AuthCard>
}

export function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get("token") ?? ""
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null)
    try {
      const response = await fetch("/api/auth/password/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) })
      const payload = await response.json() as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? "Unable to reset your password.")
      router.replace("/login")
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to reset your password.") } finally { setBusy(false) }
  }
  return <AuthCard title="Choose a new password" description="This link can be used once."><form className="space-y-4" onSubmit={submit}>{!token ? <ErrorText error="This password reset link is invalid." /> : <><Field id="password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 12 characters, with upper/lowercase letters and a number." /><ErrorText error={error} /><Button className="w-full" disabled={busy}>{busy ? "Updating…" : "Update password"}</Button></>}</form></AuthCard>
}

function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) { return <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4"><Card className="w-full"><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent>{children}</CardContent></Card></main> }
function Field({ id, label, type = "text", value, onChange, autoComplete, hint }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; autoComplete?: string; hint?: string }) { return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required />{hint ? <p className="text-xs text-muted">{hint}</p> : null}</div> }
function ErrorText({ error }: { error: string | null }) { return error ? <p role="alert" className="rounded border border-destructive/50 p-3 text-sm text-destructive">{error}</p> : null }
function Notice({ text }: { text: string }) { return <p className="rounded border border-green-500/50 p-3 text-sm text-green-600 dark:text-green-400">{text}</p> }
