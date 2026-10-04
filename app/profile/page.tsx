"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Code,
  Edit,
  Github,
  Globe,
  Mail,
  MapPin,
  Share2,
  Trophy,
  Twitter,
  User,
  Award,
  BarChart2,
  TrendingUp,
  CheckCircle,
  XCircle,
  HelpCircle,
  Zap,
  BookOpen,
  Star,
  MessageSquare,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"

// Import chart components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chartData, setChartData] = useState<any[]>([])
  const [activityData, setActivityData] = useState<any[]>([])
  const [skillRadarData, setSkillRadarData] = useState<any[]>([])
  const [problemTypeData, setProblemTypeData] = useState<any[]>([])
  const [streakData, setStreakData] = useState<any[]>([])

  // Mock user data
  const user = {
    name: "Jane Doe",
    username: "janedoe",
    avatar: "/placeholder.svg?height=128&width=128",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    email: "jane@example.com",
    website: "https://janedoe.dev",
    github: "janedoe",
    twitter: "janedoe",
    bio: "Passionate about solving real-world problems with code. Specializing in backend systems, automation, and DevOps.",
    joinedDate: "May 2023",
    stats: {
      problemsSolved: 142,
      contestsParticipated: 12,
      ranking: 856,
      points: 3240,
      streak: 15,
    },
    badges: [
      { name: "Python Master", icon: <Code className="h-4 w-4" />, level: "Gold" },
      { name: "DevOps Specialist", icon: <Github className="h-4 w-4" />, level: "Silver" },
      { name: "Web Scraping Expert", icon: <Globe className="h-4 w-4" />, level: "Gold" },
      { name: "30-Day Streak", icon: <Calendar className="h-4 w-4" />, level: "Bronze" },
      { name: "Contest Winner", icon: <Trophy className="h-4 w-4" />, level: "Silver" },
    ],
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 85 },
      { name: "DevOps", level: 80 },
      { name: "Web Scraping", level: 90 },
      { name: "System Design", level: 75 },
      { name: "Database Design", level: 70 },
    ],
    recentActivity: [
      {
        type: "solved",
        problem: "Amazon Product Scraper",
        date: "2 days ago",
        difficulty: "Medium",
      },
      {
        type: "contest",
        name: "Weekly Contest #41",
        position: "12th",
        date: "1 week ago",
      },
      {
        type: "comment",
        problem: "GitHub Actions CI Pipeline",
        content: "Great solution! I would suggest adding caching to speed up the workflow.",
        date: "1 week ago",
      },
      {
        type: "solved",
        problem: "Distributed Cache Implementation",
        date: "2 weeks ago",
        difficulty: "Hard",
      },
      {
        type: "badge",
        name: "Python Master",
        date: "3 weeks ago",
      },
    ],
    completedTracks: [
      {
        name: "Web Scraping",
        progress: 100,
        problems: 20,
        icon: <Code className="h-4 w-4 text-accent-purple" />,
      },
    ],
    inProgressTracks: [
      {
        name: "Automation & Scripting",
        progress: 40,
        problems: 10,
        totalProblems: 25,
        icon: <Code className="h-4 w-4 text-accent-orange" />,
      },
      {
        name: "Backend Systems",
        progress: 25,
        problems: 7,
        totalProblems: 28,
        icon: <Code className="h-4 w-4 text-accent-blue" />,
      },
    ],
    problemStats: {
      easy: 65,
      medium: 52,
      hard: 25,
      totalAttempted: 162,
      totalSolved: 142,
      acceptanceRate: "87.6%",
      averageSolveTime: "42 min",
      fastestSolve: "5 min",
      longestStreak: 30,
      currentStreak: 15,
    },
    contestStats: {
      participated: 12,
      bestRank: 42,
      averageRank: 156,
      totalPoints: 1250,
    },
    activityByDay: {
      Monday: 15,
      Tuesday: 22,
      Wednesday: 18,
      Thursday: 25,
      Friday: 30,
      Saturday: 12,
      Sunday: 8,
    },
    activityByHour: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      problems: Math.floor(Math.random() * 10),
    })),
    activityByMonth: [
      { month: "Jan", problems: 12 },
      { month: "Feb", problems: 15 },
      { month: "Mar", problems: 18 },
      { month: "Apr", problems: 22 },
      { month: "May", problems: 28 },
      { month: "Jun", problems: 32 },
      { month: "Jul", problems: 38 },
      { month: "Aug", problems: 42 },
      { month: "Sep", problems: 45 },
      { month: "Oct", problems: 52 },
      { month: "Nov", problems: 58 },
      { month: "Dec", problems: 65 },
    ],
    problemCategories: [
      { name: "Web Scraping", count: 42 },
      { name: "DevOps", count: 35 },
      { name: "Backend", count: 28 },
      { name: "Database", count: 22 },
      { name: "Frontend", count: 15 },
    ],
    timeToSolve: [
      { difficulty: "Easy", avgTime: 15 },
      { difficulty: "Medium", avgTime: 45 },
      { difficulty: "Hard", avgTime: 120 },
    ],
    weeklyActivity: Array.from({ length: 52 }, (_, i) => ({
      week: i + 1,
      problems: Math.floor(Math.random() * 15),
    })),
    dailyStreak: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      active: Math.random() > 0.2,
    })),
  }

  // Generate chart data on component mount
  useEffect(() => {
    // Generate problem solving progress data
    const progressData = user.activityByMonth.map((month) => ({
      name: month.month,
      problems: month.problems,
    }))
    setChartData(progressData)

    // Generate activity data
    const activity = Object.entries(user.activityByDay).map(([day, count]) => ({
      day,
      problems: count,
    }))
    setActivityData(activity)

    // Generate skill radar data
    const radarData = user.skills.map((skill) => ({
      subject: skill.name,
      A: skill.level,
      fullMark: 100,
    }))
    setSkillRadarData(radarData)

    // Generate problem type data
    const problemTypes = user.problemCategories.map((category) => ({
      name: category.name,
      value: category.count,
    }))
    setProblemTypeData(problemTypes)

    // Generate streak data
    const streak = user.dailyStreak.map((day) => ({
      day: day.day,
      value: day.active ? 1 : 0,
    }))
    setStreakData(streak)
  }, [])

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

  // Colors for charts
  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#ef4444"]

  return (
    <div className="space-y-8">
      <motion.div className="relative" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-24 w-24 border-2 border-purple-500/30">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted">@{user.username}</p>
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{user.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted mt-1">
                      {user.company && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{user.company}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {user.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-500/10">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-500/10">
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <p className="text-sm">{user.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  {user.email && (
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center gap-1 text-muted hover:text-foreground"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </a>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted hover:text-foreground"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{user.website.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted hover:text-foreground"
                    >
                      <Github className="h-4 w-4" />
                      <span>{user.github}</span>
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={`https://twitter.com/${user.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted hover:text-foreground"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>{user.twitter}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" variants={containerVariants}>
          <motion.div variants={itemVariants} className="stats-card">
            <CardHeader className="stats-header">
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted">Problems Solved</span>
                  <span className="font-medium">{user.stats.problemsSolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Contests Participated</span>
                  <span className="font-medium">{user.stats.contestsParticipated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Global Ranking</span>
                  <span className="font-medium">#{user.stats.ranking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Points</span>
                  <span className="font-medium">{user.stats.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Current Streak</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-accent-orange" />
                    <span className="font-medium">{user.stats.streak} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>

          <motion.div variants={itemVariants} className="stats-card">
            <CardHeader className="stats-header">
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-card rounded-md">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        badge.level === "Gold"
                          ? "bg-yellow-500/20"
                          : badge.level === "Silver"
                            ? "bg-gray-300/20"
                            : "bg-amber-600/20"
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{badge.name}</p>
                      <Badge
                        variant="outline"
                        className={
                          badge.level === "Gold"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : badge.level === "Silver"
                              ? "bg-gray-300/10 text-gray-300 border-gray-300/20"
                              : "bg-amber-600/10 text-amber-600 border-amber-600/20"
                        }
                      >
                        {badge.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>

          <motion.div variants={itemVariants} className="stats-card">
            <CardHeader className="stats-header">
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
          <TabsList className="bg-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="tracks">Learning Tracks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.recentActivity.slice(0, 3).map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#activity">View All Activity</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Completed Tracks</p>
                      {user.completedTracks.map((track, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-card rounded-md mb-2">
                          <div className="flex items-center gap-2">
                            {track.icon}
                            <span>{track.name}</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-500">{track.problems} problems</Badge>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">In Progress</p>
                      {user.inProgressTracks.map((track, index) => (
                        <div key={index} className="space-y-1 p-2 bg-card rounded-md mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {track.icon}
                              <span>{track.name}</span>
                            </div>
                            <span className="text-sm text-muted">
                              {track.problems}/{track.totalProblems}
                            </span>
                          </div>
                          <Progress value={track.progress} className="h-1" />
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/tracks">Explore More Tracks</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Your recent activity on Codura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentActivity.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Solutions</CardTitle>
                <CardDescription>Problems you've solved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        All
                      </Button>
                      <Button variant="outline" size="sm">
                        Easy
                      </Button>
                      <Button variant="outline" size="sm">
                        Medium
                      </Button>
                      <Button variant="outline" size="sm">
                        Hard
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">Sort by:</span>
                      <Button variant="outline" size="sm">
                        Most Recent
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {user.recentActivity
                      .filter((activity) => activity.type === "solved")
                      .map((activity, index) => (
                        <div key={index} className="flex justify-between p-3 bg-card rounded-md">
                          <div>
                            <Link
                              href={`/problems/${(activity.problem ?? "unknown").toLowerCase().replace(/\s+/g, "-")}`}
                              className="font-medium hover:text-accent-blue"
                            >
                              {activity.problem}
                            </Link>
                            <div className="flex gap-2 mt-1">
                              <Badge
                                className={
                                  activity.difficulty === "Easy"
                                    ? "bg-green-500/20 text-green-500"
                                    : activity.difficulty === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "bg-red-500/20 text-red-500"
                                }
                              >
                                {activity.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted">{activity.date}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Tracks</CardTitle>
                <CardDescription>Your progress in learning tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Completed Tracks</h3>
                    {user.completedTracks.length > 0 ? (
                      <div className="space-y-3">
                        {user.completedTracks.map((track, index) => (
                          <div key={index} className="p-4 bg-card rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {track.icon}
                                <span className="font-medium">{track.name}</span>
                              </div>
                              <Badge className="bg-green-500/20 text-green-500">Completed</Badge>
                            </div>
                            <div className="mt-2 flex justify-between text-sm text-muted">
                              <span>{track.problems} problems solved</span>
                              <span>100% complete</span>
                            </div>
                            <Progress value={100} className="h-2 mt-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-card rounded-md">
                        <p className="text-muted">You haven't completed any tracks yet.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">In Progress</h3>
                    {user.inProgressTracks.length > 0 ? (
                      <div className="space-y-3">
                        {user.inProgressTracks.map((track, index) => (
                          <div key={index} className="p-4 bg-card rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {track.icon}
                                <span className="font-medium">{track.name}</span>
                              </div>
                              <Badge className="bg-yellow-500/20 text-yellow-500">In Progress</Badge>
                            </div>
                            <div className="mt-2 flex justify-between text-sm text-muted">
                              <span>
                                {track.problems}/{track.totalProblems} problems solved
                              </span>
                              <span>{track.progress}% complete</span>
                            </div>
                            <Progress value={track.progress} className="h-2 mt-2" />
                            <div className="mt-3">
                              <Button size="sm" asChild>
                                <Link href={`/tracks/${track.name.toLowerCase().replace(/\s+/g, "-")}`}>
                                  Continue Track
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-card rounded-md">
                        <p className="text-muted">You don't have any tracks in progress.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button asChild>
                      <Link href="/tracks">Explore All Tracks</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent-blue" />
                    Problem Solving Progress
                  </CardTitle>
                  <CardDescription>Your problem-solving journey over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(139, 92, 246, 0.3)",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="problems"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorProblems)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent-orange" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Problems solved by day of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <XAxis dataKey="day" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(255, 111, 97, 0.3)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="problems" fill="#ff6f61">
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(255, 111, 97, ${0.5 + entry.problems / 60})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Skills Radar
                  </CardTitle>
                  <CardDescription>Your skill proficiency across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#a1a1aa" />
                        <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(139, 92, 246, 0.3)",
                            borderRadius: "8px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-accent-blue" />
                    Problem Categories
                  </CardTitle>
                  <CardDescription>Distribution of problems solved by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={problemTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {problemTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(59, 130, 246, 0.3)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent-green" />
                    Average Solve Time
                  </CardTitle>
                  <CardDescription>Average time to solve problems by difficulty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={user.timeToSolve}>
                        <XAxis dataKey="difficulty" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [`${value} min`, "Avg Time"]}
                        />
                        <Bar dataKey="avgTime" fill="#10b981">
                          {user.timeToSolve.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.difficulty === "Easy"
                                  ? "#10b981"
                                  : entry.difficulty === "Medium"
                                    ? "#f59e0b"
                                    : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-purple" />
                    Daily Streak
                  </CardTitle>
                  <CardDescription>Your daily coding activity for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={streakData} barSize={12}>
                        <XAxis dataKey="day" stroke="#a1a1aa" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 36, 0.9)",
                            borderColor: "rgba(139, 92, 246, 0.3)",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [value === 1 ? "Active" : "Inactive", "Status"]}
                        />
                        <Bar dataKey="value" fill="#8b5cf6">
                          {streakData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.value === 1 ? "#8b5cf6" : "rgba(139, 92, 246, 0.2)"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Streak</p>
                      <p className="text-2xl font-bold text-accent-orange">{user.problemStats.currentStreak} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Longest Streak</p>
                      <p className="text-2xl font-bold text-accent-green">{user.problemStats.longestStreak} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acceptance Rate</p>
                      <p className="text-2xl font-bold text-accent-blue">{user.problemStats.acceptanceRate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-accent-purple" />
                  Problem Solving Statistics
                </CardTitle>
                <CardDescription>Detailed breakdown of your problem-solving performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Difficulty Breakdown</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Badge className="bg-green-500/20 text-green-500">Easy</Badge>
                            <span>{user.problemStats.easy} solved</span>
                          </div>
                          <span className="text-muted">
                            {Math.round((user.problemStats.easy / user.problemStats.totalSolved) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{
                              width: `${(user.problemStats.easy / user.problemStats.totalSolved) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Badge className="bg-yellow-500/20 text-yellow-500">Medium</Badge>
                            <span>{user.problemStats.medium} solved</span>
                          </div>
                          <span className="text-muted">
                            {Math.round((user.problemStats.medium / user.problemStats.totalSolved) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-500"
                            style={{
                              width: `${(user.problemStats.medium / user.problemStats.totalSolved) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Badge className="bg-red-500/20 text-red-500">Hard</Badge>
                            <span>{user.problemStats.hard} solved</span>
                          </div>
                          <span className="text-muted">
                            {Math.round((user.problemStats.hard / user.problemStats.totalSolved) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-500"
                            style={{
                              width: `${(user.problemStats.hard / user.problemStats.totalSolved) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Solve Rate</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Solved</span>
                        </div>
                        <span className="font-medium">{user.problemStats.totalSolved}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span>Attempted but not solved</span>
                        </div>
                        <span className="font-medium">
                          {user.problemStats.totalAttempted - user.problemStats.totalSolved}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-yellow-500" />
                          <span>Acceptance Rate</span>
                        </div>
                        <span className="font-medium">{user.problemStats.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Time Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-accent-blue" />
                          <span>Average Solve Time</span>
                        </div>
                        <span className="font-medium">{user.problemStats.averageSolveTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-accent-orange" />
                          <span>Fastest Solve</span>
                        </div>
                        <span className="font-medium">{user.problemStats.fastestSolve}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-accent-purple" />
                          <span>Total Problems Attempted</span>
                        </div>
                        <span className="font-medium">{user.problemStats.totalAttempted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: any }) {
  if (activity.type === "solved") {
    return (
      <div className="flex gap-3 p-2 hover:bg-card rounded-md">
        <div className="mt-0.5">
          <Code className="h-4 w-4 text-accent-blue" />
        </div>
        <div>
          <p className="text-sm">
            Solved{" "}
            <Link
              href={`/problems/${(activity.problem ?? "unknown").toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium hover:text-accent-blue"
            >
              {activity.problem}
            </Link>
          </p>
          <div className="flex gap-2 mt-1">
            <Badge
              className={
                activity.difficulty === "Easy"
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : activity.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
              }
            >
              {activity.difficulty}
            </Badge>
            <span className="text-xs text-muted">{activity.date}</span>
          </div>
        </div>
      </div>
    )
  }

  if (activity.type === "contest") {
    return (
      <div className="flex gap-3 p-2 hover:bg-card rounded-md">
        <div className="mt-0.5">
          <Trophy className="h-4 w-4 text-accent-orange" />
        </div>
        <div>
          <p className="text-sm">
            Participated in{" "}
            <Link
              href={`/contests/${activity.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium hover:text-accent-blue"
            >
              {activity.name}
            </Link>{" "}
            and ranked {activity.position}
          </p>
          <p className="text-xs text-muted">{activity.date}</p>
        </div>
      </div>
    )
  }

  if (activity.type === "comment") {
    return (
      <div className="flex gap-3 p-2 hover:bg-card rounded-md">
        <div className="mt-0.5">
          <MessageSquare className="h-4 w-4 text-accent-purple" />
        </div>
        <div>
          <p className="text-sm">
            Commented on{" "}
            <Link
              href={`/problems/${(activity.problem ?? "unknown").toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium hover:text-accent-blue"
            >
              {activity.problem}
            </Link>
          </p>
          <p className="text-xs italic mt-1">"{activity.content}"</p>
          <p className="text-xs text-muted mt-1">{activity.date}</p>
        </div>
      </div>
    )
  }

  if (activity.type === "badge") {
    return (
      <div className="flex gap-3 p-2 hover:bg-card rounded-md">
        <div className="mt-0.5">
          <Award className="h-4 w-4 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm">
            Earned the <span className="font-medium">{activity.name}</span> badge
          </p>
          <p className="text-xs text-muted">{activity.date}</p>
        </div>
      </div>
    )
  }

  return null
}
