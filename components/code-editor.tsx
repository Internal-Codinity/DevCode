"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { Copy, FileCode, Play, RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { ExecutionLanguage } from "@/lib/execution/contracts"
import type { Problem } from "@/types/problem"

interface CodeEditorProps {
  problem: Problem
  onRunSamples: (code: string, language: ExecutionLanguage) => void
  onSubmit: (code: string, language: ExecutionLanguage) => void
  isSubmitting: boolean
}

const languages: { value: ExecutionLanguage; label: string }[] = [
  { value: "python", label: "Python 3.11" },
  { value: "javascript", label: "JavaScript (Node 22)" },
]
const MAX_CODE_BYTES = 256 * 1024

export default function CodeEditor({ problem, onRunSamples, onSubmit, isSubmitting }: CodeEditorProps) {
  const [language, setLanguage] = useState<ExecutionLanguage>("python")
  const [code, setCode] = useState(starterCode("python"))
  const [theme, setTheme] = useState("dark")
  const [fontSize, setFontSize] = useState("14px")
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const updateLanguage = (next: ExecutionLanguage) => {
    if (next === language) return
    setLanguage(next)
    const initial = starterCode(next)
    setCode(initial)
  }

  const updateCode = (next: string) => {
    setCode(next)
  }

  const validate = () => {
    if (!code.trim()) {
      toast({ title: "Write some code first", variant: "destructive" })
      return false
    }
    if (new Blob([code]).size > MAX_CODE_BYTES) {
      toast({ title: "Code is too large", description: "Submissions must be at most 256 KiB.", variant: "destructive" })
      return false
    }
    return true
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast({ title: "Code copied" })
    } catch {
      toast({ title: "Copy unavailable", description: "Select the editor text and copy it manually.", variant: "destructive" })
    }
  }

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (file.size > MAX_CODE_BYTES) {
      toast({ title: "File is too large", description: "Code files must be at most 256 KiB.", variant: "destructive" })
      return
    }
    updateCode(await file.text())
    toast({ title: "Code imported", description: file.name })
  }

  const editorClass = theme === "light" ? "bg-white text-slate-950" : theme === "monokai" ? "bg-[#272822] text-[#f8f8f2]" : "bg-card/50 text-foreground"

  return (
    <section className="leetcode-editor" aria-label="Solution editor">
      <div className="editor-controlbar">
        <div className="editor-selects">
          <Select value={language} onValueChange={(value) => updateLanguage(value as ExecutionLanguage)} disabled={isSubmitting}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{languages.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={theme} onValueChange={setTheme}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="monokai">Monokai</SelectItem></SelectContent></Select>
          <Select value={fontSize} onValueChange={setFontSize}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["12px", "14px", "16px", "18px"].map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="editor-utilities">
          <input ref={inputRef} type="file" accept={language === "python" ? ".py,text/plain" : ".js,text/plain"} className="hidden" onChange={importFile} />
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isSubmitting}><FileCode className="h-4 w-4" />Import</Button>
          <Button variant="outline" size="sm" onClick={() => updateCode(starterCode(language))} disabled={isSubmitting}><RotateCcw className="h-4 w-4" />Reset</Button>
          <Button variant="outline" size="sm" onClick={() => void copyCode()}><Copy className="h-4 w-4" />Copy</Button>
        </div>
      </div>
      <div className="leetcode-code-shell">
        <textarea value={code} onChange={(event) => updateCode(event.target.value)} spellCheck={false} aria-label="Solution source code" className={`leetcode-code ${editorClass}`} style={{ fontSize }} />
        <footer className="editor-footer">
          <span>{code.split("\n").length} lines · submissions are stored to your account</span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => validate() && onRunSamples(code, language)} disabled={isSubmitting}><Play className="h-4 w-4" />Run samples</Button>
            <Button size="sm" onClick={() => validate() && onSubmit(code, language)} disabled={isSubmitting}><Send className="h-4 w-4" />{isSubmitting ? "Queued…" : "Submit"}</Button>
          </div>
        </footer>
      </div>
    </section>
  )
}

function starterCode(language: ExecutionLanguage) {
  return language === "python"
    ? 'from pathlib import Path\n\ndef solve() -> None:\n    # Read Path("test_input.txt") and print only the requested result.\n    pass\n\nif __name__ == "__main__":\n    solve()\n'
    : 'const fs = require("node:fs")\n\nfunction solve() {\n  // Read fs.readFileSync("test_input.txt", "utf8") and print only the requested result.\n}\n\nsolve()\n'
}
