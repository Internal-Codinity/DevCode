"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Clock, TrendingUp, HelpCircle, Search, Filter } from "lucide-react"

interface CommunityDiscussionsProps {
  problemId: string
}

export function CommunityDiscussions({ problemId }: CommunityDiscussionsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock discussion data
  const discussions = [
    {
      id: 1,
      title: "Understanding the optimal approach",
      author: "coder123",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2 days ago",
      content:
        "I'm struggling to understand why the two-pointer approach is more efficient than using a hash map in this problem. Can someone explain?",
      likes: 24,
      replies: 8,
      tags: ["help", "algorithm"],
    },
    {
      id: 2,
      title: "O(n) solution with detailed explanation",
      author: "algomaster",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "1 week ago",
      content:
        "I've implemented an O(n) solution using a hash map to track previously seen values. Here's my detailed explanation with step-by-step walkthrough...",
      likes: 156,
      replies: 42,
      tags: ["solution", "optimized"],
    },
    {
      id: 3,
      title: "Edge case with duplicate values",
      author: "debugger",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "3 days ago",
      content:
        "Has anyone encountered issues with duplicate values in the input array? I'm getting incorrect results when there are duplicates.",
      likes: 18,
      replies: 15,
      tags: ["bug", "edge-case"],
    },
  ]

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="unanswered" className="flex-1">
            <HelpCircle className="h-4 w-4 mr-1" />
            Unanswered
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          <Card className="bg-card-hover border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-center text-lg">Start a New Discussion</CardTitle>
              <CardDescription className="text-center">
                Share your thoughts, ask questions, or post your solution
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-center">
              <Button>Create Post</Button>
            </CardFooter>
          </Card>

          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} />
                        <AvatarFallback>{discussion.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{discussion.title}</CardTitle>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{discussion.author}</span>
                          <span>•</span>
                          <span>{discussion.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm line-clamp-2">{discussion.content}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {discussion.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {discussion.replies}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View Discussion
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No discussions found matching your search.</p>
            </div>
          )}
        </TabsContent>

        {/* Other tab contents would be similar but with filtered data */}
        <TabsContent value="trending" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Trending discussions will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Recent discussions will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="unanswered" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Unanswered discussions will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
