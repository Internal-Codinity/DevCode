"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { problemsData } from "@/data/problems"

export default function ProblemVariantsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/problems/${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(id)
      window.setTimeout(() => setCopied((current) => current === id ? null : current), 1500)
    } catch {
      window.prompt("Copy this challenge link", url)
    }
  }

  return <main className="mx-auto max-w-4xl space-y-6">
    <div><h1 className="text-3xl font-bold">Challenge collection</h1><p className="text-muted">Every item below links to an executable, network-isolated challenge. There are no fake difficulty variants.</p></div>
    <div className="grid gap-4">{problemsData.map((problem) => <Card key={problem.id}><CardHeader><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><CardTitle>{problem.title}</CardTitle><CardDescription className="mt-2">{problem.description}</CardDescription></div><Badge className={difficultyClass(problem.difficulty)}>{problem.difficulty}</Badge></div></CardHeader><CardContent className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{problem.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void copyLink(problem.id)}>{copied === problem.id ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}{copied === problem.id ? "Copied" : "Copy link"}</Button><Button asChild size="sm"><Link href={`/problems/${problem.id}`}>Solve <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></div></CardContent></Card>)}</div>
  </main>
}

function difficultyClass(difficulty: string) { return difficulty === "Easy" ? "bg-green-500/20 text-green-500" : difficulty === "Hard" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500" }
