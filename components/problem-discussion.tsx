"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, Flag, MoreHorizontal } from "lucide-react"
import type { Problem } from "@/types/problem"

interface ProblemDiscussionProps {
  problem: Problem
}

export default function ProblemDiscussion({ problem }: ProblemDiscussionProps) {
  const [activeTab, setActiveTab] = useState("discussions")
  const [comment, setComment] = useState("")

  // Mock discussion data
  const discussions = [
    {
      id: "disc-1",
      title: "Efficient way to handle rate limiting",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 1250,
      },
      content:
        "I found that using the `time.sleep()` approach for rate limiting works, but it's not very efficient for large-scale scraping. Has anyone tried using async/await with aiohttp to improve throughput while still respecting rate limits?",
      votes: 24,
      replies: 8,
      timestamp: "1 day ago",
      tags: ["optimization", "python"],
    },
    {
      id: "disc-2",
      title: "How to handle CAPTCHA challenges?",
      author: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 3420,
      },
      content:
        "Amazon sometimes throws CAPTCHA challenges when it detects scraping. I've tried rotating user agents and proxies, but still get blocked occasionally. Any suggestions on how to handle this more effectively?",
      votes: 32,
      replies: 12,
      timestamp: "3 days ago",
      tags: ["captcha", "anti-scraping"],
    },
    {
      id: "disc-3",
      title: "Alternative approach using Selenium",
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 875,
      },
      content:
        "I implemented this using Selenium with headless Chrome instead of requests/BeautifulSoup. It's a bit slower but handles JavaScript-rendered content better and is less likely to be detected as a bot. Here's my approach...",
      votes: 18,
      replies: 5,
      timestamp: "1 week ago",
      tags: ["selenium", "alternative"],
    },
  ]

  const solutions = [
    {
      id: "sol-1",
      author: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 4250,
      },
      language: "Python",
      content: `I approached this problem by using a combination of requests, BeautifulSoup, and a proxy rotation system. The key insights were:

1. **Proper rate limiting**: Instead of a fixed delay, I implemented an exponential backoff strategy that adjusts based on response times.

2. **Smart proxy rotation**: I created a proxy manager class that tracks proxy performance and automatically removes failing proxies.

3. **Robust error handling**: Each request is wrapped in a retry mechanism that can handle various types of failures.

Here's the core of my implementation:

\`\`\`python
class SmartProxyManager:
    def __init__(self, proxies):
        self.proxies = {proxy: {"success": 0, "failure": 0} for proxy in proxies}
    
    def get_best_proxy(self):
        # Calculate success rate and return the best performing proxy
        proxy_scores = {}
        for proxy, stats in self.proxies.items():
            total = stats["success"] + stats["failure"]
            if total == 0:
                proxy_scores[proxy] = 0
            else:
                proxy_scores[proxy] = stats["success"] / total
        
        return max(proxy_scores.items(), key=lambda x: x[1])[0]
    
    def report_success(self, proxy):
        if proxy in self.proxies:
            self.proxies[proxy]["success"] += 1
    
    def report_failure(self, proxy):
        if proxy in self.proxies:
            self.proxies[proxy]["failure"] += 1

class AmazonScraper:
    def __init__(self, proxy_list=None):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        self.proxy_manager = SmartProxyManager(proxy_list or [])
        self.results = []
        self.base_delay = 2  # Base delay in seconds
    
    def scrape_product(self, product_id, max_retries=3):
        url = f"https://www.amazon.com/dp/{product_id}"
        retry_count = 0
        current_delay = self.base_delay
        
        while retry_count < max_retries:
            proxy = self.proxy_manager.get_best_proxy()
            proxies = {"http": proxy, "https": proxy} if proxy else None
            
            try:
                response = requests.get(url, headers=self.headers, proxies=proxies, timeout=10)
                
                if response.status_code == 200:
                    self.proxy_manager.report_success(proxy)
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Extract product details
                    # ... (extraction code)
                    
                    return product_data
                elif response.status_code == 503 or response.status_code == 429:
                    # Rate limited or blocked
                    self.proxy_manager.report_failure(proxy)
                    retry_count += 1
                    current_delay *= 2  # Exponential backoff
                    time.sleep(current_delay)
                else:
                    self.proxy_manager.report_failure(proxy)
                    retry_count += 1
                    time.sleep(current_delay)
            except Exception as e:
                self.proxy_manager.report_failure(proxy)
                retry_count += 1
                time.sleep(current_delay)
        
        return None  # Failed after max retries
\`\`\`

This approach successfully scraped 1000+ products with a 98.5% success rate while maintaining a respectful crawl rate.`,
      votes: 156,
      timestamp: "2 weeks ago",
    },
    {
      id: "sol-2",
      author: {
        name: "David Park",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 2180,
      },
      language: "JavaScript",
      content: "I implemented this using Node.js with Puppeteer for a more browser-like experience...",
      votes: 89,
      timestamp: "3 weeks ago",
    },
  ]

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // In a real app, this would submit the comment to the backend
      setComment("")
      // For this demo, we're not actually adding the comment to the discussions array
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card w-full">
          <TabsTrigger value="discussions" className="flex-1">
            Discussions
          </TabsTrigger>
          <TabsTrigger value="solutions" className="flex-1">
            Solutions
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {activeTab === "discussions" ? "Problem Discussions" : "Community Solutions"}
            </CardTitle>
            <Button variant="default" size="sm">
              {activeTab === "discussions" ? "New Discussion" : "Share Solution"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="discussions" className="mt-0 space-y-4">
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
          </TabsContent>

          <TabsContent value="solutions" className="mt-0 space-y-4">
            {solutions.map((solution) => (
              <Card key={solution.id} className="bg-card/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={solution.author.avatar || "/placeholder.svg"} alt={solution.author.name} />
                        <AvatarFallback>{solution.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{solution.author.name}</span>
                          <Badge variant="outline" className="text-xs bg-card">
                            {solution.author.reputation} rep
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Badge className="bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30">
                            {solution.language}
                          </Badge>
                          <span>{solution.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="prose prose-invert max-w-none text-sm">
                    <div dangerouslySetInnerHTML={{ __html: solution.content.replace(/\n/g, "<br>") }} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{solution.votes}</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
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
    </div>
  )
}
