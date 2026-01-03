"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Play } from "lucide-react"

interface TestCase {
  input: string
  output: string
}

interface TestCasesProps {
  testCases: TestCase[]
  isRunning: boolean
}

export function TestCases({ testCases, isRunning }: TestCasesProps) {
  const [selectedCases, setSelectedCases] = useState<number[]>([])

  const toggleTestCase = (index: number) => {
    if (selectedCases.includes(index)) {
      setSelectedCases(selectedCases.filter((i) => i !== index))
    } else {
      setSelectedCases([...selectedCases, index])
    }
  }

  const toggleAll = () => {
    if (selectedCases.length === testCases.length) {
      setSelectedCases([])
    } else {
      setSelectedCases(testCases.map((_, i) => i))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedCases.length === testCases.length && testCases.length > 0}
            onCheckedChange={toggleAll}
          />
          <label htmlFor="select-all" className="text-sm cursor-pointer">
            Select All Test Cases
          </label>
        </div>
        <Button variant="outline" size="sm" disabled={selectedCases.length === 0 || isRunning} className="text-xs h-7">
          <Play className="h-3 w-3 mr-1" />
          Run Selected
        </Button>
      </div>

      <div className="space-y-3">
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className="p-3 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-2">
              <Checkbox
                id={`test-case-${index}`}
                checked={selectedCases.includes(index)}
                onCheckedChange={() => toggleTestCase(index)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="mb-2">
                  <label className="text-xs text-muted-foreground">Input:</label>
                  <div className="font-mono text-xs bg-card p-2 rounded mt-1">{testCase.input}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Expected Output:</label>
                  <div className="font-mono text-xs bg-card p-2 rounded mt-1">{testCase.output}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
