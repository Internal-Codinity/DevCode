import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Copy, Edit } from "lucide-react"

export default function ProblemVariantsPage() {
  // Placeholder page for problem variants and levels
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Problem Variants</h1>
        <p className="text-muted">
          Each problem comes in multiple difficulty levels and variants to help you progress from beginner to expert.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Amazon Product Scraper</CardTitle>
              <CardDescription>
                Extract product information from Amazon with proper rate limiting and proxy rotation.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="mr-1 h-4 w-4" />
                Fork
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="mr-1 h-4 w-4" />
                Create Variant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="easy">
            <TabsList className="bg-card">
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
              <TabsTrigger value="custom">Custom Variants</TabsTrigger>
            </TabsList>
            <TabsContent value="easy" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">Basic Amazon Scraper</h3>
                      <p className="text-sm text-muted mt-1">
                        Build a simple scraper that extracts basic product information from Amazon product pages.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-green-500/20 text-green-500">Easy</Badge>
                        <Badge variant="outline" className="bg-card">
                          Python
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          Web Scraping
                        </Badge>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/problems/web-scraper-amazon-easy">
                        Solve <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="medium" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">Amazon Product Scraper with Rate Limiting</h3>
                      <p className="text-sm text-muted mt-1">
                        Build a web scraper that extracts product information from Amazon with proper rate limiting and
                        basic error handling.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-yellow-500/20 text-yellow-500">Medium</Badge>
                        <Badge variant="outline" className="bg-card">
                          Python
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          Web Scraping
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          Rate Limiting
                        </Badge>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/problems/web-scraper-amazon">
                        Solve <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hard" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">
                        Advanced Amazon Scraper with Proxy Rotation and CAPTCHA Handling
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        Build a sophisticated web scraper that extracts product information from Amazon with proxy
                        rotation, rate limiting, and CAPTCHA handling.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-red-500/20 text-red-500">Hard</Badge>
                        <Badge variant="outline" className="bg-card">
                          Python
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          Web Scraping
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          Proxy Rotation
                        </Badge>
                        <Badge variant="outline" className="bg-card">
                          CAPTCHA
                        </Badge>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/problems/web-scraper-amazon-hard">
                        Solve <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="custom" className="mt-4">
              <div className="text-center p-6">
                <p className="text-muted">No custom variants created yet.</p>
                <Button className="mt-4">
                  <Edit className="mr-1 h-4 w-4" />
                  Create Custom Variant
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* More problem variants would be listed here */}
    </div>
  )
}
