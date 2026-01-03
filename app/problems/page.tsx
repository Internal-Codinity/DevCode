"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar, CheckCircle2, ChevronDown, ChevronRight, Filter, Search, Star, Tag, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Sample problem data
const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "48%",
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Apple", "Microsoft"],
    premium: false,
    solved: true,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "36%",
    tags: ["Linked List", "Math", "Recursion"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    premium: false,
    solved: false,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "32%",
    tags: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Bloomberg", "Facebook"],
    premium: false,
    solved: false,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "31%",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Amazon", "Facebook"],
    premium: false,
    solved: false,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "30%",
    tags: ["String", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    premium: false,
    solved: false,
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    difficulty: "Medium",
    acceptance: "38%",
    tags: ["String"],
    companies: ["Amazon", "Adobe"],
    premium: false,
    solved: false,
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Medium",
    acceptance: "26%",
    tags: ["Math"],
    companies: ["Bloomberg", "Apple"],
    premium: false,
    solved: false,
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    acceptance: "15%",
    tags: ["String", "Math"],
    companies: ["Microsoft", "Amazon", "Facebook"],
    premium: false,
    solved: false,
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    acceptance: "50%",
    tags: ["Math"],
    companies: ["Amazon"],
    premium: false,
    solved: true,
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    acceptance: "27%",
    tags: ["String", "Dynamic Programming", "Recursion"],
    companies: ["Google", "Facebook", "Uber"],
    premium: false,
    solved: false,
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    acceptance: "52%",
    tags: ["Array", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Google", "Apple"],
    premium: false,
    solved: false,
  },
  {
    id: 12,
    title: "Integer to Roman",
    difficulty: "Medium",
    acceptance: "57%",
    tags: ["Hash Table", "Math", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    premium: false,
    solved: false,
  },
  {
    id: 13,
    title: "Roman to Integer",
    difficulty: "Easy",
    acceptance: "57%",
    tags: ["Hash Table", "Math", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    premium: false,
    solved: true,
  },
  {
    id: 14,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    acceptance: "36%",
    tags: ["String", "Trie"],
    companies: ["Amazon"],
    premium: false,
    solved: false,
  },
  {
    id: 15,
    title: "3Sum",
    difficulty: "Medium",
    acceptance: "28%",
    tags: ["Array", "Two Pointers", "Sorting"],
    companies: ["Amazon", "Facebook", "Google"],
    premium: false,
    solved: false,
  },
]

// All unique tags from problems
const allTags = Array.from(new Set(problems.flatMap((problem) => problem.tags))).sort()

// All unique companies from problems
const allCompanies = Array.from(new Set(problems.flatMap((problem) => problem.companies))).sort()

// Lists data
const myLists = [
  { id: 1, name: "Favorite Problems", count: 12 },
  { id: 2, name: "To Solve Later", count: 8 },
  { id: 3, name: "Hard Problems", count: 5 },
  { id: 4, name: "DP Problems", count: 7 },
]

// Recent activity data
const recentActivity = [
  { id: 1, problem: "Two Sum", date: "Today", status: "Solved" },
  { id: 2, problem: "Palindrome Number", date: "Yesterday", status: "Solved" },
  { id: 3, problem: "Add Two Numbers", date: "2 days ago", status: "Attempted" },
]

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 border-green-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Hard":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-blue-100 text-blue-800 border-blue-200"
  }
}

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [showSolved, setShowSolved] = useState(true)
  const [showUnsolved, setShowUnsolved] = useState(true)
  const [filteredProblems, setFilteredProblems] = useState(problems)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Apply filters
  useEffect(() => {
    let filtered = problems

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((problem) => problem.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((problem) => selectedDifficulties.includes(problem.difficulty))
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((problem) => problem.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Companies filter
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter((problem) => problem.companies.some((company) => selectedCompanies.includes(company)))
    }

    // Solved/Unsolved filter
    if (!showSolved) {
      filtered = filtered.filter((problem) => !problem.solved)
    }

    if (!showUnsolved) {
      filtered = filtered.filter((problem) => problem.solved)
    }

    setFilteredProblems(filtered)

    // Count active filters
    let count = 0
    if (selectedDifficulties.length > 0) count++
    if (selectedTags.length > 0) count++
    if (selectedCompanies.length > 0) count++
    if (!showSolved || !showUnsolved) count++
    setActiveFilters(count)
  }, [searchQuery, selectedDifficulties, selectedTags, selectedCompanies, showSolved, showUnsolved])

  // Toggle difficulty selection
  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty],
    )
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Toggle company selection
  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) => (prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedDifficulties([])
    setSelectedTags([])
    setSelectedCompanies([])
    setShowSolved(true)
    setShowUnsolved(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-1/5">
          <div className="sticky top-20">
            <Card className="border border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </span>
                  {activeFilters > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
                      Clear All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Difficulty Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Easy", "Medium", "Hard"].map((difficulty) => (
                      <Badge
                        key={difficulty}
                        variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedDifficulties.includes(difficulty) ? "" : getDifficultyColor(difficulty)
                        }`}
                        onClick={() => toggleDifficulty(difficulty)}
                      >
                        {difficulty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="solved" checked={showSolved} onCheckedChange={() => setShowSolved(!showSolved)} />
                      <label
                        htmlFor="solved"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Solved
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unsolved"
                        checked={showUnsolved}
                        onCheckedChange={() => setShowUnsolved(!showUnsolved)}
                      />
                      <label
                        htmlFor="unsolved"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Unsolved
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags Filter */}
                <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    <span>Tags</span>
                    {isTagsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ScrollArea className="h-48 rounded-md border p-2">
                      <div className="space-y-2">
                        {allTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => toggleTag(tag)}
                            />
                            <label
                              htmlFor={`tag-${tag}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>

                {/* Companies Filter */}
                <Collapsible open={isCompaniesOpen} onOpenChange={setIsCompaniesOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    <span>Companies</span>
                    {isCompaniesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ScrollArea className="h-48 rounded-md border p-2">
                      <div className="space-y-2">
                        {allCompanies.map((company) => (
                          <div key={company} className="flex items-center space-x-2">
                            <Checkbox
                              id={`company-${company}`}
                              checked={selectedCompanies.includes(company)}
                              onCheckedChange={() => toggleCompany(company)}
                            />
                            <label
                              htmlFor={`company-${company}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {company}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* My Lists */}
            <Card className="mt-4 border border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>My Lists</span>
                  <Button variant="ghost" size="sm" className="h-7">
                    <span className="text-xs">+</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {myLists.map((list) => (
                  <Button key={list.id} variant="ghost" className="w-full justify-start h-8 px-2" asChild>
                    <Link href={`/lists/${list.id}`}>
                      <span className="flex-1 text-left">{list.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {list.count}
                      </Badge>
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Problem List */}
        <div className="lg:w-3/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Problems</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Random
              </Button>
              <Button variant="outline" size="sm">
                Lists
              </Button>
            </div>
          </div>

          {/* Search and Active Filters */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search problems..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDifficulties.map((difficulty) => (
                  <Badge key={difficulty} variant="secondary" className="pl-2 flex items-center gap-1">
                    {difficulty}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => toggleDifficulty(difficulty)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 flex items-center gap-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => toggleTag(tag)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

                {selectedCompanies.map((company) => (
                  <Badge key={company} variant="secondary" className="pl-2 flex items-center gap-1">
                    {company}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => toggleCompany(company)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

                {(!showSolved || !showUnsolved) && (
                  <Badge variant="secondary" className="pl-2 flex items-center gap-1">
                    Status: {!showSolved ? "Unsolved" : "Solved"}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => {
                        setShowSolved(true)
                        setShowUnsolved(true)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Problem List */}
          <Card className="border border-border/40">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">All Problems</CardTitle>
                <CardDescription>
                  {filteredProblems.length} of {problems.length} problems
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium border-b">
                  <div className="col-span-1">Status</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-2">Acceptance</div>
                  <div className="col-span-2">Tags</div>
                </div>

                {/* Table Body */}
                <div className="divide-y">
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem) => (
                      <div
                        key={problem.id}
                        className="grid grid-cols-12 gap-2 p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="col-span-1">
                          {problem.solved ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                        <div className="col-span-5">
                          <Link
                            href={`/problems/${problem.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {problem.title}
                          </Link>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-sm">{problem.acceptance}</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags.slice(0, 1).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {problem.tags.length > 1 && (
                              <Badge variant="outline" className="text-xs">
                                +{problem.tags.length - 1}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No problems match your filters.</p>
                      <Button variant="link" onClick={clearAllFilters} className="mt-2">
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {filteredProblems.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button variant="default" size="sm" className="h-8 w-8 p-0">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      3
                    </Button>
                    <span className="mx-1">...</span>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      10
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Recent Activity */}
        <div className="lg:w-1/5">
          <div className="sticky top-20">
            {/* Recent Activity */}
            <Card className="border border-border/40 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    {activity.status === "Solved" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-yellow-500 mt-0.5" />
                    )}
                    <div>
                      <Link
                        href={`/problems/${activity.id}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {activity.problem}
                      </Link>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link href="/profile/activity">View All Activity</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Active Track */}
            <Card className="border border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Track</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-gradient-to-r from-purple-500 to-pink-700 flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Data Structures Mastery</h3>
                      <p className="text-xs text-muted-foreground">12 of 45 problems completed</p>
                    </div>
                  </div>

                  <div className="w-full bg-accent/50 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "27%" }}></div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-medium mb-2">Next problems:</h4>
                    <div className="space-y-2">
                      {[
                        { id: 101, title: "Implement Queue using Stacks" },
                        { id: 102, title: "Binary Tree Level Order Traversal" },
                      ].map((problem) => (
                        <Link
                          key={problem.id}
                          href={`/problems/${problem.id}`}
                          className="block text-sm hover:text-primary transition-colors"
                        >
                          {problem.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link href="/tracks/1">Continue Track</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
