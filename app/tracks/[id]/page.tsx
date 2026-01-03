"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Lock, Code, BookOpen, ArrowLeft, Trophy } from "lucide-react"
import { tracksData } from "@/data/tracks"
import { useToast } from "@/hooks/use-toast"

export default function TrackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const trackId = params.id as string

  // Find the track by ID, or use the first track as a fallback
  const track = tracksData.find((t) => t.id === trackId) || tracksData[0]

  const handleContinueTrack = () => {
    // Find the first incomplete level
    const firstIncompleteLevelIndex = track.levels.findIndex((level) => !level.isCompleted && !level.isLocked)

    if (firstIncompleteLevelIndex !== -1) {
      // In a real app, this would navigate to the first problem in that level
      toast({
        title: "Continuing Track",
        description: `Starting ${track.levels[firstIncompleteLevelIndex].title}`,
      })
    } else {
      toast({
        title: "No unlocked levels",
        description: "Complete previous levels to unlock more content",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tracks
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {track.icon}
          <h1 className="text-3xl font-bold">{track.title}</h1>
        </div>
        <p className="text-muted">{track.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border border-accent-purple/30">
          <CardHeader>
            <CardTitle>Track Progress</CardTitle>
            <CardDescription>
              {track.completedCount} of {track.problemCount} problems completed ({track.progress}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Progress value={track.progress} className="h-2 mb-6" />

            <div className="space-y-4">
              {track.levels.map((level) => (
                <div
                  key={level.level}
                  className={`p-4 rounded-md ${level.isLocked ? "bg-card/50 opacity-70" : "bg-card"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {level.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : level.isLocked ? (
                        <Lock className="h-5 w-5 text-muted" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-muted flex items-center justify-center text-sm">
                          {level.level}
                        </div>
                      )}
                      <h3 className="font-medium">{level.title}</h3>
                    </div>
                    <Badge
                      className={
                        level.isCompleted
                          ? "bg-green-500/20 text-green-500"
                          : level.isLocked
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-blue-500/20 text-blue-500"
                      }
                    >
                      {level.isCompleted ? "Completed" : level.isLocked ? "Locked" : "In Progress"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted mb-3">
                    {level.isLocked
                      ? "Complete previous levels to unlock this content"
                      : `${level.problemCount} problems to solve in this level`}
                  </p>

                  {!level.isLocked && (
                    <Button
                      size="sm"
                      variant={level.isCompleted ? "outline" : "default"}
                      className={level.isCompleted ? "" : "bg-accent-purple hover:bg-accent-purple/90"}
                      onClick={() => {
                        toast({
                          title: level.isCompleted ? "Review Level" : "Start Level",
                          description: level.title,
                        })
                      }}
                    >
                      {level.isCompleted ? "Review Level" : "Start Level"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90"
              onClick={handleContinueTrack}
            >
              {track.progress === 0 ? "Start Track" : track.progress === 100 ? "Review Track" : "Continue Track"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border border-accent-purple/30">
            <CardHeader>
              <CardTitle>Track Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted">Difficulty</span>
                  <Badge
                    className={
                      track.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-500"
                        : track.difficulty === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                    }
                  >
                    {track.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Estimated Time</span>
                  <span className="font-medium">{track.estimatedHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Problems</span>
                  <span className="font-medium">{track.problemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Levels</span>
                  <span className="font-medium">{track.levels.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-accent-purple/30">
            <CardHeader>
              <CardTitle>Skills You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {track.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-card">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-accent-purple/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Completion Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-card rounded-md">
                  <Badge className="bg-yellow-500/20 text-yellow-500">Badge</Badge>
                  <span>{track.title} Master</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-card rounded-md">
                  <Badge className="bg-green-500/20 text-green-500">XP</Badge>
                  <span>500 Experience Points</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-card rounded-md">
                  <Badge className="bg-blue-500/20 text-blue-500">Certificate</Badge>
                  <span>Completion Certificate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="curriculum">
            <Code className="mr-2 h-4 w-4" />
            Curriculum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Track</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p>
                The {track.title} track is designed to help you master essential skills in {track.tags.join(", ")}.
                Through a series of carefully crafted problems and challenges, you'll build practical experience that
                directly applies to real-world scenarios.
              </p>

              <h3>What You'll Learn</h3>
              <ul>
                <li>Fundamental concepts and best practices in {track.tags[0]}</li>
                <li>Advanced techniques for solving complex problems</li>
                <li>Industry-standard approaches used by top companies</li>
                <li>Performance optimization and scalability considerations</li>
              </ul>

              <h3>Who This Track Is For</h3>
              <p>
                This track is ideal for{" "}
                {track.difficulty === "Beginner"
                  ? "developers who are new to the field and want to build a solid foundation"
                  : track.difficulty === "Intermediate"
                    ? "developers with some experience who want to deepen their knowledge"
                    : "experienced developers looking to master advanced concepts"}
                .
              </p>

              <h3>Prerequisites</h3>
              <p>Before starting this track, you should have:</p>
              <ul>
                <li>Basic programming knowledge in at least one language</li>
                <li>
                  {track.difficulty === "Beginner"
                    ? "No prior experience with these technologies is required"
                    : track.difficulty === "Intermediate"
                      ? "Some familiarity with the core concepts"
                      : "Strong understanding of the fundamentals and some practical experience"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Curriculum</CardTitle>
              <CardDescription>A detailed breakdown of what you'll learn in each level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {track.levels.map((level) => (
                  <div key={level.level} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {level.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : level.isLocked ? (
                        <Lock className="h-5 w-5 text-muted" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-muted flex items-center justify-center text-sm">
                          {level.level}
                        </div>
                      )}
                      <h3 className="text-xl font-medium">{level.title}</h3>
                      <Badge
                        className={
                          level.isCompleted
                            ? "bg-green-500/20 text-green-500"
                            : level.isLocked
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-blue-500/20 text-blue-500"
                        }
                      >
                        {level.isCompleted ? "Completed" : level.isLocked ? "Locked" : "In Progress"}
                      </Badge>
                    </div>

                    <div className={level.isLocked ? "opacity-50" : ""}>
                      <p className="text-muted mb-4">
                        {level.level === 1
                          ? `Start your journey with the fundamentals of ${track.title}.`
                          : level.level === 2
                            ? `Build on your knowledge with intermediate concepts.`
                            : `Master advanced techniques and real-world applications.`}
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-medium">Problems in this level:</h4>
                        <div className="space-y-2">
                          {Array.from({ length: level.problemCount }).map((_, i) => (
                            <div key={i} className="p-3 bg-card rounded-md flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-accent-purple" />
                                <span>
                                  {level.title} Problem {i + 1}:{" "}
                                  {level.level === 1
                                    ? `Introduction to ${track.tags[i % track.tags.length]}`
                                    : level.level === 2
                                      ? `Advanced ${track.tags[i % track.tags.length]} Techniques`
                                      : `Mastering ${track.tags[i % track.tags.length]}`}
                                </span>
                              </div>
                              {level.isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Badge variant="outline" className="bg-card">
                                  {level.isLocked ? "Locked" : "To Do"}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
