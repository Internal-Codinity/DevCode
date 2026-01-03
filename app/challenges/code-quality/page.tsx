"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Check, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CodeQualityChallengesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { toast } = useToast()

  // Filter challenges based on active category
  const filteredChallenges = challenges.filter(
    (challenge) => activeCategory === "all" || challenge.category.toLowerCase() === activeCategory.toLowerCase(),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Code Quality Challenges</h1>
        <p className="text-muted">Submit working code and get scored on readability, modularity, and best practices.</p>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="modularity">Modularity</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <CodeQualityCard
                key={challenge.id}
                challenge={challenge}
                onStartChallenge={() => {
                  toast({
                    title: "Challenge Started",
                    description: `You're now starting the ${challenge.title} challenge. Good luck!`,
                  })
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="readability" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges
              .filter((challenge) => challenge.category.toLowerCase() === "readability")
              .map((challenge) => (
                <CodeQualityCard
                  key={challenge.id}
                  challenge={challenge}
                  onStartChallenge={() => {
                    toast({
                      title: "Challenge Started",
                      description: `You're now starting the ${challenge.title} challenge. Good luck!`,
                    })
                  }}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="modularity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges
              .filter((challenge) => challenge.category.toLowerCase() === "modularity")
              .map((challenge) => (
                <CodeQualityCard
                  key={challenge.id}
                  challenge={challenge}
                  onStartChallenge={() => {
                    toast({
                      title: "Challenge Started",
                      description: `You're now starting the ${challenge.title} challenge. Good luck!`,
                    })
                  }}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="best-practices" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges
              .filter((challenge) => challenge.category.toLowerCase() === "best practices")
              .map((challenge) => (
                <CodeQualityCard
                  key={challenge.id}
                  challenge={challenge}
                  onStartChallenge={() => {
                    toast({
                      title: "Challenge Started",
                      description: `You're now starting the ${challenge.title} challenge. Good luck!`,
                    })
                  }}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Metric {
  name: string
  score: number
}

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  metrics: Metric[]
}

interface CodeQualityCardProps {
  challenge: Challenge
  onStartChallenge: () => void
}

function CodeQualityCard({ challenge, onStartChallenge }: CodeQualityCardProps) {
  return (
    <Card className="overflow-hidden border border-accent-purple/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{challenge.title}</CardTitle>
          <Badge
            className={
              challenge.difficulty === "Easy"
                ? "bg-green-500/20 text-green-500"
                : challenge.difficulty === "Medium"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-red-500/20 text-red-500"
            }
          >
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
              {challenge.category}
            </Badge>
            {challenge.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-card/50 border-accent-purple/20">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted">Quality Metrics:</p>
            <div className="grid grid-cols-2 gap-2">
              {challenge.metrics.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-2 bg-card rounded-md">
                  <span className="text-sm">{metric.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{metric.score}/10</span>
                    {metric.score >= 8 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : metric.score >= 6 ? (
                      <div className="h-4 w-4 text-yellow-500">•</div>
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90"
          onClick={onStartChallenge}
        >
          Start Challenge <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

const challenges = [
  {
    id: "refactor-auth-system",
    title: "Refactor Authentication System",
    description: "Refactor a working but messy authentication system to improve readability and maintainability.",
    category: "Readability",
    difficulty: "Medium",
    tags: ["JavaScript", "Authentication", "Refactoring"],
    metrics: [
      { name: "Readability", score: 8 },
      { name: "Modularity", score: 6 },
      { name: "Documentation", score: 7 },
      { name: "Best Practices", score: 8 },
    ],
  },
  {
    id: "modularize-monolith",
    title: "Modularize Monolithic Application",
    description: "Break down a monolithic application into modular components with clear separation of concerns.",
    category: "Modularity",
    difficulty: "Hard",
    tags: ["Architecture", "Modularity", "Refactoring"],
    metrics: [
      { name: "Readability", score: 7 },
      { name: "Modularity", score: 9 },
      { name: "Documentation", score: 6 },
      { name: "Best Practices", score: 8 },
    ],
  },
  {
    id: "implement-coding-standards",
    title: "Implement Coding Standards",
    description: "Apply coding standards and best practices to a codebase that works but doesn't follow conventions.",
    category: "Best Practices",
    difficulty: "Medium",
    tags: ["Linting", "Standards", "Clean Code"],
    metrics: [
      { name: "Readability", score: 9 },
      { name: "Modularity", score: 7 },
      { name: "Documentation", score: 8 },
      { name: "Best Practices", score: 9 },
    ],
  },
  {
    id: "improve-api-docs",
    title: "Improve API Documentation",
    description: "Enhance the documentation of a REST API to make it more developer-friendly and comprehensive.",
    category: "Documentation",
    difficulty: "Easy",
    tags: ["API", "Documentation", "OpenAPI"],
    metrics: [
      { name: "Readability", score: 8 },
      { name: "Modularity", score: 7 },
      { name: "Documentation", score: 9 },
      { name: "Best Practices", score: 8 },
    ],
  },
  {
    id: "optimize-db-access",
    title: "Optimize Database Access Layer",
    description: "Refactor a database access layer to follow best practices and improve maintainability.",
    category: "Best Practices",
    difficulty: "Hard",
    tags: ["Database", "ORM", "Optimization"],
    metrics: [
      { name: "Readability", score: 7 },
      { name: "Modularity", score: 8 },
      { name: "Documentation", score: 7 },
      { name: "Best Practices", score: 9 },
    ],
  },
  {
    id: "clean-frontend-components",
    title: "Clean Up Frontend Components",
    description: "Refactor React components to follow best practices and improve code organization.",
    category: "Readability",
    difficulty: "Medium",
    tags: ["React", "Frontend", "Components"],
    metrics: [
      { name: "Readability", score: 9 },
      { name: "Modularity", score: 8 },
      { name: "Documentation", score: 7 },
      { name: "Best Practices", score: 8 },
    ],
  },
]
