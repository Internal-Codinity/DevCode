"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Code, Database, GitBranch, Server, Terminal, Layout, Cpu, Cloud, Bot } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProblemCategoryList() {
  const { toast } = useToast()

  const handleCategoryClick = (category: (typeof categories)[number]) => {
    // In a real app, this would navigate to the category page
    // For now, we'll show a toast notification
    toast({
      title: "Category Selected",
      description: `Browsing problems in the ${category.name} category`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/problems/category/${category.id}`}
          onClick={(e) => {
            e.preventDefault()
            handleCategoryClick(category)
          }}
        >
          <Card className="card h-full hover:shadow-lg transition-all cursor-pointer border border-accent-purple/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                {category.icon}
                <CardTitle>{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{category.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
                  {category.problemCount} problems
                </Badge>
                {category.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-card/50 border-accent-purple/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

const categories = [
  {
    id: "web-scraping",
    name: "Web Scraping",
    description:
      "Build scrapers to extract data from websites with proper rate limiting, proxy rotation, and data processing.",
    icon: <Code className="h-5 w-5 text-accent-orange" />,
    problemCount: 24,
    tags: ["Python", "JavaScript", "Data Extraction"],
  },
  {
    id: "database",
    name: "Database Design",
    description: "Design and implement database schemas, write complex queries, and optimize database performance.",
    icon: <Database className="h-5 w-5 text-accent-purple" />,
    problemCount: 18,
    tags: ["SQL", "NoSQL", "Data Modeling"],
  },
  {
    id: "devops",
    name: "DevOps & CI/CD",
    description: "Create CI/CD pipelines, GitHub Actions workflows, and infrastructure as code solutions.",
    icon: <GitBranch className="h-5 w-5 text-accent-blue" />,
    problemCount: 15,
    tags: ["GitHub Actions", "Docker", "Terraform"],
  },
  {
    id: "backend",
    name: "Backend Services",
    description: "Build RESTful APIs, microservices, authentication systems, and background processing jobs.",
    icon: <Server className="h-5 w-5 text-accent-orange" />,
    problemCount: 32,
    tags: ["Node.js", "Python", "API Design"],
  },
  {
    id: "automation",
    name: "Automation Scripts",
    description: "Write scripts to automate repetitive tasks, data processing, and system administration.",
    icon: <Terminal className="h-5 w-5 text-accent-purple" />,
    problemCount: 27,
    tags: ["Python", "Bash", "PowerShell"],
  },
  {
    id: "frontend",
    name: "Frontend Challenges",
    description: "Create responsive UIs, implement complex interactions, and optimize frontend performance.",
    icon: <Layout className="h-5 w-5 text-accent-blue" />,
    problemCount: 29,
    tags: ["React", "CSS", "JavaScript"],
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Design scalable systems, optimize performance, and implement distributed architectures.",
    icon: <Cpu className="h-5 w-5 text-accent-orange" />,
    problemCount: 12,
    tags: ["Architecture", "Scalability", "Performance"],
  },
  {
    id: "cloud",
    name: "Cloud Services",
    description: "Implement solutions using AWS, Azure, or GCP services for various real-world scenarios.",
    icon: <Cloud className="h-5 w-5 text-accent-purple" />,
    problemCount: 21,
    tags: ["AWS", "Azure", "GCP"],
  },
  {
    id: "ai-ml",
    name: "AI & ML Integration",
    description: "Integrate AI/ML models into applications and build practical AI-powered features.",
    icon: <Bot className="h-5 w-5 text-accent-blue" />,
    problemCount: 14,
    tags: ["Python", "TensorFlow", "OpenAI"],
  },
]
