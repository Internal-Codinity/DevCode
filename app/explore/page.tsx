"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  ArrowRight,
  Search,
  Filter,
  Code,
  Trophy,
  Clock,
  CheckCircle,
  Lock,
  ArrowUpDown,
  Flame,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { problemsData } from "@/data/problems"
import { tracksData } from "@/data/tracks"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredProblems, setFilteredProblems] = useState(problemsData)
  const [trendingProblems, setTrendingProblems] = useState<typeof problemsData>([])

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  // Set trending problems on mount
  useEffect(() => {
    // Simulate trending problems (in a real app, this would come from an API)
    const trending = [...problemsData].sort(() => 0.5 - Math.random()).slice(0, 3)

    setTrendingProblems(trending)
  }, [])

  // Filter problems based on search and category
  useEffect(() => {
    let filtered = [...problemsData]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(query) || problem.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((problem) => problem.category.toLowerCase() === activeCategory.toLowerCase())
    }

    setFilteredProblems(filtered)
  }, [searchQuery, activeCategory])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] opacity-10 bg-cover bg-center"></div>
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1 text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Explore Codura
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover, Learn, and Master Real-World Coding</h1>
            <p className="text-lg text-gray-300 mb-6">
              Explore our comprehensive collection of real-world programming challenges, learning tracks, and
              competitive events.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Coding <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                Browse Challenges
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            type="search"
            placeholder="Search problems, tracks, or challenges..."
            className="pl-10 bg-card border-purple-500/20 focus:border-purple-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full md:w-[200px] bg-card border-purple-500/20">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Web Scraping">Web Scraping</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="border-purple-500/20 hover:bg-purple-500/10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Trending Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              className="problem-card group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    <Flame className="mr-1 h-3.5 w-3.5" /> Trending
                  </Badge>
                  <Badge
                    className={
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : problem.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
                <CardTitle className="mt-2 group-hover:text-purple-400 transition-colors">{problem.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {problem.description.replace(/<[^>]*>/g, "")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-card/50 border-purple-500/20">
                    {problem.category}
                  </Badge>
                  {problem.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-card/50 border-purple-500/20">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 2 && (
                    <Badge variant="outline" className="bg-card/50 border-purple-500/20">
                      +{problem.tags.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  asChild
                >
                  <Link href={`/problems/${problem.id}`}>
                    Solve Challenge <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-card/50 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80"
          >
            All Content
          </TabsTrigger>
          <TabsTrigger
            value="problems"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80"
          >
            Problems
          </TabsTrigger>
          <TabsTrigger
            value="tracks"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80"
          >
            Learning Tracks
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80"
          >
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* All Content Tab */}
        <TabsContent value="all" className="mt-6 space-y-8">
          {/* Featured Learning Tracks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Featured Learning Tracks</h2>
              </div>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300" asChild>
                <Link href="/tracks">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tracksData.slice(0, 3).map((track) => (
                <motion.div key={track.id} variants={itemVariants} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                  <Card className="relative border border-purple-500/20 overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {track.icon}
                          <div>
                            <CardTitle>{track.title}</CardTitle>
                            <CardDescription className="mt-1 line-clamp-2">{track.description}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          className={
                            track.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : track.difficulty === "Intermediate"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                          }
                        >
                          {track.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Progress</span>
                            <span className="font-medium">{track.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{ width: `${track.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Code className="h-4 w-4 text-purple-400" />
                            <span>
                              {track.completedCount}/{track.problemCount} problems
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>~{track.estimatedHours} hours</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {track.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-card/50 border-purple-500/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:shadow-glow transition-all duration-300"
                        asChild
                      >
                        <Link href={`/tracks/${track.id}`}>
                          {track.progress === 0
                            ? "Start Track"
                            : track.progress === 100
                              ? "Review Track"
                              : "Continue Track"}{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Popular Problems */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Popular Problems</h2>
              </div>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300" asChild>
                <Link href="/problems">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProblems.slice(0, 6).map((problem, index) => (
                <motion.div key={problem.id} variants={itemVariants} className="problem-card group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="group-hover:text-purple-400 transition-colors">{problem.title}</CardTitle>
                      <Badge
                        className={
                          problem.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {problem.description.replace(/<[^>]*>/g, "")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-card/50 border-purple-500/20">
                        {problem.category}
                      </Badge>
                      {problem.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-card/50 border-purple-500/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {problem.stats && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted">
                          <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                          <span>{problem.stats.acceptanceRate} success</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted">
                          <Clock className="h-3.5 w-3.5 text-blue-400" />
                          <span>{problem.stats.avgTimeToSolve}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:shadow-glow transition-all duration-300"
                      asChild
                    >
                      <Link href={`/problems/${problem.id}`}>
                        Solve Problem <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Upcoming Challenges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Upcoming Challenges</h2>
              </div>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300" asChild>
                <Link href="/challenges/time-boxed">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                <Card className="relative border border-orange-500/20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-orange-500" />
                          <CardTitle className="group-hover:text-orange-400 transition-colors">
                            Weekly Contest #42
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          Solve real-world challenges focused on web scraping and data processing.
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Intermediate</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted" />
                        <span>May 18, 2025</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted" />
                        <span>8:00 PM UTC</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted" />
                        <span>2 hours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted" />
                        <span>1248 participants</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                        Web Scraping
                      </Badge>
                      <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                        Data Processing
                      </Badge>
                      <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                        API Integration
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 group-hover:shadow-glow transition-all duration-300">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                <Card className="relative border border-blue-500/20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-blue-500" />
                          <CardTitle className="group-hover:text-blue-400 transition-colors">
                            Biweekly Contest #21
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          Focus on DevOps challenges including CI/CD pipelines and infrastructure as code.
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Advanced</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted" />
                        <span>May 25, 2025</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted" />
                        <span>2:00 PM UTC</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted" />
                        <span>3 hours</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted" />
                        <span>856 participants</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                        DevOps
                      </Badge>
                      <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                        CI/CD
                      </Badge>
                      <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                        Infrastructure
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 group-hover:shadow-glow transition-all duration-300">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Problems Tab */}
        <TabsContent value="problems" className="mt-6">
          <Card>
            <CardHeader className="p-4 border-b border-border">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted">
                <div className="col-span-6 sm:col-span-6 flex items-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium flex items-center gap-1">
                    Title <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Difficulty
                  </Button>
                </div>
                <div className="col-span-3 hidden sm:flex items-center justify-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Category
                  </Button>
                </div>
                <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Success
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <motion.div
                className="divide-y divide-border"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    variants={itemVariants}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-card/50 transition-colors"
                  >
                    <div className="col-span-6 sm:col-span-6">
                      <Link
                        href={`/problems/${problem.id}`}
                        className="font-medium hover:text-purple-400 transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {problem.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-card/50 border-purple-500/20">
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-card/50 border-purple-500/20">
                            +{problem.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                      <Badge
                        className={
                          problem.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="col-span-3 hidden sm:flex items-center justify-center">
                      <Badge variant="outline" className="bg-card/50 border-purple-500/20">
                        {problem.category}
                      </Badge>
                    </div>
                    <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                      {problem.stats && (
                        <span className="text-sm font-medium text-green-400">{problem.stats.acceptanceRate}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracks Tab */}
        <TabsContent value="tracks" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tracksData.map((track, index) => (
              <motion.div key={track.id} variants={itemVariants} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                <Card className="relative border border-purple-500/20 overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {track.icon}
                        <div>
                          <CardTitle>{track.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{track.description}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={
                          track.difficulty === "Beginner"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : track.difficulty === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                        }
                      >
                        {track.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Progress</span>
                          <span className="font-medium">{track.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${track.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Code className="h-4 w-4 text-purple-400" />
                          <span>
                            {track.completedCount}/{track.problemCount} problems
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span>~{track.estimatedHours} hours</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted">Track Levels:</p>
                        <div className="space-y-2">
                          {track.levels.slice(0, 2).map((level) => (
                            <div
                              key={level.level}
                              className={`flex items-center justify-between p-2 rounded-md ${
                                level.isLocked ? "bg-card/50 opacity-70" : "bg-card"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {level.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : level.isLocked ? (
                                  <Lock className="h-4 w-4 text-muted" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted flex items-center justify-center text-xs">
                                    {level.level}
                                  </div>
                                )}
                                <span className={level.isLocked ? "text-muted" : ""}>
                                  {level.title} ({level.problemCount})
                                </span>
                              </div>
                            </div>
                          ))}
                          {track.levels.length > 2 && (
                            <div className="text-center text-sm text-muted">+{track.levels.length - 2} more levels</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:shadow-glow transition-all duration-300"
                      asChild
                    >
                      <Link href={`/tracks/${track.id}`}>
                        {track.progress === 0
                          ? "Start Track"
                          : track.progress === 100
                            ? "Review Track"
                            : "Continue Track"}{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
              <Card className="relative border border-orange-500/20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="group-hover:text-orange-400 transition-colors">
                      Fix Broken Automation Script
                    </CardTitle>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Medium</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    Debug and fix a Python automation script that's failing to process files correctly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium">10 min time limit</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                      Debugging
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                      Python
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-orange-500/20">
                      Automation
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 group-hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <Link href="/challenges/time-boxed/fix-broken-automation-script">
                      Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
              <Card className="relative border border-blue-500/20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="group-hover:text-blue-400 transition-colors">
                      Optimize Database Query
                    </CardTitle>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Hard</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    Improve the performance of a slow SQL query that's causing timeouts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">15 min time limit</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                      Optimization
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                      SQL
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-blue-500/20">
                      Database
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 group-hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <Link href="/challenges/time-boxed/optimize-database-query">
                      Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
              <Card className="relative border border-green-500/20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="group-hover:text-green-400 transition-colors">
                      Implement Rate Limiter
                    </CardTitle>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Medium</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    Implement a rate limiter for an API to prevent abuse.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">20 min time limit</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-card/50 border-green-500/20">
                      Implementation
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-green-500/20">
                      API
                    </Badge>
                    <Badge variant="outline" className="bg-card/50 border-green-500/20">
                      Rate Limiting
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 group-hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <Link href="/challenges/time-boxed/implement-rate-limiter">
                      Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
