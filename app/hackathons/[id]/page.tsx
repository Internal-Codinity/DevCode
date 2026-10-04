"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Clock,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle,
  FileText,
  MessageSquare,
  Code,
  Laptop,
  Zap,
  AlertTriangle,
  ThumbsUp,
  Flag,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function HackathonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const hackathonId = params.id as string
  const [registrationStatus, setRegistrationStatus] = useState<"not-registered" | "registered" | "confirmed">(
    "not-registered",
  )
  const [comment, setComment] = useState("")
  const [activeDiscussionTab, setActiveDiscussionTab] = useState("discussions")

  // Mock hackathon data
  const hackathon = {
    id: hackathonId,
    title: "Data Visualization Hackathon",
    description: "Build an interactive dashboard to visualize and analyze complex datasets.",
    longDescription: `
      This hackathon challenges you to create innovative data visualization solutions that transform complex datasets into intuitive, interactive dashboards. You'll work with real-world data to build visualizations that reveal insights and patterns that might otherwise remain hidden.
      
      Your solution should focus on both technical excellence and user experience, making data accessible and meaningful to users of all technical backgrounds.
    `,
    startDate: "June 15, 2025",
    endDate: "June 17, 2025",
    duration: "48 hours",
    timeRemaining: "29 days, 14 hours",
    participants: 128,
    maxTeamSize: 4,
    prizes: ["$1,000 for 1st Place", "$500 for 2nd Place", "$250 for 3rd Place"],
    tags: ["Data Visualization", "Dashboard", "Analytics"],
    status: "upcoming",
    timeline: [
      { date: "May 15, 2025", event: "Registration Opens" },
      { date: "June 10, 2025", event: "Registration Closes" },
      { date: "June 15, 2025", event: "Hackathon Starts" },
      { date: "June 17, 2025", event: "Submissions Due" },
      { date: "June 20, 2025", event: "Winners Announced" },
    ],
    sponsors: [
      { name: "TechCorp", logo: "/placeholder.svg?height=40&width=120" },
      { name: "DataViz Inc", logo: "/placeholder.svg?height=40&width=120" },
      { name: "Analytics Pro", logo: "/placeholder.svg?height=40&width=120" },
    ],
    judges: [
      {
        name: "Dr. Sarah Chen",
        role: "Data Science Director, TechCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Michael Rodriguez",
        role: "VP of Engineering, DataViz Inc",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Emma Wilson",
        role: "UX Research Lead, Analytics Pro",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    requirements: [
      "Your dashboard must visualize at least 3 different aspects of the provided dataset",
      "Solution must include interactive elements (filtering, sorting, etc.)",
      "Visualizations should be responsive and work on different screen sizes",
      "Code must be well-documented and follow best practices",
      "Submissions must include a brief explanation of design choices",
    ],
    resources: [
      { name: "Sample Datasets", url: "#" },
      { name: "Visualization Libraries Documentation", url: "#" },
      { name: "Design Guidelines", url: "#" },
    ],
  }

  // Mock discussions data
  const discussions = [
    {
      id: "disc-1",
      title: "Best visualization libraries for this hackathon?",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 1250,
      },
      content:
        "I'm trying to decide between D3.js and Chart.js for this hackathon. D3 is more powerful but has a steeper learning curve. Any recommendations based on the requirements?",
      votes: 24,
      replies: 8,
      timestamp: "1 day ago",
      tags: ["libraries", "visualization"],
    },
    {
      id: "disc-2",
      title: "Looking for team members",
      author: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 3420,
      },
      content:
        "I'm a frontend developer with experience in React and data visualization. Looking for 2-3 team members, preferably with data science or UX design backgrounds. DM me if interested!",
      votes: 32,
      replies: 12,
      timestamp: "3 days ago",
      tags: ["team-building", "collaboration"],
    },
  ]

  const handleRegistration = () => {
    if (registrationStatus === "not-registered") {
      setRegistrationStatus("registered")
      toast({
        title: "Registration Successful",
        description: `You're now registered for the ${hackathon.title}!`,
      })
    } else if (registrationStatus === "registered") {
      setRegistrationStatus("confirmed")
      toast({
        title: "Registration Confirmed",
        description: "Your team is all set for the hackathon!",
      })
    } else {
      toast({
        title: "Already Registered",
        description: "You're already confirmed for this hackathon.",
      })
    }
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      toast({
        title: "Comment Posted",
        description: "Your comment has been posted to the discussion.",
      })
      setComment("")
    }
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Hackathons
      </Button>

      <div className="relative overflow-hidden rounded-xl border border-accent-purple/30">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-accent-purple" />
                <h1 className="text-3xl font-bold">{hackathon.title}</h1>
              </div>
              <p className="text-lg">{hackathon.description}</p>

              <div className="flex flex-wrap gap-2">
                {hackathon.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-card/50 border-accent-purple/20">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-accent-purple" />
                  <span>
                    {hackathon.startDate} - {hackathon.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-accent-purple" />
                  <span>{hackathon.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-accent-purple" />
                  <span>{hackathon.participants} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-accent-purple" />
                  <span>Teams of {hackathon.maxTeamSize}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-w-[250px]">
              <Card className="bg-card/50 border-accent-purple/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Time Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-2xl font-bold text-accent-purple">
                    <Clock className="h-6 w-6" />
                    <span>{hackathon.timeRemaining}</span>
                  </div>
                  <Progress value={70} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Button
                className="w-full bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90"
                onClick={handleRegistration}
              >
                {registrationStatus === "not-registered"
                  ? "Register Now"
                  : registrationStatus === "registered"
                    ? "Confirm Registration"
                    : "Registration Confirmed"}
                <CheckCircle
                  className={`ml-2 h-4 w-4 ${registrationStatus === "confirmed" ? "opacity-100" : "opacity-0"}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-card">
              <TabsTrigger value="overview">
                <FileText className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="rules">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Rules & Requirements
              </TabsTrigger>
              <TabsTrigger value="discussions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="resources">
                <Code className="mr-2 h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Hackathon</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p>{hackathon.longDescription}</p>

                  <h3>Prizes</h3>
                  <ul>
                    {hackathon.prizes.map((prize, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Trophy
                          className={`h-5 w-5 ${
                            index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                          }`}
                        />
                        {prize}
                      </li>
                    ))}
                  </ul>

                  <h3>Timeline</h3>
                  <div className="space-y-4 not-prose">
                    {hackathon.timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-6 rounded-full bg-accent-purple flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          {index < hackathon.timeline.length - 1 && (
                            <div className="h-10 w-0.5 bg-accent-purple/30 mt-1"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-muted">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3>Judges</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
                    {hackathon.judges.map((judge, index) => (
                      <Card key={index} className="bg-card/50">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <Avatar className="h-16 w-16 mb-2">
                            <AvatarImage src={judge.avatar || "/placeholder.svg"} alt={judge.name} />
                            <AvatarFallback>{judge.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-medium">{judge.name}</h4>
                          <p className="text-sm text-muted">{judge.role}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <h3>Sponsors</h3>
                  <div className="flex flex-wrap gap-6 items-center justify-center not-prose">
                    {hackathon.sponsors.map((sponsor, index) => (
                      <div key={index} className="bg-card/50 p-4 rounded-lg">
                        <img src={sponsor.logo || "/placeholder.svg"} alt={sponsor.name} className="h-10" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Requirements</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h3>Eligibility</h3>
                  <ul>
                    <li>Open to all registered users of Codura</li>
                    <li>Participants can compete individually or in teams of up to {hackathon.maxTeamSize} people</li>
                    <li>All team members must be registered on the platform</li>
                  </ul>

                  <h3>Submission Requirements</h3>
                  <ul>
                    {hackathon.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>

                  <h3>Judging Criteria</h3>
                  <div className="space-y-4 not-prose">
                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Laptop className="h-5 w-5 text-accent-purple" />
                        <h4 className="font-medium">Technical Implementation (40%)</h4>
                      </div>
                      <p className="text-sm text-muted">
                        Code quality, architecture, performance, and technical innovation
                      </p>
                    </div>

                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-accent-orange" />
                        <h4 className="font-medium">User Experience (30%)</h4>
                      </div>
                      <p className="text-sm text-muted">
                        Usability, design, accessibility, and overall user experience
                      </p>
                    </div>

                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-medium">Innovation (20%)</h4>
                      </div>
                      <p className="text-sm text-muted">Originality, creativity, and uniqueness of the solution</p>
                    </div>

                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-accent-blue" />
                        <h4 className="font-medium">Presentation (10%)</h4>
                      </div>
                      <p className="text-sm text-muted">
                        Quality of documentation, demo, and explanation of the solution
                      </p>
                    </div>
                  </div>

                  <h3>Code of Conduct</h3>
                  <p>All participants are expected to adhere to our community code of conduct. This includes:</p>
                  <ul>
                    <li>Treating all participants with respect and dignity</li>
                    <li>No plagiarism or use of pre-existing solutions</li>
                    <li>All code must be written during the hackathon period</li>
                    <li>Collaboration is encouraged, but only within your team</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Hackathon Discussions</CardTitle>
                    <Button variant="default" size="sm">
                      New Discussion
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeDiscussionTab} onValueChange={setActiveDiscussionTab} className="w-full">
                    <TabsList className="bg-card w-full">
                      <TabsTrigger value="discussions" className="flex-1">
                        Discussions
                      </TabsTrigger>
                      <TabsTrigger value="announcements" className="flex-1">
                        Announcements
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="mt-4 space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id} className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={discussion.author.avatar || "/placeholder.svg"}
                                  alt={discussion.author.name}
                                />
                                <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{discussion.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                  <span>{discussion.author.name}</span>
                                  <Badge variant="outline" className="text-xs bg-card">
                                    {discussion.author.reputation} rep
                                  </Badge>
                                  <span>{discussion.timestamp}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">{discussion.content}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-card">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{discussion.votes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{discussion.replies}</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full space-y-2">
                    <Textarea
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hackathon Resources</CardTitle>
                  <CardDescription>Use these resources to help you build your hackathon project.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.resources.map((resource, index) => (
                      <Card key={index} className="bg-card/50">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-accent-purple" />
                            <span className="font-medium">{resource.name}</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="bg-card/50">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-accent-blue" />
                          <span className="font-medium">Starter Code Template</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Clone Repository
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-card/50">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-accent-orange" />
                          <span className="font-medium">Discord Channel</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Join Channel
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border border-accent-purple/30">
            <CardHeader>
              <CardTitle>Team Formation</CardTitle>
              <CardDescription>Form a team or join an existing one for this hackathon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-card/50 rounded-lg">
                <h3 className="font-medium mb-2">Create a Team</h3>
                <p className="text-sm text-muted mb-3">Start your own team and invite others to join you.</p>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Team Created",
                      description: "Your team has been created. You can now invite members.",
                    })
                  }}
                >
                  Create Team
                </Button>
              </div>

              <div className="p-4 bg-card/50 rounded-lg">
                <h3 className="font-medium mb-2">Find a Team</h3>
                <p className="text-sm text-muted mb-3">Browse existing teams looking for members.</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Team Browser",
                      description: "Browsing available teams for this hackathon.",
                    })
                  }}
                >
                  Browse Teams
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-accent-purple/30">
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>GitHub repository with source code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Demo video (max 5 minutes)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Presentation slides (PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Project description (max 500 words)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Live demo URL (if applicable)</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Submission Guidelines",
                    description: "Detailed submission guidelines have been sent to your email.",
                  })
                }}
              >
                Download Full Guidelines
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
