"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  TrendingUp,
  Tag,
  Bookmark,
  Share2,
  Eye,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DiscussPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeCategory, setActiveCategory] = useState("all")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] opacity-10 bg-cover bg-center"></div>
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-sm">
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              Community Discussions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join the Conversation</h1>
            <p className="text-lg text-gray-300 mb-6">
              Ask questions, share solutions, and connect with other developers in our community forums.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start a Discussion <PenSquare className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500/30 hover:bg-blue-500/10">
                Browse Topics
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
            placeholder="Search discussions..."
            className="pl-10 bg-card border-blue-500/20 focus:border-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full md:w-[200px] bg-card border-blue-500/20">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="help">Help & Support</SelectItem>
            <SelectItem value="solutions">Solutions</SelectItem>
            <SelectItem value="announcements">Announcements</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="border-blue-500/20 hover:bg-blue-500/10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-card/50 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80"
          >
            All Discussions
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80"
          >
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger
            value="unanswered"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80"
          >
            Unanswered
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {discussionData.map((discussion, index) => (
              <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {discussionData
              .filter((d) => d.isTrending)
              .map((discussion, index) => (
                <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
              ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {discussionData
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map((discussion, index) => (
                <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
              ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="unanswered" className="mt-6">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {discussionData
              .filter((d) => d.replies === 0)
              .map((discussion, index) => (
                <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
              ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Start a New Discussion */}
      <Card className="border border-blue-500/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-500/20">
          <CardTitle>Start a New Discussion</CardTitle>
          <CardDescription>Share your question, idea, or solution with the community</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="Enter a descriptive title" className="bg-card/50 border-blue-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger className="bg-card/50 border-blue-500/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Discussion</SelectItem>
                <SelectItem value="help">Help & Support</SelectItem>
                <SelectItem value="solutions">Solutions</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Describe your question or share your thoughts..."
              className="min-h-[200px] bg-card/50 border-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input placeholder="Add tags separated by commas" className="bg-card/50 border-blue-500/20" />
            <p className="text-xs text-muted">Example: python, web-scraping, api</p>
          </div>
        </CardContent>
        <CardFooter className="bg-card/50 border-t border-blue-500/20 flex justify-end gap-2">
          <Button variant="outline" className="border-blue-500/20">
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Post Discussion
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function DiscussionCard({ discussion, index }: { discussion: any; index: number }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: index * 0.1,
      },
    },
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "question":
        return <HelpCircle className="h-5 w-5 text-blue-400" />
      case "solution":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "announcement":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "idea":
        return <Lightbulb className="h-5 w-5 text-orange-400" />
      default:
        return <MessageSquare className="h-5 w-5 text-purple-400" />
    }
  }

  return (
    <motion.div variants={itemVariants} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl group-hover:blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
      <Card className="relative border border-blue-500/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/discuss/${discussion.id}`}>
                    <CardTitle className="text-xl group-hover:text-blue-400 transition-colors">
                      {discussion.title}
                    </CardTitle>
                  </Link>
                  {discussion.isTrending && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      <TrendingUp className="mr-1 h-3.5 w-3.5" /> Trending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                  <span>{discussion.author.name}</span>
                  <span>•</span>
                  <span>{discussion.timestamp}</span>
                  <span>•</span>
                  <Badge variant="outline" className="bg-card/50 border-blue-500/20 text-xs">
                    {getTypeIcon(discussion.type)}
                    <span className="ml-1">{discussion.type.charAt(0).toUpperCase() + discussion.type.slice(1)}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm line-clamp-3">{discussion.content}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {discussion.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-card/50 border-blue-500/20">
                <Tag className="mr-1 h-3 w-3" />
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
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              <span>{discussion.views}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Mock discussion data
const discussionData = [
  {
    id: "disc-1",
    title: "Efficient way to handle rate limiting in web scrapers",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm working on the Amazon Product Scraper challenge and I'm running into rate limiting issues. I've implemented a basic delay between requests, but Amazon still blocks me after about 20 requests. Has anyone found a more effective approach? I'm thinking about implementing exponential backoff and proxy rotation, but I'd love to hear what's worked for others before I dive in.",
    votes: 24,
    replies: 8,
    views: 342,
    timestamp: "2 hours ago",
    tags: ["web-scraping", "python", "rate-limiting"],
    type: "question",
    isTrending: true,
  },
  {
    id: "disc-2",
    title: "Solution: Implementing a robust CI/CD pipeline with GitHub Actions",
    author: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "After completing the GitHub Actions CI Pipeline challenge, I wanted to share my approach. I implemented a workflow that not only handles testing, building, and deployment but also includes security scanning, dependency caching, and automatic versioning. Here's how I structured it...",
    votes: 56,
    replies: 12,
    views: 789,
    timestamp: "1 day ago",
    tags: ["github-actions", "ci-cd", "devops"],
    type: "solution",
    isTrending: true,
  },
  {
    id: "disc-3",
    title: "How to handle CAPTCHA challenges in web scraping?",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm working on the advanced web scraping challenge and keep running into CAPTCHA issues. I've tried rotating user agents and proxies, but still get blocked. Are there any effective strategies for handling CAPTCHAs while still respecting the site's terms of service?",
    votes: 18,
    replies: 7,
    views: 256,
    timestamp: "3 days ago",
    tags: ["captcha", "web-scraping", "python"],
    type: "question",
    isTrending: false,
  },
  {
    id: "disc-4",
    title: "Announcement: New System Design Challenges Coming Next Week",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "We're excited to announce a new set of system design challenges launching next week! These challenges will focus on designing scalable architectures for real-world applications like e-commerce platforms, social networks, and content delivery systems. Get ready to practice your system design skills!",
    votes: 42,
    replies: 5,
    views: 512,
    timestamp: "2 days ago",
    tags: ["announcement", "system-design", "new-content"],
    type: "announcement",
    isTrending: true,
  },
  {
    id: "disc-5",
    title: "Idea: Adding collaborative coding sessions to challenges",
    author: {
      name: "David Park",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I think it would be great if we could have collaborative coding sessions for challenges. This would allow us to work together on solving problems, share knowledge, and learn from each other in real-time. What do you all think about this feature?",
    votes: 35,
    replies: 14,
    views: 320,
    timestamp: "4 days ago",
    tags: ["feature-request", "collaboration", "learning"],
    type: "idea",
    isTrending: false,
  },
  {
    id: "disc-6",
    title: "Help needed with dynamic form validation in React",
    author: {
      name: "Olivia Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm stuck on the Dynamic Form Builder challenge. I've implemented the basic form rendering based on the schema, but I'm having trouble with the conditional validation rules. How can I efficiently validate fields that depend on other field values?",
    votes: 8,
    replies: 3,
    views: 175,
    timestamp: "5 days ago",
    tags: ["react", "forms", "validation"],
    type: "question",
    isTrending: false,
  },
  {
    id: "disc-7",
    title: "Looking for feedback on my database optimization solution",
    author: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I just completed the Database Optimization challenge and would appreciate some feedback on my approach. I used indexing, query rewriting, and denormalization to improve performance. The query execution time went from 5s to 200ms, but I'm wondering if there are other techniques I should consider.",
    votes: 12,
    replies: 6,
    views: 230,
    timestamp: "1 week ago",
    tags: ["database", "optimization", "sql"],
    type: "question",
    isTrending: false,
  },
  {
    id: "disc-8",
    title: "No responses to my distributed computing question",
    author: {
      name: "Sophia Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I posted a question about implementing a distributed computing solution for the parallel processing challenge last week, but haven't received any responses. I'm specifically looking for advice on how to handle task distribution and result aggregation efficiently. Any help would be appreciated!",
    votes: 5,
    replies: 0,
    views: 120,
    timestamp: "1 week ago",
    tags: ["distributed-computing", "parallel-processing", "algorithms"],
    type: "question",
    isTrending: false,
  },
]
