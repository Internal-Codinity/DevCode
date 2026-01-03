"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Calendar, Users, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WeeklyContestBanner() {
  const { toast } = useToast()

  const handleRegister = () => {
    toast({
      title: "Registration Successful",
      description: "You've registered for Weekly Contest #42",
    })
  }

  return (
    <Card className="overflow-hidden border border-accent-purple/30">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10" />
        <CardHeader className="pb-2 relative">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent-purple" />
                <CardTitle>Weekly Contest #42</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Solve real-world challenges focused on web scraping and data processing.
              </CardDescription>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 w-fit">Intermediate</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted" />
              <span>May 18, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted" />
              <span>8:00 PM UTC</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted" />
              <span>2 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted" />
              <span>1248 participants</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
              Web Scraping
            </Badge>
            <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
              Data Processing
            </Badge>
            <Badge variant="outline" className="bg-card/50 border-accent-purple/20">
              API Integration
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-2 relative">
          <Button
            className="w-full md:w-auto bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90"
            onClick={handleRegister}
          >
            Register Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
