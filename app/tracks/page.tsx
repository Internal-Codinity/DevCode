import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Code, Award, ArrowRight, Lock, CheckCircle, Clock } from "lucide-react"
import { tracksData } from "@/data/tracks"

export default function TracksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Learning Tracks</h1>
        <p className="text-muted">
          Follow structured learning paths to master real-world programming skills across different domains.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="all">All Tracks</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracksData.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracksData
              .filter((track) => track.progress > 0 && track.progress < 100)
              .map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracksData
              .filter((track) => track.progress === 100)
              .map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TrackCardProps {
  track: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    problemCount: number
    completedCount: number
    progress: number
    difficulty: string
    estimatedHours: number
    tags: string[]
    levels: {
      level: number
      title: string
      problemCount: number
      isLocked: boolean
      isCompleted: boolean
    }[]
  }
}

function TrackCard({ track }: TrackCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {track.icon}
            <div>
              <CardTitle>{track.title}</CardTitle>
              <CardDescription className="mt-1">{track.description}</CardDescription>
            </div>
          </div>
          <Badge className={getDifficultyColor(track.difficulty)}>{track.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Progress</span>
              <span className="font-medium">{track.progress}%</span>
            </div>
            <Progress value={track.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <Code className="h-4 w-4 text-muted" />
              <span>
                {track.completedCount}/{track.problemCount} problems
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted" />
              <span>~{track.estimatedHours} hours</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted">Track Levels:</p>
            <div className="space-y-2">
              {track.levels.map((level) => (
                <div
                  key={level.level}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    level.isLocked ? "bg-card/50 opacity-70" : "bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {level.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : level.isLocked ? (
                      <Lock className="h-4 w-4 text-muted" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted flex items-center justify-center text-xs">
                        {level.level}
                      </div>
                    )}
                    <span className={level.isLocked ? "text-muted" : ""}>
                      {level.title} ({level.problemCount})
                    </span>
                  </div>
                  {level.isCompleted && <Award className="h-4 w-4 text-accent-orange" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {track.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-card">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/tracks/${track.id}`} className="w-full">
          <Button className="w-full">
            {track.progress === 0 ? "Start Track" : track.progress === 100 ? "Review Track" : "Continue Track"}{" "}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
    case "Intermediate":
      return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
    case "Advanced":
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
    default:
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
  }
}
