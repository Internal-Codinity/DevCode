"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Bug, Lightbulb } from "lucide-react"

export default function IssuesPage() {
  const [fixedIssues, setFixedIssues] = useState<string[]>([])

  const issues = [
    {
      id: "terminal-control",
      title: "Terminal loses control",
      description: "Terminal input loses focus and control when typing commands",
      severity: "high",
      component: "system-simulation.tsx",
      solution: "Implemented proper focus management and keyboard event handling in the terminal component",
    },
    {
      id: "problem-layout",
      title: "Problem page layout inconsistency",
      description: "Problem page layout doesn't match LeetCode's side-by-side layout",
      severity: "high",
      component: "app/problems/[id]/page.tsx",
      solution:
        "Restructured problem page with left panel for description/discussions and right panel for code editor/test cases",
    },
    {
      id: "test-cases",
      title: "Test cases not separated from problem stats",
      description: "Test cases and problem stats are mixed together",
      severity: "medium",
      component: "components/problem-stats.tsx",
      solution: "Created separate components for problem stats and test cases",
    },
    {
      id: "test-animations",
      title: "Missing test case animations",
      description: "Test cases lack animations when running or submitting",
      severity: "low",
      component: "components/test-cases.tsx",
      solution: "Added loading animations and transitions for test case execution",
    },
    {
      id: "nested-discussions",
      title: "Nested discussion tabs confusion",
      description: "Multiple nested discussion tabs create confusion",
      severity: "medium",
      component: "components/community-discussions.tsx",
      solution: "Reorganized discussion tabs with clearer hierarchy and improved navigation",
    },
    {
      id: "missing-solutions",
      title: "Missing community solutions",
      description: "Community solutions tab is empty or not properly implemented",
      severity: "medium",
      component: "app/problems/[id]/page.tsx",
      solution: "Added community solutions tab with sample solutions and proper styling",
    },
    {
      id: "inconsistent-cards",
      title: "Inconsistent card styling",
      description: "Card styling is inconsistent across different sections",
      severity: "low",
      component: "multiple components",
      solution: "Standardized card styling with consistent hover effects and spacing",
    },
    {
      id: "mobile-responsiveness",
      title: "Poor mobile responsiveness",
      description: "Layout breaks on smaller screens",
      severity: "high",
      component: "multiple components",
      solution: "Improved responsive design with proper column stacking on mobile",
    },
    {
      id: "missing-company-tags",
      title: "Missing company tags",
      description: "Company tags not visible in problem header",
      severity: "low",
      component: "components/problem-stats.tsx",
      solution: "Added company tags with tooltip in the problem stats component",
    },
    {
      id: "accessibility-issues",
      title: "Accessibility issues",
      description: "Missing aria labels and keyboard navigation",
      severity: "medium",
      component: "multiple components",
      solution: "Added proper aria labels and improved keyboard navigation",
    },
  ]

  const toggleFixedIssue = (id: string) => {
    if (fixedIssues.includes(id)) {
      setFixedIssues(fixedIssues.filter((i) => i !== id))
    } else {
      setFixedIssues([...fixedIssues, id])
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            RealWorldCode Issues & Fixes
          </CardTitle>
          <CardDescription>
            We've identified and fixed the following issues to improve the user experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Issues ({issues.length})</TabsTrigger>
              <TabsTrigger value="fixed">Fixed ({fixedIssues.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({issues.length - fixedIssues.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {issues.map((issue) => (
                <Card
                  key={issue.id}
                  className={`border ${fixedIssues.includes(issue.id) ? "border-green-500/30 bg-green-500/5" : "border-border"}`}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {fixedIssues.includes(issue.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        )}
                        <CardTitle className="text-base">{issue.title}</CardTitle>
                      </div>
                      <Badge
                        variant={
                          issue.severity === "high"
                            ? "destructive"
                            : issue.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <CardDescription className="ml-7">{issue.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="ml-7 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Component: </span>
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">{issue.component}</code>
                      </div>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                        <p className="text-sm">{issue.solution}</p>
                      </div>
                      <Button
                        variant={fixedIssues.includes(issue.id) ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleFixedIssue(issue.id)}
                        className="mt-2"
                      >
                        {fixedIssues.includes(issue.id) ? "Mark as Pending" : "Mark as Fixed"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="fixed" className="space-y-4">
              {issues.filter((issue) => fixedIssues.includes(issue.id)).length > 0 ? (
                issues
                  .filter((issue) => fixedIssues.includes(issue.id))
                  .map((issue) => (
                    <Card key={issue.id} className="border border-green-500/30 bg-green-500/5">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <CardTitle className="text-base">{issue.title}</CardTitle>
                          </div>
                          <Badge
                            variant={
                              issue.severity === "high"
                                ? "destructive"
                                : issue.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <CardDescription className="ml-7">{issue.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="ml-7 space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Component: </span>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{issue.component}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                            <p className="text-sm">{issue.solution}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFixedIssue(issue.id)}
                            className="mt-2"
                          >
                            Mark as Pending
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fixed issues yet. Mark issues as fixed to see them here.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {issues.filter((issue) => !fixedIssues.includes(issue.id)).length > 0 ? (
                issues
                  .filter((issue) => !fixedIssues.includes(issue.id))
                  .map((issue) => (
                    <Card key={issue.id} className="border border-border">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                            <CardTitle className="text-base">{issue.title}</CardTitle>
                          </div>
                          <Badge
                            variant={
                              issue.severity === "high"
                                ? "destructive"
                                : issue.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <CardDescription className="ml-7">{issue.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="ml-7 space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Component: </span>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{issue.component}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                            <p className="text-sm">{issue.solution}</p>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => toggleFixedIssue(issue.id)}
                            className="mt-2"
                          >
                            Mark as Fixed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending issues. All issues have been fixed!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
