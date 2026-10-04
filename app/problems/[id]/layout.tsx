import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Problem | Codura",
  description: "Solve real-world coding problems",
}

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
