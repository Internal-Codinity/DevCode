"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Trophy, Clock, Calendar, Users, ArrowRight, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function HackathonsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter hackathons based on search query
  const filteredUpcomingHackathons = upcomingHackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredOngoingHackathons = ongoingHackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredPastHackathons = pastHackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Hackathons</h1>
        <p className="text-muted">
          Participate in hackathons to solve real-world challenges, collaborate with others, and win prizes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
          <Input
            type="search"
            placeholder="Search hackathons..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUpcomingHackathons.length > 0 ? (
              filteredUpcomingHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} type="upcoming" />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Trophy className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming hackathons found</h3>
                <p className="text-muted">Check back later or adjust your search query</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOngoingHackathons.length > 0 ? (
              filteredOngoingHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} type="ongoing" />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Trophy className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No ongoing hackathons found</h3>
                <p className="text-muted">Check back later or adjust your search query</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPastHackathons.length > 0 ? (
              filteredPastHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} type="past" />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Trophy className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No past hackathons found</h3>
                <p className="text-muted">Check back later or adjust your search query</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why Participate in Hackathons?</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Win Prizes
                </h3>
                <p className="text-sm text-muted">
                  Compete for cash prizes, swag, and recognition from industry leaders.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent-blue" />
                  Build Your Network
                </h3>
                <p className="text-sm text-muted">
                  Connect with like-minded developers, designers, and potential employers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent-purple" />
                  Learn New Skills
                </h3>
                <p className="text-sm text-muted">
                  Challenge yourself to learn new technologies and approaches under time constraints.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface Hackathon {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  duration: string
  timeRemaining?: string
  participants: number
  maxTeamSize: number
  prizes: string[]
  tags: string[]
}

interface HackathonCardProps {
  hackathon: Hackathon
  type: "upcoming" | "ongoing" | "past"
}

function HackathonCard({ hackathon, type }: HackathonCardProps) {
  const { toast } = useToast()

  return (
    <Card className="overflow-hidden border border-accent-purple/30">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10" />
        <CardHeader className="pb-2 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent-purple" />
                <CardTitle>{hackathon.title}</CardTitle>
              </div>
              <CardDescription className="mt-1">{hackathon.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 relative">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted" />
              <span>
                {hackathon.startDate} - {hackathon.endDate}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted" />
              <span>{hackathon.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted" />
              <span>{hackathon.participants} participants</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted" />
              <span>Teams of {hackathon.maxTeamSize}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {hackathon.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-card/50 border-accent-purple/20">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2 relative">
          {type === "upcoming" && (
            <Button
              className="w-full bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90"
              onClick={() => {
                toast({
                  title: "Registration Started",
                  description: `You're now registering for ${hackathon.title}`,
                })
              }}
            >
              Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {type === "ongoing" && (
            <Button
              className="w-full bg-gradient-to-r from-accent-orange to-accent-red hover:from-accent-orange/90 hover:to-accent-red/90"
              onClick={() => {
                toast({
                  title: "Joining Hackathon",
                  description: `You're now joining ${hackathon.title}`,
                })
              }}
            >
              Join Hackathon <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {type === "past" && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/hackathons/${hackathon.id}`}>
                View Results <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}

const upcomingHackathons = [
  {
    id: "data-viz-2025",
    title: "Data Visualization Hackathon",
    description: "Build an interactive dashboard to visualize and analyze complex datasets.",
    startDate: "June 15, 2025",
    endDate: "June 17, 2025",
    duration: "48 hours",
    timeRemaining: "29 days, 14 hours",
    participants: 128,
    maxTeamSize: 4,
    prizes: ["$1,000 for 1st Place", "$500 for 2nd Place", "$250 for 3rd Place"],
    tags: ["Data Visualization", "Dashboard", "Analytics"],
  },
  {
    id: "ai-chatbot-2025",
    title: "AI Chatbot Challenge",
    description: "Create an AI-powered chatbot that can assist users with specific domain knowledge.",
    startDate: "July 8, 2025",
    endDate: "July 10, 2025",
    duration: "48 hours",
    timeRemaining: "52 days, 8 hours",
    participants: 95,
    maxTeamSize: 3,
    prizes: ["$1,500 for 1st Place", "$750 for 2nd Place", "$300 for 3rd Place"],
    tags: ["AI", "NLP", "Chatbot"],
  },
]

const ongoingHackathons = [
  {
    id: "sustainable-tech-2025",
    title: "Sustainable Tech Hackathon",
    description: "Develop solutions that address environmental challenges using technology.",
    startDate: "Today",
    endDate: "Tomorrow",
    duration: "36 hours",
    timeRemaining: "18 hours left",
    participants: 156,
    maxTeamSize: 4,
    prizes: ["$2,000 for 1st Place", "$1,000 for 2nd Place", "$500 for 3rd Place"],
    tags: ["Sustainability", "Green Tech", "Climate"],
  },
]

const pastHackathons = [
  {
    id: "web3-defi-2025",
    title: "Web3 & DeFi Hackathon",
    description: "Build decentralized finance applications on blockchain technology.",
    startDate: "April 20, 2025",
    endDate: "April 22, 2025",
    duration: "48 hours",
    participants: 203,
    maxTeamSize: 4,
    prizes: ["$3,000 for 1st Place", "$1,500 for 2nd Place", "$750 for 3rd Place"],
    tags: ["Web3", "DeFi", "Blockchain"],
  },
  {
    id: "health-tech-2025",
    title: "Health Tech Innovation",
    description: "Create solutions that improve healthcare delivery and patient outcomes.",
    startDate: "March 15, 2025",
    endDate: "March 17, 2025",
    duration: "48 hours",
    participants: 178,
    maxTeamSize: 4,
    prizes: ["$2,500 for 1st Place", "$1,250 for 2nd Place", "$600 for 3rd Place"],
    tags: ["Health Tech", "MedTech", "Digital Health"],
  },
]
