"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, ArrowUpDown, Eye } from "lucide-react"
import type { Problem } from "@/types/problem"

interface ProblemSubmissionsProps {
  problem: Problem
}

export default function ProblemSubmissions({ problem }: ProblemSubmissionsProps) {
  const [activeTab, setActiveTab] = useState("all")

  // Mock submission data
  const submissions = [
    {
      id: "sub-1",
      status: "Accepted",
      language: "Python",
      runtime: "125 ms",
      memory: "16.2 MB",
      timestamp: "2 hours ago",
      code: `import requests
from bs4 import BeautifulSoup
import json
import time
import random

class AmazonScraper:
    def __init__(self, proxy_list=None):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        self.proxy_list = proxy_list or []
        self.results = []
    
    def get_proxy(self):
        if not self.proxy_list:
            return None
        return random.choice(self.proxy_list)
    
    def scrape_product(self, product_id):
        url = f"https://www.amazon.com/dp/{product_id}"
        proxy = self.get_proxy()
        proxies = {"http": proxy, "https": proxy} if proxy else None
        
        try:
            response = requests.get(url, headers=self.headers, proxies=proxies, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract product details
                title_element = soup.select_one('#productTitle')
                price_element = soup.select_one('.a-price .a-offscreen')
                rating_element = soup.select_one('#acrPopover')
                reviews_count_element = soup.select_one('#acrCustomerReviewText')
                
                title = title_element.get_text().strip() if title_element else "N/A"
                price = price_element.get_text().strip() if price_element else "N/A"
                rating = rating_element.get('title').strip() if rating_element and 'title' in rating_element.attrs else "N/A"
                reviews_count = reviews_count_element.get_text().strip() if reviews_count_element else "N/A"
                
                return {
                    "product_id": product_id,
                    "title": title,
                    "price": price,
                    "rating": rating,
                    "reviews_count": reviews_count,
                    "url": url
                }
            else:
                print(f"Failed to fetch product {product_id}: Status code {response.status_code}")
                return None
        except Exception as e:
            print(f"Error scraping product {product_id}: {str(e)}")
            return None
    
    def scrape_products(self, product_ids, rate_limit=2):
        for product_id in product_ids:
            print(f"Scraping product: {product_id}")
            product_data = self.scrape_product(product_id)
            if product_data:
                self.results.append(product_data)
                print(f"Extracted: \"{product_data['title']}\"")
                print(f"Price: {product_data['price']}")
                print(f"Rating: {product_data['rating']} ({product_data['reviews_count']})")
            
            # Apply rate limiting
            if rate_limit > 0 and product_id != product_ids[-1]:
                sleep_time = 1 / rate_limit
                print(f"Waiting {sleep_time} seconds before next request...")
                time.sleep(sleep_time)
        
        # Save results to JSON file
        with open('amazon_products.json', 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"Scraped {len(self.results)} products successfully")
        print(f"Data saved to 'amazon_products.json'")
        
        return self.results

# Example usage
if __name__ == "__main__":
    # Sample proxy list (replace with actual proxies if available)
    proxies = [
        "http://proxy1.example.com:8080",
        "http://proxy2.example.com:8080",
    ]
    
    # Sample product IDs to scrape
    product_ids = ["B08N5KWB9H", "B07QDYSSF5"]
    
    scraper = AmazonScraper(proxy_list=proxies)
    scraper.scrape_products(product_ids, rate_limit=0.5)  # 1 request per 2 seconds`,
    },
    {
      id: "sub-2",
      status: "Wrong Answer",
      language: "JavaScript",
      runtime: "145 ms",
      memory: "42.8 MB",
      timestamp: "1 day ago",
      code: `// Failed submission with bugs`,
    },
    {
      id: "sub-3",
      status: "Time Limit Exceeded",
      language: "Python",
      runtime: "N/A",
      memory: "18.1 MB",
      timestamp: "2 days ago",
      code: `# Inefficient implementation that timed out`,
    },
  ]

  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)

  const filteredSubmissions =
    activeTab === "all"
      ? submissions
      : activeTab === "accepted"
        ? submissions.filter((sub) => sub.status === "Accepted")
        : submissions.filter((sub) => sub.status !== "Accepted")

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card w-full">
          <TabsTrigger value="all" className="flex-1">
            All Submissions
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex-1">
            Accepted
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex-1">
            Failed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedSubmission ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)}>
              Back to Submissions
            </Button>
            <Badge className={getStatusColor(submissions.find((s) => s.id === selectedSubmission)?.status || "")}>
              {submissions.find((s) => s.id === selectedSubmission)?.status}
            </Badge>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted">Language</p>
                  <p className="font-medium">{submissions.find((s) => s.id === selectedSubmission)?.language}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Runtime</p>
                  <p className="font-medium">{submissions.find((s) => s.id === selectedSubmission)?.runtime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Memory</p>
                  <p className="font-medium">{submissions.find((s) => s.id === selectedSubmission)?.memory}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Submitted</p>
                  <p className="font-medium">{submissions.find((s) => s.id === selectedSubmission)?.timestamp}</p>
                </div>
              </div>

              <div className="font-mono text-sm bg-card/50 p-4 rounded-lg overflow-auto max-h-[400px]">
                <pre>
                  <code>{submissions.find((s) => s.id === selectedSubmission)?.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Your Submissions</CardTitle>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-1 h-4 w-4" />
                Sort by Date
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length > 0 ? (
              <div className="space-y-2">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-card/80 cursor-pointer"
                    onClick={() => setSelectedSubmission(submission.id)}
                  >
                    <div className="flex items-center gap-3">
                      {submission.status === "Accepted" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : submission.status === "Wrong Answer" ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                        <div className="flex gap-4 mt-1 text-sm text-muted">
                          <span>{submission.language}</span>
                          <span>{submission.runtime}</span>
                          <span>{submission.memory}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted">{submission.timestamp}</span>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">No submissions found in this category.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "Accepted":
      return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
    case "Wrong Answer":
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
    case "Time Limit Exceeded":
      return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
    default:
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
  }
}
