"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ArrowRight, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function TimeBoxedChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const { toast } = useToast()

  // Filter challenges based on search query and active category
  const filteredChallenges = challenges.filter(
    (challenge) =>
      (activeCategory === "all" || challenge.category === activeCategory) &&
      (challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Time-Boxed Challenges</h1>
        <p className="text-muted">
          Test your skills with time-limited challenges that simulate real-world pressure situations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="bg-card">
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="Debugging">Debugging</TabsTrigger>
            <TabsTrigger value="Optimization">Optimization</TabsTrigger>
            <TabsTrigger value="Implementation">Implementation</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input
              type="search"
              placeholder="Search challenges..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onStartChallenge={() => {
                toast({
                  title: "Challenge Started",
                  description: `You're now starting the ${challenge.title} challenge. Good luck!`,
                })
              }}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <Clock className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No challenges found</h3>
            <p className="text-muted">Try adjusting your filters or search query</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface Challenge {
  id: string
  title: string
  description: string
  timeLimit: number
  difficulty: string
  category: string
  tags: string[]
}

interface ChallengeCardProps {
  challenge: Challenge
  onStartChallenge: () => void
}

function ChallengeCard({ challenge, onStartChallenge }: ChallengeCardProps) {
  return (
    <Card className="overflow-hidden border border-accent-purple/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{challenge.title}</CardTitle>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent-orange" />
            <span className="text-sm font-medium">{challenge.timeLimit} min</span>
          </div>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
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
          <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
            {challenge.category}
          </Badge>
          {challenge.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-card/50 border-accent-purple/20">
              {tag}
            </Badge>
          ))}
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
    id: "fix-broken-automation",
    title: "Fix Broken Automation Script",
    description: "Debug and fix a Python automation script that's failing to process files correctly.",
    timeLimit: 10,
    difficulty: "Medium",
    category: "Debugging",
    tags: ["Python", "Automation", "Debugging"],
  },
  {
    id: "optimize-database-query",
    title: "Optimize Database Query",
    description: "Improve the performance of a slow SQL query that's causing timeouts.",
    timeLimit: 15,
    difficulty: "Hard",
    category: "Optimization",
    tags: ["SQL", "Database", "Performance"],
  },
  {
    id: "implement-rate-limiter",
    title: "Implement Rate Limiter",
    description: "Implement a rate limiter for an API to prevent abuse.",
    timeLimit: 20,
    difficulty: "Medium",
    category: "Implementation",
    tags: ["API", "Rate Limiting", "Backend"],
  },
  {
    id: "bypass-captcha",
    title: "Bypass CAPTCHA",
    description: "Improve a web scraper to bypass CAPTCHA challenges while respecting terms of service.",
    timeLimit: 30,
    difficulty: "Hard",
    category: "Implementation",
    tags: ["Web Scraping", "CAPTCHA", "Python"],
  },
  {
    id: "fix-memory-leak",
    title: "Fix Memory Leak",
    description: "Identify and fix a memory leak in a Node.js application.",
    timeLimit: 25,
    difficulty: "Hard",
    category: "Debugging",
    tags: ["Node.js", "Memory Management", "Debugging"],
  },
  {
    id: "optimize-image-processing",
    title: "Optimize Image Processing",
    description: "Improve the performance of an image processing pipeline.",
    timeLimit: 20,
    difficulty: "Medium",
    category: "Optimization",
    tags: ["Image Processing", "Performance", "Python"],
  },
]
