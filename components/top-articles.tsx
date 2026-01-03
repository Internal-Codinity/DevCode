import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Eye, ArrowUpRight } from "lucide-react"

// Sample data for top articles
const topArticles = [
  {
    id: 1,
    title: "How I Solved 500 LeetCode Problems in 6 Months",
    author: "CodeMaster",
    views: 12500,
    likes: 843,
    comments: 156,
    tags: ["Study Plan", "Experience"],
  },
  {
    id: 2,
    title: "5 Dynamic Programming Patterns You Must Know",
    author: "AlgoExpert",
    views: 9800,
    likes: 721,
    comments: 98,
    tags: ["DP", "Patterns"],
  },
  {
    id: 3,
    title: "System Design Interview: Step by Step Approach",
    author: "DesignGuru",
    views: 15200,
    likes: 1024,
    comments: 187,
    tags: ["System Design", "Interview"],
  },
  {
    id: 4,
    title: "From Bootcamp to FAANG: My Journey",
    author: "NewDev2023",
    views: 8700,
    likes: 612,
    comments: 143,
    tags: ["Career", "Experience"],
  },
]

export default function TopArticles() {
  return (
    <Card className="mb-6 border border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topArticles.map((article) => (
          <Link key={article.id} href={`/discuss/articles/${article.id}`} className="block">
            <div className="group space-y-1 pb-3 border-b border-border/30 last:border-0 last:pb-0">
              <h3 className="text-sm font-medium group-hover:text-primary transition-colors flex items-center">
                {article.title}
                <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>by {article.author}</span>
                <span className="mx-1">•</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{article.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{article.comments}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
        <div className="text-center">
          <Link href="/discuss" className="text-xs text-primary hover:underline inline-flex items-center">
            View All Discussions
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
