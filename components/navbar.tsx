"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Menu,
  X,
  Code,
  Trophy,
  BookOpen,
  User,
  LogOut,
  Settings,
  Bell,
  Users,
  Calendar,
  BarChart,
  Clock,
  FileCode,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Mock authenticated user
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    image: "/placeholder.svg?height=40&width=40",
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { name: "Problems", href: "/problems" },
    { name: "Tracks", href: "/tracks" },
    { name: "Challenges", href: "/challenges/time-boxed" },
    { name: "Hackathons", href: "/hackathons" },
    { name: "Discuss", href: "/discuss" },
    { name: "Leaderboard", href: "/leaderboard" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Code className="h-8 w-8 text-accent-orange" />
            <span className="text-xl font-bold">RealWorldCode</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  isActive(link.href) ? "text-foreground" : "text-foreground/60",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input
              type="search"
              placeholder="Search problems..."
              className="w-full bg-card pl-9 focus:ring-1 focus:ring-accent-purple"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent-orange text-white">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem
                  title="Weekly Contest Starting Soon"
                  description="The weekly contest starts in 2 hours. Don't forget to register!"
                  time="2 hours ago"
                  icon={<Trophy className="h-4 w-4 text-accent-purple" />}
                />
                <NotificationItem
                  title="New Problem Added"
                  description="A new problem 'Automated Email Service' has been added to the Backend category."
                  time="1 day ago"
                  icon={<Code className="h-4 w-4 text-accent-orange" />}
                />
                <NotificationItem
                  title="Your Solution Was Featured"
                  description="Your solution to 'GitHub Actions CI Pipeline' was featured in the community highlights."
                  time="2 days ago"
                  icon={<BookOpen className="h-4 w-4 text-accent-blue" />}
                />
                <NotificationItem
                  title="New Hackathon Announced"
                  description="Data Visualization Hackathon is coming up on June 15-17. Register now!"
                  time="3 days ago"
                  icon={<Calendar className="h-4 w-4 text-accent-orange" />}
                />
                <NotificationItem
                  title="Collaborative Session Invitation"
                  description="Alex Johnson invited you to collaborate on 'Amazon Product Scraper'."
                  time="4 days ago"
                  icon={<Users className="h-4 w-4 text-accent-blue" />}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart className="mr-2 h-4 w-4" />
                <span>My Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCode className="mr-2 h-4 w-4" />
                <span>My Solutions</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                <span>History</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
              <Input type="search" placeholder="Search problems..." className="w-full bg-card pl-9" />
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80 p-2 rounded-md",
                    isActive(link.href) ? "bg-card text-foreground" : "text-foreground/60",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-4 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-3 p-3 hover:bg-card rounded-md cursor-pointer">
      <div className="mt-0.5">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted">{description}</p>
        <p className="text-xs text-muted">{time}</p>
      </div>
    </div>
  )
}
