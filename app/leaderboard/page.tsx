import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Search, ArrowUpDown, Medal, Award, MapPin } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted">See how you rank against other developers in the community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TopRankedCard
          position={1}
          name="Alex Johnson"
          username="alexj"
          avatar="/placeholder.svg?height=64&width=64"
          points={9876}
          problemsSolved={245}
          badges={12}
          location="New York, USA"
          color="gold"
        />
        <TopRankedCard
          position={2}
          name="Sarah Miller"
          username="sarahm"
          avatar="/placeholder.svg?height=64&width=64"
          points={8654}
          problemsSolved={231}
          badges={10}
          location="London, UK"
          color="silver"
        />
        <TopRankedCard
          position={3}
          name="Michael Chen"
          username="michaelc"
          avatar="/placeholder.svg?height=64&width=64"
          points={7932}
          problemsSolved={218}
          badges={9}
          location="Toronto, Canada"
          color="bronze"
        />
      </div>

      <Tabs defaultValue="global" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-card">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
              <Input type="search" placeholder="Search users..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web-scraping">Web Scraping</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="backend">Backend Systems</SelectItem>
                <SelectItem value="frontend">Frontend Engineering</SelectItem>
                <SelectItem value="distributed">Distributed Computing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="global" className="mt-0">
          <Card>
            <CardHeader className="p-4 border-b">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted">
                <div className="col-span-1 flex items-center justify-center">Rank</div>
                <div className="col-span-5 sm:col-span-4 flex items-center">User</div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium flex items-center gap-1">
                    Points <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-center">Problems</div>
                <div className="hidden sm:flex col-span-3 items-center justify-center">Badges</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaderboardData.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-card/50">
                    <div className="col-span-1 flex items-center justify-center">
                      {user.rank <= 3 ? (
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            user.rank === 1
                              ? "bg-yellow-500/20 text-yellow-500"
                              : user.rank === 2
                                ? "bg-gray-300/20 text-gray-300"
                                : "bg-amber-600/20 text-amber-600"
                          }`}
                        >
                          <Trophy className="h-4 w-4" />
                        </div>
                      ) : (
                        <span className="font-medium">{user.rank}</span>
                      )}
                    </div>
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/profile/${user.username}`} className="font-medium hover:text-accent-blue">
                          {user.name}
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <span>@{user.username}</span>
                          {user.location && (
                            <>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{user.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-accent-orange" />
                        <span className="font-medium">{user.points.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                      <span className="font-medium">{user.problemsSolved}</span>
                    </div>
                    <div className="hidden sm:flex col-span-3 items-center justify-center gap-1">
                      <div className="flex -space-x-2">
                        {user.topBadges.map((badge, index) => (
                          <div
                            key={index}
                            className={`h-6 w-6 rounded-full flex items-center justify-center border-2 border-background ${getBadgeColor(
                              badge.level,
                            )}`}
                            title={`${badge.name} (${badge.level})`}
                          >
                            {badge.icon}
                          </div>
                        ))}
                      </div>
                      {user.badgesCount > user.topBadges.length && (
                        <Badge variant="outline" className="ml-1 bg-card">
                          +{user.badgesCount - user.topBadges.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <Card className="p-8 text-center">
            <p className="text-muted">Monthly leaderboard resets on the 1st of each month.</p>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <Card className="p-8 text-center">
            <p className="text-muted">Weekly leaderboard resets every Monday.</p>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-0">
          <Card className="p-8 text-center">
            <p className="text-muted">Connect with friends to see how you rank among them.</p>
            <Button className="mt-4">Find Friends</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TopRankedCard({
  position,
  name,
  username,
  avatar,
  points,
  problemsSolved,
  badges,
  location,
  color,
}: {
  position: number
  name: string
  username: string
  avatar: string
  points: number
  problemsSolved: number
  badges: number
  location: string
  color: "gold" | "silver" | "bronze"
}) {
  const colorClasses = {
    gold: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    silver: "from-gray-300/20 to-gray-300/5 border-gray-300/20",
    bronze: "from-amber-600/20 to-amber-600/5 border-amber-600/20",
  }

  const medalColors = {
    gold: "text-yellow-500",
    silver: "text-gray-300",
    bronze: "text-amber-600",
  }

  return (
    <Card className={`overflow-hidden border-2 ${colorClasses[color]}`}>
      <div className={`relative bg-gradient-to-b ${colorClasses[color]}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className={`absolute top-2 right-2 ${medalColors[color]}`}>
              <Medal className="h-8 w-8" />
            </div>

            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-muted">@{username}</p>

            <div className="flex items-center gap-1 text-sm text-muted mt-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{position}</p>
                <p className="text-xs text-muted">Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{points.toLocaleString()}</p>
                <p className="text-xs text-muted">Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{problemsSolved}</p>
                <p className="text-xs text-muted">Solved</p>
              </div>
            </div>

            <div className="mt-6 w-full">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/profile/${username}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function getBadgeColor(level: string) {
  switch (level) {
    case "Gold":
      return "bg-yellow-500/20"
    case "Silver":
      return "bg-gray-300/20"
    case "Bronze":
      return "bg-amber-600/20"
    default:
      return "bg-card"
  }
}

const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "New York, USA",
    points: 9876,
    problemsSolved: 245,
    badgesCount: 12,
    topBadges: [
      { name: "Python Master", icon: <Code className="h-3 w-3" />, level: "Gold" },
      { name: "DevOps Specialist", icon: <Github className="h-3 w-3" />, level: "Gold" },
      { name: "Contest Winner", icon: <Trophy className="h-3 w-3" />, level: "Gold" },
    ],
  },
  {
    id: 2,
    rank: 2,
    name: "Sarah Miller",
    username: "sarahm",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "London, UK",
    points: 8654,
    problemsSolved: 231,
    badgesCount: 10,
    topBadges: [
      { name: "Web Scraping Expert", icon: <Globe className="h-3 w-3" />, level: "Gold" },
      { name: "Backend Specialist", icon: <Server className="h-3 w-3" />, level: "Silver" },
      { name: "Contest Winner", icon: <Trophy className="h-3 w-3" />, level: "Silver" },
    ],
  },
  {
    id: 3,
    rank: 3,
    name: "Michael Chen",
    username: "michaelc",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Toronto, Canada",
    points: 7932,
    problemsSolved: 218,
    badgesCount: 9,
    topBadges: [
      { name: "Frontend Master", icon: <Layout className="h-3 w-3" />, level: "Gold" },
      { name: "JavaScript Expert", icon: <Code className="h-3 w-3" />, level: "Silver" },
      { name: "Contest Winner", icon: <Trophy className="h-3 w-3" />, level: "Bronze" },
    ],
  },
  {
    id: 4,
    rank: 4,
    name: "Emma Wilson",
    username: "emmaw",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Sydney, Australia",
    points: 7245,
    problemsSolved: 201,
    badgesCount: 8,
    topBadges: [
      { name: "Database Expert", icon: <Database className="h-3 w-3" />, level: "Gold" },
      { name: "Backend Specialist", icon: <Server className="h-3 w-3" />, level: "Silver" },
    ],
  },
  {
    id: 5,
    rank: 5,
    name: "David Park",
    username: "davidp",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Seoul, South Korea",
    points: 6789,
    problemsSolved: 187,
    badgesCount: 7,
    topBadges: [
      { name: "Algorithm Master", icon: <Code className="h-3 w-3" />, level: "Gold" },
      { name: "Problem Solver", icon: <Zap className="h-3 w-3" />, level: "Silver" },
    ],
  },
  {
    id: 6,
    rank: 6,
    name: "Olivia Brown",
    username: "oliviab",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Berlin, Germany",
    points: 6543,
    problemsSolved: 175,
    badgesCount: 6,
    topBadges: [
      { name: "DevOps Expert", icon: <Github className="h-3 w-3" />, level: "Silver" },
      { name: "Cloud Specialist", icon: <Cloud className="h-3 w-3" />, level: "Silver" },
    ],
  },
  {
    id: 7,
    rank: 7,
    name: "James Wilson",
    username: "jamesw",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Chicago, USA",
    points: 6321,
    problemsSolved: 168,
    badgesCount: 6,
    topBadges: [
      { name: "Security Expert", icon: <Shield className="h-3 w-3" />, level: "Gold" },
      { name: "Backend Specialist", icon: <Server className="h-3 w-3" />, level: "Bronze" },
    ],
  },
  {
    id: 8,
    rank: 8,
    name: "Sophia Garcia",
    username: "sophiag",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Madrid, Spain",
    points: 5987,
    problemsSolved: 159,
    badgesCount: 5,
    topBadges: [
      { name: "AI Specialist", icon: <Bot className="h-3 w-3" />, level: "Silver" },
      { name: "Data Scientist", icon: <BarChart className="h-3 w-3" />, level: "Silver" },
    ],
  },
  {
    id: 9,
    rank: 9,
    name: "Liam Johnson",
    username: "liamj",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Vancouver, Canada",
    points: 5654,
    problemsSolved: 152,
    badgesCount: 5,
    topBadges: [
      { name: "Mobile Developer", icon: <Smartphone className="h-3 w-3" />, level: "Gold" },
      { name: "UI/UX Expert", icon: <Palette className="h-3 w-3" />, level: "Bronze" },
    ],
  },
  {
    id: 10,
    rank: 10,
    name: "Jane Doe",
    username: "janed",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "San Francisco, USA",
    points: 5432,
    problemsSolved: 142,
    badgesCount: 5,
    topBadges: [
      { name: "Python Expert", icon: <Code className="h-3 w-3" />, level: "Silver" },
      { name: "DevOps Specialist", icon: <Github className="h-3 w-3" />, level: "Silver" },
    ],
  },
]

function Code(props: any) {
  return <div {...props} />
}

function Github(props: any) {
  return <div {...props} />
}

function Globe(props: any) {
  return <div {...props} />
}

function Server(props: any) {
  return <div {...props} />
}

function Layout(props: any) {
  return <div {...props} />
}

function Database(props: any) {
  return <div {...props} />
}

function Cloud(props: any) {
  return <div {...props} />
}

function Shield(props: any) {
  return <div {...props} />
}

function Bot(props: any) {
  return <div {...props} />
}

function BarChart(props: any) {
  return <div {...props} />
}

function Smartphone(props: any) {
  return <div {...props} />
}

function Palette(props: any) {
  return <div {...props} />
}

function Zap(props: any) {
  return <div {...props} />
}
