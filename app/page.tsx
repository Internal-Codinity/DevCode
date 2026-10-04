import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Code,
  BookOpen,
  Trophy,
  Zap,
  Users,
  ArrowRight,
  Star,
  Clock,
  Bookmark,
  CheckCircle2,
} from "lucide-react"
import TopArticles from "@/components/top-articles"

// Sample data for tracks
const featuredTracks = [
  {
    id: 1,
    title: "Data Structures Mastery",
    description: "Master fundamental data structures with practical examples",
    difficulty: "Beginner to Intermediate",
    chapters: 12,
    problems: 45,
    progress: 0,
    image: "/placeholder.svg?height=120&width=240",
    color: "from-blue-500 to-indigo-700",
  },
  {
    id: 2,
    title: "Algorithm Techniques",
    description: "Learn essential algorithm techniques and patterns",
    difficulty: "Intermediate",
    chapters: 10,
    problems: 38,
    progress: 0,
    image: "/placeholder.svg?height=120&width=240",
    color: "from-purple-500 to-pink-700",
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    description: "Build a strong foundation in system design principles",
    difficulty: "Intermediate to Advanced",
    chapters: 8,
    problems: 20,
    progress: 0,
    image: "/placeholder.svg?height=120&width=240",
    color: "from-emerald-500 to-teal-700",
  },
]

const topQuestions = [
  {
    id: 101,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "48%",
    popularity: 4.8,
  },
  {
    id: 102,
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    acceptance: "65%",
    popularity: 4.7,
  },
  {
    id: 103,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    acceptance: "42%",
    popularity: 4.6,
  },
  {
    id: 104,
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    acceptance: "38%",
    popularity: 4.9,
  },
  {
    id: 105,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance: "32%",
    popularity: 4.5,
  },
]

const curatedSheets = [
  {
    id: 201,
    title: "Top 75 LeetCode Questions",
    author: "Tech Lead",
    problems: 75,
    likes: 2840,
    tags: ["Interview Prep", "Comprehensive"],
  },
  {
    id: 202,
    title: "Dynamic Programming Patterns",
    author: "DP Master",
    problems: 50,
    likes: 1560,
    tags: ["DP", "Patterns"],
  },
  {
    id: 203,
    title: "Graph Algorithms Simplified",
    author: "Graph Guru",
    problems: 35,
    likes: 980,
    tags: ["Graph", "BFS", "DFS"],
  },
]

const companySheets = [
  {
    id: 301,
    title: "Google Interview Questions",
    problems: 120,
    frequency: "High",
    updated: "2 days ago",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 302,
    title: "Amazon Top Questions",
    problems: 95,
    frequency: "High",
    updated: "1 week ago",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 303,
    title: "Microsoft Interview Kit",
    problems: 85,
    frequency: "Medium",
    updated: "3 days ago",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

const courses = [
  {
    id: 401,
    title: "Machine Learning 101",
    instructor: "AI Expert",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 12500,
    image: "/placeholder.svg?height=120&width=240",
  },
  {
    id: 402,
    title: "Advanced JavaScript",
    instructor: "JS Ninja",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 9800,
    image: "/placeholder.svg?height=120&width=240",
  },
  {
    id: 403,
    title: "System Design Interview",
    instructor: "Design Guru",
    duration: "10 weeks",
    level: "Advanced",
    rating: 4.9,
    students: 15200,
    image: "/placeholder.svg?height=120&width=240",
  },
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Area */}
            <div className="lg:w-3/4">
              <h1 className="text-3xl font-bold mb-2">Welcome to Codura</h1>
              <p className="text-muted-foreground mb-6">
                Master coding with real-world challenges and structured learning paths
              </p>

              <Tabs defaultValue="featured" className="mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="featured">Featured Tracks</TabsTrigger>
                  <TabsTrigger value="top">Top Questions</TabsTrigger>
                  <TabsTrigger value="curated">Curated Sheets</TabsTrigger>
                  <TabsTrigger value="company">Company Wise</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                </TabsList>

                {/* Featured Tracks */}
                <TabsContent value="featured" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredTracks.map((track) => (
                      <Card
                        key={track.id}
                        className="overflow-hidden border border-border/40 hover:border-primary/20 transition-all"
                      >
                        <div className={`h-24 bg-gradient-to-r ${track.color} flex items-center justify-center`}>
                          <img
                            src={track.image || "/placeholder.svg"}
                            alt={track.title}
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{track.title}</CardTitle>
                          <CardDescription>{track.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{track.chapters} chapters</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Code className="h-4 w-4" />
                              <span>{track.problems} problems</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-2">
                            {track.difficulty}
                          </Badge>
                        </CardContent>
                        <CardFooter>
                          <Button variant="default" className="w-full" asChild>
                            <Link href={`/tracks/${track.id}`}>
                              Start Track <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/tracks">View All Tracks</Link>
                    </Button>
                  </div>
                </TabsContent>

                {/* Top Questions */}
                <TabsContent value="top">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Interview Questions</CardTitle>
                      <CardDescription>Most frequently asked coding interview questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {topQuestions.map((question) => (
                          <Link
                            key={question.id}
                            href={`/problems/${question.id}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{question.title}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty}
                                </Badge>
                                {question.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-muted-foreground">{question.acceptance} acceptance</div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{question.popularity}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/problems">View All Problems</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Curated Sheets */}
                <TabsContent value="curated">
                  <Card>
                    <CardHeader>
                      <CardTitle>Curated Problem Sheets</CardTitle>
                      <CardDescription>Handpicked collections by top coders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {curatedSheets.map((sheet) => (
                          <div
                            key={sheet.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex flex-col">
                              <Link href={`/sheets/${sheet.id}`} className="font-medium hover:text-primary">
                                {sheet.title}
                              </Link>
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <span>By {sheet.author}</span>
                                <span>•</span>
                                <span>{sheet.problems} problems</span>
                              </div>
                              <div className="flex gap-2 mt-1">
                                {sheet.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Bookmark className="h-4 w-4" />
                                Save
                              </Button>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{sheet.likes}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/sheets">View All Sheets</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Company Wise */}
                <TabsContent value="company">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company-Specific Questions</CardTitle>
                      <CardDescription>Prepare for your target companies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companySheets.map((company) => (
                          <Link
                            key={company.id}
                            href={`/companies/${company.id}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                                <img
                                  src={company.logo || "/placeholder.svg"}
                                  alt={company.title}
                                  className="h-8 w-8 object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{company.title}</span>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{company.problems} problems</span>
                                  <span>•</span>
                                  <span>Frequency: {company.frequency}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Updated {company.updated}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/companies">View All Companies</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Courses */}
                <TabsContent value="courses">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <Card
                        key={course.id}
                        className="overflow-hidden border border-border/40 hover:border-primary/20 transition-all"
                      >
                        <div className="h-40 bg-accent/30 flex items-center justify-center">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>By {course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()} students</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{course.rating}</span>
                            <Badge variant="outline" className="ml-2">
                              {course.level}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="default" className="w-full" asChild>
                            <Link href={`/courses/${course.id}`}>Enroll Now</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/courses">View All Courses</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Weekly Contest Banner - Small Version */}
              <div className="mb-8 bg-gradient-to-r from-purple-900 to-indigo-800 rounded-lg overflow-hidden shadow-lg">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-white">Weekly Contest #42</h2>
                    <p className="text-purple-200 mt-1">Starts in 2 days, 14 hours</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        4 Problems
                      </Badge>
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        1.5 Hours
                      </Badge>
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        Global Ranking
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-white text-purple-900 hover:bg-purple-100" asChild>
                    <Link href="/contests">Register Now</Link>
                  </Button>
                </div>
              </div>

              {/* Platform Features - Smaller Version */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Code className="mr-2 h-5 w-5 text-primary" />
                      Real-world Problems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice with problems inspired by actual industry scenarios and challenges.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-primary" />
                      Weekly Contests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Compete with coders worldwide in our weekly coding competitions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-primary" />
                      Structured Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Follow curated learning paths designed by industry experts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-1/4">
              <TopArticles />

              {/* Recent Activity */}
              <Card className="mb-6 border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Your Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 pb-2 border-b border-border/30">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Solved "Two Sum"</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-border/30">
                      <Bookmark className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Saved "DP Patterns" sheet</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Participated in Weekly Contest #41</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                    <Link href="/profile/activity">View All Activity</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Calendar View */}
              <Card className="mb-6 border border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Coding Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => {
                      // Randomly determine if the day has activity
                      const hasActivity = Math.random() > 0.6
                      return (
                        <div
                          key={i}
                          className={`h-6 w-6 rounded-sm border ${
                            hasActivity ? "bg-primary/80 border-primary" : "bg-accent/30 border-border/40"
                          }`}
                          title={hasActivity ? "Solved problems" : "No activity"}
                        />
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>Current streak: 5 days</span>
                    <span>Longest: 14 days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Companies */}
              <Card className="border border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Trending Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Google", count: 1254, logo: "/placeholder.svg?height=24&width=24" },
                      { name: "Amazon", count: 987, logo: "/placeholder.svg?height=24&width=24" },
                      { name: "Microsoft", count: 865, logo: "/placeholder.svg?height=24&width=24" },
                      { name: "Meta", count: 743, logo: "/placeholder.svg?height=24&width=24" },
                      { name: "Apple", count: 621, logo: "/placeholder.svg?height=24&width=24" },
                    ].map((company, i) => (
                      <Link
                        key={i}
                        href={`/companies/${company.name.toLowerCase()}`}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                            <img src={company.logo || "/placeholder.svg"} alt={company.name} className="h-5 w-5" />
                          </div>
                          <span className="text-sm">{company.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {company.count}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
