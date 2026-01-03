import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Lock, Code, GitBranch, Server } from "lucide-react"
import Link from "next/link"

export default function ProjectChainsPage() {
  // Placeholder page for problem chains and project tracks
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Project Chains</h1>
        <p className="text-muted">
          Complete multi-step projects that build on each other to create complete solutions for real-world scenarios.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectChainCard
              title="CI/CD Pipeline Project"
              description="Build a complete CI/CD pipeline for a web application, from GitHub Actions to deployment."
              steps={[
                { title: "Create GitHub Actions Workflow", isCompleted: false, isLocked: false },
                { title: "Containerize with Docker", isCompleted: false, isLocked: true },
                { title: "Deploy to Kubernetes", isCompleted: false, isLocked: true },
                { title: "Set Up Monitoring", isCompleted: false, isLocked: true },
              ]}
              progress={0}
              difficulty="Advanced"
              estimatedHours={8}
              tags={["DevOps", "CI/CD", "Docker", "Kubernetes"]}
              icon={<GitBranch className="h-5 w-5 text-accent-blue" />}
            />

            <ProjectChainCard
              title="Web Scraping Pipeline"
              description="Build a complete web scraping pipeline that collects, processes, and visualizes data."
              steps={[
                { title: "Build Basic Scraper", isCompleted: true, isLocked: false },
                { title: "Add Rate Limiting & Proxies", isCompleted: true, isLocked: false },
                { title: "Implement Data Processing", isCompleted: false, isLocked: false },
                { title: "Create Visualization Dashboard", isCompleted: false, isLocked: true },
              ]}
              progress={50}
              difficulty="Intermediate"
              estimatedHours={6}
              tags={["Web Scraping", "Data Processing", "Visualization"]}
              icon={<Code className="h-5 w-5 text-accent-orange" />}
            />

            <ProjectChainCard
              title="Microservices Architecture"
              description="Design and implement a microservices architecture for a scalable application."
              steps={[
                { title: "Design Service Architecture", isCompleted: false, isLocked: false },
                { title: "Implement API Gateway", isCompleted: false, isLocked: true },
                { title: "Create Microservices", isCompleted: false, isLocked: true },
                { title: "Set Up Service Discovery", isCompleted: false, isLocked: true },
                { title: "Implement Message Queue", isCompleted: false, isLocked: true },
              ]}
              progress={0}
              difficulty="Advanced"
              estimatedHours={10}
              tags={["Microservices", "API Design", "System Architecture"]}
              icon={<Server className="h-5 w-5 text-accent-purple" />}
            />

            <ProjectChainCard
              title="Full-Stack Web Application"
              description="Build a complete web application with authentication, database, and frontend."
              steps={[
                { title: "Design Database Schema", isCompleted: true, isLocked: false },
                { title: "Implement Backend API", isCompleted: true, isLocked: false },
                { title: "Create Authentication System", isCompleted: true, isLocked: false },
                { title: "Build Frontend UI", isCompleted: false, isLocked: false },
                { title: "Deploy Application", isCompleted: false, isLocked: true },
              ]}
              progress={60}
              difficulty="Intermediate"
              estimatedHours={12}
              tags={["Full Stack", "Web Development", "Authentication"]}
              icon={<Code className="h-5 w-5 text-accent-blue" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectChainCard
              title="Web Scraping Pipeline"
              description="Build a complete web scraping pipeline that collects, processes, and visualizes data."
              steps={[
                { title: "Build Basic Scraper", isCompleted: true, isLocked: false },
                { title: "Add Rate Limiting & Proxies", isCompleted: true, isLocked: false },
                { title: "Implement Data Processing", isCompleted: false, isLocked: false },
                { title: "Create Visualization Dashboard", isCompleted: false, isLocked: true },
              ]}
              progress={50}
              difficulty="Intermediate"
              estimatedHours={6}
              tags={["Web Scraping", "Data Processing", "Visualization"]}
              icon={<Code className="h-5 w-5 text-accent-orange" />}
            />

            <ProjectChainCard
              title="Full-Stack Web Application"
              description="Build a complete web application with authentication, database, and frontend."
              steps={[
                { title: "Design Database Schema", isCompleted: true, isLocked: false },
                { title: "Implement Backend API", isCompleted: true, isLocked: false },
                { title: "Create Authentication System", isCompleted: true, isLocked: false },
                { title: "Build Frontend UI", isCompleted: false, isLocked: false },
                { title: "Deploy Application", isCompleted: false, isLocked: true },
              ]}
              progress={60}
              difficulty="Intermediate"
              estimatedHours={12}
              tags={["Full Stack", "Web Development", "Authentication"]}
              icon={<Code className="h-5 w-5 text-accent-blue" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="text-center p-8">
            <p className="text-muted">You haven't completed any project chains yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/tracks/project-chains">Browse Projects</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProjectStep {
  title: string
  isCompleted: boolean
  isLocked: boolean
}

function ProjectChainCard({
  title,
  description,
  steps,
  progress,
  difficulty,
  estimatedHours,
  tags,
  icon,
}: {
  title: string
  description: string
  steps: ProjectStep[]
  progress: number
  difficulty: string
  estimatedHours: number
  tags: string[]
  icon: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <Badge
            className={
              difficulty === "Beginner"
                ? "bg-green-500/20 text-green-500"
                : difficulty === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-red-500/20 text-red-500"
            }
          >
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted">Project Steps:</p>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    step.isLocked ? "bg-card/50 opacity-70" : "bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {step.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : step.isLocked ? (
                      <Lock className="h-4 w-4 text-muted" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                    )}
                    <span className={step.isLocked ? "text-muted" : ""}>{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted">Estimated time:</span>
              <span>{estimatedHours} hours</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-card">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full" asChild>
          <Link href={`/tracks/project-chains/${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {progress === 0 ? "Start Project" : progress === 100 ? "Review Project" : "Continue Project"}{" "}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
