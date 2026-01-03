"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"

interface TerminalFixProps {
  initialCommand?: string
}

export function TerminalFix({ initialCommand = "" }: TerminalFixProps) {
  const [command, setCommand] = useState(initialCommand)
  const [output, setOutput] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  // Handle command execution
  const executeCommand = () => {
    if (!command.trim()) return

    // Add command to output and history
    setOutput((prev) => [...prev, `$ ${command}`])
    setHistory((prev) => [command, ...prev])
    setHistoryIndex(-1)

    // Process command (mock implementation)
    const response = processCommand(command)
    setOutput((prev) => [...prev, ...response])

    // Clear command input
    setCommand("")
  }

  // Mock command processor
  const processCommand = (cmd: string): string[] => {
    const cmdLower = cmd.toLowerCase().trim()

    if (cmdLower === "help") {
      return [
        "Available commands:",
        "  help - Show this help message",
        "  clear - Clear the terminal",
        "  echo [text] - Display text",
        "  ls - List files",
        "  pwd - Print working directory",
      ]
    } else if (cmdLower === "clear") {
      setTimeout(() => setOutput([]), 0)
      return []
    } else if (cmdLower.startsWith("echo ")) {
      return [cmdLower.substring(5)]
    } else if (cmdLower === "ls") {
      return ["file1.js", "file2.js", "directory1/", "directory2/"]
    } else if (cmdLower === "pwd") {
      return ["/home/user/project"]
    } else {
      return [`Command not found: ${cmd}. Type 'help' for available commands.`]
    }
  }

  // Handle key navigation through history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(history[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-black text-green-400 font-mono text-sm">
      <div className="bg-gray-900 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-xs">Terminal</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-gray-800" onClick={() => setOutput([])}>
          Clear
        </Button>
      </div>

      <div ref={terminalRef} className="p-3 h-64 overflow-y-auto" onClick={focusInput}>
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">
            {line}
          </div>
        ))}

        <div className="flex items-center">
          <span className="mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
