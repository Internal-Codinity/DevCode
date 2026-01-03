"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Code,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Building,
  Tag,
  Clock,
  BarChart,
  CheckCircle,
  XCircle,
  Play,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import CodeEditor from "@/components/code-editor"
import { motion, AnimatePresence } from "framer-motion"
import { problemsData } from "@/data/problems"

export default function ProblemPage() {
  const params = useParams()
  const problemId = params.id as string
  const problem = problemsData.find((p) => p.id === problemId) || problemsData[0]

  const [activeTab, setActiveTab] = useState("description")
  const [testCases, setTestCases] = useState([
    { id: 1, input: "['B08N5KWB9H', 'B07QDYSSF5']", output: "2 products scraped successfully", status: "passed" },
    { id: 2, input: "['INVALID_ID']", output: "Error: Product not found", status: "failed" },
    {
      id: 3,
      input: "['B08N5KWB9H', 'B07QDYSSF5', 'B07JW9H4J1']",
      output: "3 products scraped successfully",
      status: "passed",
    },
  ])
  const [runningTest, setRunningTest] = useState(false)
  const [showCompanies, setShowCompanies] = useState(false)

  // Mock company data
  const companies = [
    { name: "Amazon", frequency: "High" },
    { name: "Google", frequency: "Medium" },
    { name: "Microsoft", frequency: "Medium" },
    { name: "Facebook", frequency: "Low" },
  ]

  const runTests = () => {
    setRunningTest(true)
    // Simulate test running
    setTimeout(() => {
      setRunningTest(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left panel: Problem description and discussions */}
      <div className="w-full lg:w-1/2 space-y-6">
        <Card className="border border-accent-purple/30">
          <CardHeader className="pb-3">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl">{problem.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  <Badge variant="outline" className="bg-card">
                    {problem.category}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted">
                <Clock className="h-4 w-4" />
                <span>~30 min</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted">
                <BarChart className="h-4 w-4" />
                <span>87.5% success rate</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm flex items-center gap-1"
                onClick={() => setShowCompanies(!showCompanies)}
              >
                <Building className="h-4 w-4" />
                <span>Companies</span>
                {showCompanies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>

            <AnimatePresence>
              {showCompanies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-3 bg-card/50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Companies that ask this problem:</h4>
                    <div className="flex flex-wrap gap-2">
                      {companies.map((company) => (
                        <Badge key={company.name} variant="outline" className="bg-card flex items-center gap-1">
                          {company.name}
                          <span
                            className={`text-xs ${
                              company.frequency === "High"
                                ? "text-red-400"
                                : company.frequency === "Medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            }`}
                          >
                            ({company.frequency})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 w-full">
                <TabsTrigger value="description" className="flex-1">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="solution" className="flex-1">
                  <Code className="mr-2 h-4 w-4" />
                  Solution
                </TabsTrigger>
                <TabsTrigger value="discussion" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 space-y-4">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Example:</h3>
                  <div className="bg-card/50 p-4 rounded-md font-mono text-sm">
                    <p className="mb-2">
                      <strong>Input:</strong> {`['B08N5KWB9H', 'B07QDYSSF5']`}
                    </p>
                    <p>
                      <strong>Output:</strong>
                    </p>
                    <pre className="whitespace-pre-wrap">
                      {`[
  {
    "product_id": "B08N5KWB9H",
    "title": "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones",
    "price": "$348.00",
    "rating": "4.7/5",
    "reviews_count": "34,251 reviews",
    "url": "https://www.amazon.com/dp/B08N5KWB9H"
  },
  {
    "product_id": "B07QDYSSF5",
    "title": "Apple AirPods Pro",
    "price": "$249.00",
    "rating": "4.8/5",
    "reviews_count": "87,125 reviews",
    "url": "https://www.amazon.com/dp/B07QDYSSF5"
  }
]`}
                    </pre>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted">
                    <li>You must implement rate limiting to avoid being blocked</li>
                    <li>Your scraper should handle errors gracefully</li>
                    <li>Respect Amazon's robots.txt and terms of service</li>
                    <li>The solution should be scalable to handle large numbers of products</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-card flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="mt-4">
                <div className="bg-card/50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Solution Approach</h3>
                  <p className="text-muted mb-4">
                    This problem requires implementing a web scraper with rate limiting and proxy rotation. Here's a
                    step-by-step approach:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 text-muted">
                    <li>Set up proper headers to mimic a real browser</li>
                    <li>Implement a proxy rotation mechanism to avoid IP-based blocking</li>
                    <li>Add rate limiting to space out requests</li>
                    <li>Use BeautifulSoup or Cheerio to parse the HTML response</li>
                    <li>Extract the required product information</li>
                    <li>Implement error handling and retries for failed requests</li>
                    <li>Save the results to a JSON file</li>
                  </ol>

                  <Separator className="my-4" />

                  <h3 className="text-lg font-medium mb-2">Time and Space Complexity</h3>
                  <p className="text-muted mb-2">
                    <strong>Time Complexity:</strong> O(n), where n is the number of products to scrape. Each product
                    requires a separate HTTP request.
                  </p>
                  <p className="text-muted mb-4">
                    <strong>Space Complexity:</strong> O(n), as we store information for each product.
                  </p>

                  <Button className="mt-2">View Full Solution</Button>
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Community Discussions</h3>
                    <Button>Start a Discussion</Button>
                  </div>

                  <Tabs defaultValue="all">
                    <TabsList className="bg-card/50">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="solutions">Solutions</TabsTrigger>
                      <TabsTrigger value="questions">Questions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex Johnson" />
                                <AvatarFallback>AJ</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Efficient way to handle rate limiting</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                                  <span>Alex Johnson</span>
                                  <span>•</span>
                                  <span>2 hours ago</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">
                            I'm running into rate limiting issues. I've implemented a basic delay between requests, but
                            Amazon still blocks me after about 20 requests. Has anyone found a more effective approach?
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              web-scraping
                            </Badge>
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              rate-limiting
                            </Badge>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0 pb-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>24</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>8</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Miller" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Solution: Implementing exponential backoff</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                                  <span>Sarah Miller</span>
                                  <span>•</span>
                                  <span>1 day ago</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">
                            I implemented an exponential backoff strategy that has been working well. Instead of a fixed
                            delay, I start with a small delay and double it after each request, with a random jitter
                            added. This mimics human behavior better.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              solution
                            </Badge>
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              web-scraping
                            </Badge>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0 pb-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>56</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>12</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="solutions" className="mt-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Miller" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Solution: Implementing exponential backoff</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                                  <span>Sarah Miller</span>
                                  <span>•</span>
                                  <span>1 day ago</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">
                            I implemented an exponential backoff strategy that has been working well. Instead of a fixed
                            delay, I start with a small delay and double it after each request, with a random jitter
                            added. This mimics human behavior better.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              solution
                            </Badge>
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              web-scraping
                            </Badge>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0 pb-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>56</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>12</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="questions" className="mt-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex Johnson" />
                                <AvatarFallback>AJ</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Efficient way to handle rate limiting</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                                  <span>Alex Johnson</span>
                                  <span>•</span>
                                  <span>2 hours ago</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">
                            I'm running into rate limiting issues. I've implemented a basic delay between requests, but
                            Amazon still blocks me after about 20 requests. Has anyone found a more effective approach?
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              web-scraping
                            </Badge>
                            <Badge variant="outline" className="bg-card/50">
                              <Tag className="mr-1 h-3 w-3" />
                              rate-limiting
                            </Badge>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0 pb-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>24</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>8</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right panel: Code editor and test cases */}
      <div className="w-full lg:w-1/2 space-y-6">
        <CodeEditor problem={problem} />

        <Card className="border border-accent-purple/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Test Cases</CardTitle>
            <CardDescription>Run your code against these test cases</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sample">
              <TabsList className="bg-card/50">
                <TabsTrigger value="sample">Sample</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="sample" className="mt-4 space-y-4">
                {testCases.map((test) => (
                  <div key={test.id} className="bg-card/50 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Test Case {test.id}</h4>
                      {test.status === "passed" ? (
                        <Badge className="bg-green-500/20 text-green-500">Passed</Badge>
                      ) : test.status === "failed" ? (
                        <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-500">Not Run</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted">Input:</p>
                        <pre className="bg-card p-2 rounded text-xs mt-1">{test.input}</pre>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Expected Output:</p>
                        <pre className="bg-card p-2 rounded text-xs mt-1">{test.output}</pre>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={runTests} disabled={runningTest}>
                    {runningTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run All Tests
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <div className="bg-card/50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Custom Test Case</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted mb-1">Input:</p>
                      <textarea
                        className="w-full h-24 bg-card p-2 rounded text-xs font-mono"
                        placeholder="Enter your test input here..."
                      ></textarea>
                    </div>
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Run Custom Test
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results" className="mt-4">
                {runningTest ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 text-accent-purple animate-spin mb-4" />
                    <p className="text-muted">Running tests...</p>
                  </div>
                ) : testCases.some((t) => t.status === "passed" || t.status === "failed") ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-card/50 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">
                            {testCases.filter((t) => t.status === "passed").length} Passed
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-medium">
                            {testCases.filter((t) => t.status === "failed").length} Failed
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    {testCases.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 rounded-md ${
                          test.status === "passed"
                            ? "bg-green-500/10 border border-green-500/30"
                            : test.status === "failed"
                              ? "bg-red-500/10 border border-red-500/30"
                              : "bg-card/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {test.status === "passed" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : test.status === "failed" ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            <h4 className="font-medium">Test Case {test.id}</h4>
                          </div>
                          <Badge
                            className={
                              test.status === "passed"
                                ? "bg-green-500/20 text-green-500"
                                : test.status === "failed"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                            }
                          >
                            {test.status === "passed" ? "Passed" : test.status === "failed" ? "Failed" : "Not Run"}
                          </Badge>
                        </div>
                        <div className="space-y-2 ml-7">
                          <div>
                            <p className="text-sm text-muted">Input:</p>
                            <pre className="bg-card p-2 rounded text-xs mt-1">{test.input}</pre>
                          </div>
                          <div>
                            <p className="text-sm text-muted">Expected Output:</p>
                            <pre className="bg-card p-2 rounded text-xs mt-1">{test.output}</pre>
                          </div>
                          {test.status === "failed" && (
                            <div>
                              <p className="text-sm text-red-400">Your Output:</p>
                              <pre className="bg-card p-2 rounded text-xs mt-1">Error: Product not found</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No test results yet</h3>
                    <p className="text-muted">Run your tests to see the results here</p>
                    <Button className="mt-4" onClick={runTests}>
                      <Play className="mr-2 h-4 w-4" />
                      Run Tests
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
    case "Medium":
      return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
    case "Hard":
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
    default:
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
  }
}
