"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Users, Video, VideoOff, Mic, MicOff, Share2, MessageSquare, Copy, X, Send, PhoneOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Collaborator {
  id: string
  name: string
  avatar: string
  role: "host" | "editor" | "viewer"
  status: "active" | "idle" | "offline"
  isTyping: boolean
  isSpeaking: boolean
  hasVideo: boolean
  hasMic: boolean
  cursorPosition?: { line: number; ch: number }
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: Date
}

export default function CollaborativeMode() {
  const [isSessionActive, setIsSessionActive] = useState(true)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "user-1",
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "host",
      status: "active",
      isTyping: false,
      isSpeaking: false,
      hasVideo: false,
      hasMic: true,
    },
    {
      id: "user-2",
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "editor",
      status: "active",
      isTyping: true,
      isSpeaking: false,
      hasVideo: true,
      hasMic: true,
    },
    {
      id: "user-3",
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "viewer",
      status: "idle",
      isTyping: false,
      isSpeaking: false,
      hasVideo: false,
      hasMic: false,
    },
  ])
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      senderId: "user-2",
      senderName: "John Doe",
      text: "I think we should add rate limiting to the scraper.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "msg-2",
      senderId: "user-1",
      senderName: "You",
      text: "Good idea. Let's implement that in the next section.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    },
    {
      id: "msg-3",
      senderId: "user-3",
      senderName: "Sarah Miller",
      text: "We should also consider adding proxy rotation to avoid IP bans.",
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"video" | "chat">("chat")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Simulate collaborator typing
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((collaborator) => {
          if (collaborator.id === "user-2") {
            return { ...collaborator, isTyping: !collaborator.isTyping }
          }
          return collaborator
        }),
      )
    }, 3000)

    return () => clearInterval(typingInterval)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "user-1",
        senderName: "You",
        text: newMessage,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, newMsg])
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://realworldcode.com/collaborate/abc123")
    toast({
      title: "Invite link copied",
      description: "The collaboration link has been copied to your clipboard.",
    })
  }

  const handleEndSession = () => {
    if (
      window.confirm("Are you sure you want to end this collaborative session? All participants will be disconnected.")
    ) {
      setIsSessionActive(false)
      toast({
        title: "Session ended",
        description: "The collaborative session has been ended.",
      })
    }
  }

  const handleToggleVideo = () => {
    setVideoEnabled((prev) => !prev)
    setCollaborators((prev) =>
      prev.map((collaborator) => {
        if (collaborator.id === "user-1") {
          return { ...collaborator, hasVideo: !collaborator.hasVideo }
        }
        return collaborator
      }),
    )
  }

  const handleToggleMic = () => {
    setMicEnabled((prev) => !prev)
    setCollaborators((prev) =>
      prev.map((collaborator) => {
        if (collaborator.id === "user-1") {
          return { ...collaborator, hasMic: !collaborator.hasMic }
        }
        return collaborator
      }),
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isSessionActive) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Collaborative Session</CardTitle>
          <CardDescription>Start a new collaborative session to work with others</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-16 w-16 text-muted mb-4" />
          <h3 className="text-xl font-medium mb-2">No Active Session</h3>
          <p className="text-muted text-center mb-6">
            Start a new collaborative session to work with others in real-time
          </p>
          <Button onClick={() => setIsSessionActive(true)}>Start New Session</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Collaborative Session</CardTitle>
            <CardDescription>Work together in real-time on this problem</CardDescription>
          </div>
          <Badge className="bg-green-500/20 text-green-500">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className={`flex items-center gap-2 p-2 ${collaborator.status === "idle" ? "bg-card/50" : "bg-card"} rounded-md`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {collaborator.status === "active" && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                  {collaborator.status === "idle" && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-yellow-500"></span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium">{collaborator.name}</p>
                    {collaborator.role === "host" && (
                      <Badge variant="outline" className="text-xs">
                        Host
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    {collaborator.isTyping ? (
                      <span className="text-accent-blue">Typing...</span>
                    ) : (
                      <span>{collaborator.role === "editor" ? "Editing" : "Viewing"}</span>
                    )}
                    {collaborator.hasVideo && <Video className="h-3 w-3 ml-1" />}
                    {collaborator.hasMic && <Mic className="h-3 w-3 ml-1" />}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsInviteModalOpen(true)}>
              <Users className="h-4 w-4" />
              <span>Invite</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "video" | "chat")}>
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="video" className="flex-1">
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="video" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborators
                .filter((c) => c.hasVideo || c.id === "user-1")
                .map((collaborator) => (
                  <div key={collaborator.id} className="relative rounded-md overflow-hidden bg-black aspect-video">
                    {collaborator.hasVideo ? (
                      <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                        <img
                          src={collaborator.avatar.replace("32", "128") || "/placeholder.svg"}
                          alt={collaborator.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                      {collaborator.name} {collaborator.isSpeaking && "(Speaking)"}
                    </div>
                    {collaborator.id === "user-1" && !collaborator.hasVideo && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                        <VideoOff className="h-8 w-8 mx-auto mb-2 opacity-60" />
                        <p className="text-sm opacity-80">Your camera is off</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant={videoEnabled ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={handleToggleVideo}
              >
                {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                <span>{videoEnabled ? "Camera On" : "Camera Off"}</span>
              </Button>
              <Button
                variant={micEnabled ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={handleToggleMic}
              >
                {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                <span>{micEnabled ? "Mic On" : "Mic Off"}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share Screen</span>
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <PhoneOff className="h-4 w-4" />
                <span>Leave Call</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="p-0">
            <div ref={chatContainerRef} className="h-[300px] overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "user-1" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === "user-1" ? "bg-accent-blue/20 text-foreground" : "bg-card text-foreground"
                    }`}
                  >
                    {message.senderId !== "user-1" && <p className="text-xs font-medium mb-1">{message.senderName}</p>}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-muted mt-1 text-right">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
              {collaborators.some((c) => c.isTyping && c.id !== "user-1") && (
                <div className="flex justify-start">
                  <div className="bg-card rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-muted rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-muted rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-muted rounded-full animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[60px]"
                />
                <Button className="self-end" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Session Link</p>
            <Button variant="ghost" size="sm" onClick={handleCopyInviteLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Input value="https://realworldcode.com/collaborate/abc123" readOnly className="text-sm" />
            <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted mt-2">Share this link to invite others to this session</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={handleEndSession}>
          End Collaborative Session
        </Button>
      </CardFooter>

      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invite Collaborators</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Invite others to join this collaborative session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Invite by Email</label>
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="email@example.com" />
                    <Button>Send</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Or share this link</label>
                  <div className="flex gap-2 mt-1">
                    <Input value="https://realworldcode.com/collaborate/abc123" readOnly />
                    <Button variant="outline" onClick={handleCopyInviteLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center justify-between p-2 bg-card rounded-md">
                      <span className="text-sm">Can edit code</span>
                      <Badge>Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-card rounded-md">
                      <span className="text-sm">Can use voice/video</span>
                      <Badge>Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-card rounded-md">
                      <span className="text-sm">Can invite others</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Invitations sent",
                    description: "Collaborators will receive an email with the session link.",
                  })
                  setIsInviteModalOpen(false)
                }}
              >
                Send Invitations
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  )
}
