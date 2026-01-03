"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Terminal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Network,
  FileText,
  Settings,
  Clock,
  BarChart,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface SystemMetric {
  name: string
  value: number
  max: number
  unit: string
  icon: React.ReactNode
}

interface LogEntry {
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
}

interface SimulationStatus {
  status: "idle" | "running" | "paused" | "completed" | "failed"
  startTime?: Date
  endTime?: Date
  exitCode?: number
  errorMessage?: string
}

export default function SystemSimulation() {
  const [environment, setEnvironment] = useState("linux")
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>({ status: "idle" })
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: "CPU Usage", value: 0, max: 100, unit: "%", icon: <Cpu className="h-4 w-4 text-accent-blue" /> },
    {
      name: "Memory Usage",
      value: 0,
      max: 1024,
      unit: "MB",
      icon: <HardDrive className="h-4 w-4 text-accent-purple" />,
    },
    { name: "Network I/O", value: 0, max: 10, unit: "MB/s", icon: <Network className="h-4 w-4 text-accent-orange" /> },
    { name: "Disk I/O", value: 0, max: 100, unit: "MB/s", icon: <HardDrive className="h-4 w-4 text-green-500" /> },
  ])
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "user@realworldcode:~/workspace$ ls -la",
    "total 20",
    "drwxr-xr-x 4 user user 4096 May 14 12:54 .",
    "drwxr-xr-x 3 user user 4096 May 14 12:50 ..",
    "-rw-r--r-- 1 user user 2184 May 14 12:52 solution.py",
    "-rw-r--r-- 1 user user 1024 May 14 12:53 test_data.json",
    "drwxr-xr-x 2 user user 4096 May 14 12:51 .git",
    "user@realworldcode:~/workspace$ _",
  ])
  const [activeTab, setActiveTab] = useState("console")
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [resourceLimits, setResourceLimits] = useState({
    cpu: 100, // percentage
    memory: 1024, // MB
    timeout: 300, // seconds
    network: 10, // MB/s
  })

  const terminalRef = useRef<HTMLDivElement>(null)
  const logsRef = useRef<HTMLDivElement>(null)
  const simulationInterval = useRef<NodeJS.Timeout | null>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Auto-scroll terminal and logs to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight
    }
  }, [terminalHistory, logs])

  // Focus terminal input when terminal is active
  useEffect(() => {
    if (activeTab === "console" && terminalInputRef.current) {
      terminalInputRef.current.focus()
    }
  }, [activeTab, terminalHistory])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
      }
    }
  }, [])

  const getEnvironmentLabel = () => {
    switch (environment) {
      case "linux":
        return "Linux Container"
      case "kubernetes":
        return "Kubernetes Pod"
      case "aws":
        return "AWS Lambda"
      case "azure":
        return "Azure Functions"
      default:
        return "Linux Container"
    }
  }

  const handleRunSimulation = () => {
    if (simulationStatus.status === "running") return

    setSimulationStatus({ status: "running", startTime: new Date() })
    setSimulationProgress(0)

    // Reset metrics
    setMetrics((prev) => prev.map((metric) => ({ ...metric, value: 0 })))

    // Add initial logs
    setLogs([
      { timestamp: new Date(), level: "info", message: `Starting ${getEnvironmentLabel()} simulation...` },
      { timestamp: new Date(), level: "info", message: "Initializing environment..." },
    ])

    // Update terminal
    const newTerminalHistory = [...terminalHistory]
    if (newTerminalHistory[newTerminalHistory.length - 1].endsWith("_")) {
      newTerminalHistory[newTerminalHistory.length - 1] = newTerminalHistory[newTerminalHistory.length - 1].slice(0, -1)
    }

    if (environment === "linux") {
      newTerminalHistory.push("user@realworldcode:~/workspace$ python solution.py")
      newTerminalHistory.push("Initializing scraper...")
    } else if (environment === "kubernetes") {
      newTerminalHistory.push("user@realworldcode:~/workspace$ kubectl apply -f deployment.yaml")
      newTerminalHistory.push("deployment.apps/scraper-deployment created")
      newTerminalHistory.push("user@realworldcode:~/workspace$ kubectl get pods")
      newTerminalHistory.push("NAME                                 READY   STATUS    RESTARTS   AGE")
      newTerminalHistory.push("scraper-deployment-6d5bc7b947-xvz8h  1/1     Running   0          5s")
    } else if (environment === "aws") {
      newTerminalHistory.push("user@realworldcode:~/workspace$ aws lambda invoke --function-name scraper output.json")
      newTerminalHistory.push("Invoking Lambda function...")
    } else if (environment === "azure") {
      newTerminalHistory.push("user@realworldcode:~/workspace$ func start")
      newTerminalHistory.push("Azure Functions Core Tools")
      newTerminalHistory.push("Core Tools Version:       4.0.4915")
      newTerminalHistory.push("Function Runtime Version: 4.0.1.18566")
    }

    setTerminalHistory(newTerminalHistory)

    // Simulate progress and metrics updates
    simulationInterval.current = setInterval(() => {
      setSimulationProgress((prev) => {
        const newProgress = prev + Math.random() * 5
        if (newProgress >= 100) {
          // Simulation completed
          clearInterval(simulationInterval.current!)

          // 80% chance of success, 20% chance of failure
          const success = Math.random() > 0.2

          if (success) {
            setSimulationStatus({
              status: "completed",
              startTime: simulationStatus.startTime,
              endTime: new Date(),
              exitCode: 0,
            })

            setLogs((prev) => [
              ...prev,
              { timestamp: new Date(), level: "success", message: "Simulation completed successfully." },
              {
                timestamp: new Date(),
                level: "info",
                message: `Total execution time: ${((new Date().getTime() - (simulationStatus.startTime?.getTime() || 0)) / 1000).toFixed(2)}s`,
              },
            ])

            // Update terminal with success message
            const successTerminal = [...terminalHistory]
            if (environment === "linux") {
              successTerminal.push("Scraping completed successfully.")
              successTerminal.push("Found 15 products, saved to results.json")
              successTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "kubernetes") {
              successTerminal.push("user@realworldcode:~/workspace$ kubectl logs scraper-deployment-6d5bc7b947-xvz8h")
              successTerminal.push("Scraping completed successfully.")
              successTerminal.push("Found 15 products, saved to results.json")
              successTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "aws") {
              successTerminal.push("{")
              successTerminal.push('    "StatusCode": 200,')
              successTerminal.push('    "ExecutedVersion": "$LATEST"')
              successTerminal.push("}")
              successTerminal.push("user@realworldcode:~/workspace$ cat output.json")
              successTerminal.push('{"success": true, "products_found": 15}')
              successTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "azure") {
              successTerminal.push(
                "Executing 'Functions.Scraper' (Reason='This function was programmatically called via the host APIs.', Id=1)",
              )
              successTerminal.push("Scraping completed successfully.")
              successTerminal.push("Found 15 products, saved to results.json")
              successTerminal.push("Executed 'Functions.Scraper' (Succeeded, Id=1, Duration=5123ms)")
              successTerminal.push("user@realworldcode:~/workspace$ _")
            }
            setTerminalHistory(successTerminal)

            toast({
              title: "Simulation completed",
              description: "The system simulation completed successfully.",
            })
          } else {
            // Simulation failed
            setSimulationStatus({
              status: "failed",
              startTime: simulationStatus.startTime,
              endTime: new Date(),
              exitCode: 1,
              errorMessage: "Resource limit exceeded: Memory usage too high",
            })

            setLogs((prev) => [
              ...prev,
              { timestamp: new Date(), level: "error", message: "Simulation failed: Resource limit exceeded" },
              { timestamp: new Date(), level: "error", message: "Memory usage exceeded the 1024MB limit" },
              {
                timestamp: new Date(),
                level: "info",
                message: `Total execution time: ${((new Date().getTime() - (simulationStatus.startTime?.getTime() || 0)) / 1000).toFixed(2)}s`,
              },
            ])

            // Update terminal with error message
            const errorTerminal = [...terminalHistory]
            if (environment === "linux") {
              errorTerminal.push("ERROR: Memory limit exceeded (1024MB)")
              errorTerminal.push("Traceback (most recent call last):")
              errorTerminal.push('  File "solution.py", line 42, in <module>')
              errorTerminal.push("    results = scraper.scrape_products(product_ids)")
              errorTerminal.push("MemoryError: Unable to allocate memory")
              errorTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "kubernetes") {
              errorTerminal.push("user@realworldcode:~/workspace$ kubectl logs scraper-deployment-6d5bc7b947-xvz8h")
              errorTerminal.push("ERROR: Memory limit exceeded (1024MB)")
              errorTerminal.push("Pod has been terminated due to memory limit")
              errorTerminal.push("user@realworldcode:~/workspace$ kubectl get pods")
              errorTerminal.push("NAME                                 READY   STATUS    RESTARTS   AGE")
              errorTerminal.push("scraper-deployment-6d5bc7b947-xvz8h  0/1     OOMKilled 0          45s")
              errorTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "aws") {
              errorTerminal.push("{")
              errorTerminal.push('    "StatusCode": 500,')
              errorTerminal.push('    "FunctionError": "Unhandled",')
              errorTerminal.push('    "ExecutedVersion": "$LATEST"')
              errorTerminal.push("}")
              errorTerminal.push("user@realworldcode:~/workspace$ cat output.json")
              errorTerminal.push('{"errorMessage": "Memory limit exceeded (1024MB)", "errorType": "MemoryError"}')
              errorTerminal.push("user@realworldcode:~/workspace$ _")
            } else if (environment === "azure") {
              errorTerminal.push(
                "Executing 'Functions.Scraper' (Reason='This function was programmatically called via the host APIs.', Id=1)",
              )
              errorTerminal.push("ERROR: Memory limit exceeded (1024MB)")
              errorTerminal.push("Executed 'Functions.Scraper' (Failed, Id=1, Duration=3214ms)")
              errorTerminal.push("user@realworldcode:~/workspace$ _")
            }
            setTerminalHistory(errorTerminal)

            toast({
              title: "Simulation failed",
              description: "The system simulation failed due to resource limits.",
              variant: "destructive",
            })
          }

          return 100
        }
        return newProgress
      })

      // Update metrics
      setMetrics((prev) =>
        prev.map((metric) => {
          let newValue

          if (metric.name === "CPU Usage") {
            // CPU usage increases gradually then fluctuates
            newValue = Math.min(metric.value + Math.random() * 15, 100)
          } else if (metric.name === "Memory Usage") {
            // Memory usage increases steadily
            newValue = Math.min(metric.value + Math.random() * 50, 1024)
          } else if (metric.name === "Network I/O") {
            // Network I/O fluctuates
            newValue = Math.min(Math.max(metric.value + (Math.random() * 2 - 1), 0), 10)
          } else if (metric.name === "Disk I/O") {
            // Disk I/O spikes occasionally
            const spike = Math.random() > 0.8
            newValue = spike
              ? Math.min(metric.value + Math.random() * 30, 100)
              : Math.max(metric.value - Math.random() * 10, 0)
          } else {
            newValue = metric.value
          }

          return { ...metric, value: newValue }
        }),
      )

      // Add logs periodically
      if (Math.random() > 0.7) {
        const logMessages = [
          { level: "info", message: "Processing batch of products..." },
          { level: "info", message: "Sending HTTP request to target website..." },
          { level: "info", message: "Parsing HTML response..." },
          { level: "info", message: "Extracting product details..." },
          { level: "info", message: "Saving results to database..." },
          { level: "warning", message: "Rate limiting detected, backing off..." },
          { level: "warning", message: "High memory usage detected..." },
          { level: "info", message: "Rotating proxy to avoid detection..." },
        ]

        const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)]
        setLogs((prev) => [
          ...prev,
          { timestamp: new Date(), level: randomLog.level as any, message: randomLog.message },
        ])
      }
    }, 500)
  }

  const handlePauseSimulation = () => {
    if (simulationStatus.status !== "running") return

    if (simulationInterval.current) {
      clearInterval(simulationInterval.current)
    }

    setSimulationStatus({ ...simulationStatus, status: "paused" })
    setLogs((prev) => [...prev, { timestamp: new Date(), level: "warning", message: "Simulation paused by user" }])

    toast({
      title: "Simulation paused",
      description: "The system simulation has been paused.",
    })
  }

  const handleResumeSimulation = () => {
    if (simulationStatus.status !== "paused") return

    setSimulationStatus({ ...simulationStatus, status: "running" })
    setLogs((prev) => [...prev, { timestamp: new Date(), level: "info", message: "Simulation resumed" }])

    // Resume the simulation
    handleRunSimulation()

    toast({
      title: "Simulation resumed",
      description: "The system simulation has been resumed.",
    })
  }

  const handleStopSimulation = () => {
    if (simulationStatus.status !== "running" && simulationStatus.status !== "paused") return

    if (simulationInterval.current) {
      clearInterval(simulationInterval.current)
    }

    setSimulationStatus({
      status: "idle",
      startTime: simulationStatus.startTime,
      endTime: new Date(),
    })

    setLogs((prev) => [...prev, { timestamp: new Date(), level: "warning", message: "Simulation stopped by user" }])

    toast({
      title: "Simulation stopped",
      description: "The system simulation has been stopped.",
    })
  }

  const handleResetSimulation = () => {
    if (simulationStatus.status === "running") {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
      }
    }

    setSimulationStatus({ status: "idle" })
    setSimulationProgress(0)
    setMetrics((prev) => prev.map((metric) => ({ ...metric, value: 0 })))
    setLogs([])

    // Reset terminal to initial state
    setTerminalHistory([
      "user@realworldcode:~/workspace$ ls -la",
      "total 20",
      "drwxr-xr-x 4 user user 4096 May 14 12:54 .",
      "drwxr-xr-x 3 user user 4096 May 14 12:50 ..",
      "-rw-r--r-- 1 user user 2184 May 14 12:52 solution.py",
      "-rw-r--r-- 1 user user 1024 May 14 12:53 test_data.json",
      "drwxr-xr-x 2 user user 4096 May 14 12:51 .git",
      "user@realworldcode:~/workspace$ _",
    ])

    toast({
      title: "Simulation reset",
      description: "The system simulation has been reset.",
    })
  }

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      const newTerminalHistory = [...terminalHistory]

      // Replace the cursor placeholder
      if (newTerminalHistory[newTerminalHistory.length - 1].endsWith("_")) {
        newTerminalHistory[newTerminalHistory.length - 1] = newTerminalHistory[newTerminalHistory.length - 1].slice(
          0,
          -1,
        )
      }

      // Add the command
      newTerminalHistory[newTerminalHistory.length - 1] += terminalInput

      // Process the command
      if (terminalInput === "clear") {
        setTerminalHistory(["user@realworldcode:~/workspace$ _"])
      } else {
        // Add command output based on the input
        if (terminalInput === "ls") {
          newTerminalHistory.push("solution.py  test_data.json")
        } else if (terminalInput === "cat solution.py") {
          newTerminalHistory.push("import requests")
          newTerminalHistory.push("from bs4 import BeautifulSoup")
          newTerminalHistory.push("import json")
          newTerminalHistory.push("import time")
          newTerminalHistory.push("import random")
          newTerminalHistory.push("")
          newTerminalHistory.push("class AmazonScraper:")
          newTerminalHistory.push("    # ... code omitted for brevity ...")
        } else if (terminalInput === "cat test_data.json") {
          newTerminalHistory.push("{")
          newTerminalHistory.push('  "product_ids": ["B08N5KWB9H", "B07QDYSSF5"]')
          newTerminalHistory.push("}")
        } else if (terminalInput.startsWith("cd ")) {
          newTerminalHistory.push(`bash: cd: ${terminalInput.slice(3)}: No such file or directory`)
        } else if (terminalInput === "help") {
          newTerminalHistory.push("Available commands: ls, cat, clear, help")
        } else {
          newTerminalHistory.push(`bash: ${terminalInput.split(" ")[0]}: command not found`)
        }

        // Add new prompt
        newTerminalHistory.push("user@realworldcode:~/workspace$ _")
        setTerminalHistory(newTerminalHistory)
      }

      setTerminalInput("")

      // Focus the input again after processing
      setTimeout(() => {
        if (terminalInputRef.current) {
          terminalInputRef.current.focus()
        }
      }, 0)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "info":
        return <FileText className="h-4 w-4 text-accent-blue" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-accent-blue" />
    }
  }

  const getStatusBadge = () => {
    switch (simulationStatus.status) {
      case "idle":
        return <Badge className="bg-gray-500/20 text-gray-400">Idle</Badge>
      case "running":
        return <Badge className="bg-green-500/20 text-green-500">Running</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Paused</Badge>
      case "completed":
        return <Badge className="bg-accent-blue/20 text-accent-blue">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Idle</Badge>
    }
  }

  return (
    <Card className="w-full code-editor">
      <CardHeader className="code-editor-header">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Live System Simulation</CardTitle>
            <CardDescription>Test your code in a real environment with resource constraints</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Select value={environment} onValueChange={setEnvironment} disabled={simulationStatus.status === "running"}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linux">Linux Container</SelectItem>
                <SelectItem value="kubernetes">Kubernetes Pod</SelectItem>
                <SelectItem value="aws">AWS Lambda</SelectItem>
                <SelectItem value="azure">Azure Functions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Progress bar for running simulation */}
        {(simulationStatus.status === "running" || simulationStatus.status === "paused") && (
          <div className="px-4 pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Simulation progress</span>
              <span className="font-medium">{Math.round(simulationProgress)}%</span>
            </div>
            <Progress value={simulationProgress} className="h-2" />
          </div>
        )}

        {/* Resource limits */}
        {simulationStatus.status === "idle" && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Resource Limits</h3>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-2 bg-card rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="h-4 w-4 text-accent-blue" />
                  <span className="text-sm">CPU Limit</span>
                </div>
                <p className="text-lg font-medium">{resourceLimits.cpu}%</p>
              </div>
              <div className="p-2 bg-card rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="h-4 w-4 text-accent-purple" />
                  <span className="text-sm">Memory Limit</span>
                </div>
                <p className="text-lg font-medium">{resourceLimits.memory} MB</p>
              </div>
              <div className="p-2 bg-card rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-accent-orange" />
                  <span className="text-sm">Timeout</span>
                </div>
                <p className="text-lg font-medium">{resourceLimits.timeout}s</p>
              </div>
              <div className="p-2 bg-card rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Network className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Network Limit</span>
                </div>
                <p className="text-lg font-medium">{resourceLimits.network} MB/s</p>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="console" className="flex-1">
                <Terminal className="h-4 w-4 mr-2" />
                Console
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex-1">
                <BarChart className="h-4 w-4 mr-2" />
                Metrics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="console" className="p-4">
            <div
              className="h-[300px] overflow-y-auto bg-black text-white rounded-md p-2 font-mono text-sm"
              ref={terminalRef}
            >
              {terminalHistory.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <div className="flex items-center">
                user@realworldcode:~/workspace$
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalInput}
                  className="bg-transparent border-none outline-none flex-1 text-white"
                  ref={terminalInputRef}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="p-4">
            <div className="h-[300px] overflow-y-auto rounded-md p-2 font-mono text-sm" ref={logsRef}>
              {logs.map((log, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                  {getLogIcon(log.level)}
                  <span className={log.level === "error" ? "text-red-500" : ""}>{log.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {metric.icon}
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.value.toFixed(0)}</span>
                      <span className="text-muted-foreground">{metric.unit}</span>
                    </div>
                    <Progress value={(metric.value / metric.max) * 100} className="mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="flex justify-between items-center p-4">
        <Button onClick={handleRunSimulation} disabled={simulationStatus.status === "running"}>
          {simulationStatus.status === "running" ? "Running..." : "Run Simulation"}
        </Button>
        <div>
          {simulationStatus.status === "running" && (
            <Button variant="secondary" onClick={handlePauseSimulation}>
              Pause
            </Button>
          )}
          {simulationStatus.status === "paused" && (
            <Button variant="secondary" onClick={handleResumeSimulation}>
              Resume
            </Button>
          )}
          {(simulationStatus.status === "running" || simulationStatus.status === "paused") && (
            <Button variant="destructive" onClick={handleStopSimulation}>
              Stop
            </Button>
          )}
          {(simulationStatus.status === "idle" ||
            simulationStatus.status === "completed" ||
            simulationStatus.status === "failed") && (
            <Button variant="outline" onClick={handleResetSimulation}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
