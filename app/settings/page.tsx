"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Shield,
  CreditCard,
  HelpCircle,
  Upload,
  Github,
  Twitter,
  Linkedin,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(70)
  const [colorTheme, setColorTheme] = useState("system")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="w-full md:w-[250px] shrink-0"
        >
          <TabsList className="flex flex-row md:flex-col h-auto p-0 bg-transparent gap-1">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Lock className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="help"
              className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1">
          <TabsContent value="profile" className="settings-tab-content">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information and public details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 border-2 border-purple-500/30">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-500/10">
                          <Upload className="mr-2 h-4 w-4" />
                          Change Avatar
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Jane Doe" className="bg-card/50 border-purple-500/20" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="janedoe" className="bg-card/50 border-purple-500/20" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue="jane@example.com"
                            className="bg-card/50 border-purple-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            defaultValue="Passionate about solving real-world problems with code. Specializing in backend systems, automation, and DevOps."
                            className="min-h-[100px] bg-card/50 border-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            defaultValue="Senior Software Engineer"
                            className="bg-card/50 border-purple-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" defaultValue="TechCorp" className="bg-card/50 border-purple-500/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          defaultValue="San Francisco, CA"
                          className="bg-card/50 border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website" className="flex items-center gap-1">
                            <Globe className="h-4 w-4" /> Website
                          </Label>
                          <Input
                            id="website"
                            defaultValue="https://janedoe.dev"
                            className="bg-card/50 border-purple-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github" className="flex items-center gap-1">
                            <Github className="h-4 w-4" /> GitHub
                          </Label>
                          <Input id="github" defaultValue="janedoe" className="bg-card/50 border-purple-500/20" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="flex items-center gap-1">
                            <Twitter className="h-4 w-4" /> Twitter
                          </Label>
                          <Input id="twitter" defaultValue="janedoe" className="bg-card/50 border-purple-500/20" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="flex items-center gap-1">
                            <Linkedin className="h-4 w-4" /> LinkedIn
                          </Label>
                          <Input id="linkedin" defaultValue="jane-doe" className="bg-card/50 border-purple-500/20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="account" className="settings-tab-content">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              className="bg-card/50 border-purple-500/20 pr-10"
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showPassword ? "text" : "password"}
                              className="bg-card/50 border-purple-500/20 pr-10"
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showPassword ? "text" : "password"}
                              className="bg-card/50 border-purple-500/20 pr-10"
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Password Strength</Label>
                            <span className="text-sm text-muted">Strong</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                passwordStrength > 80
                                  ? "bg-green-500"
                                  : passwordStrength > 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted">
                            Use at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Authenticator App</div>
                          <div className="text-sm text-muted">Use an authenticator app to generate one-time codes.</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">SMS Authentication</div>
                          <div className="text-sm text-muted">Use your phone number to receive verification codes.</div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Login Sessions</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-card rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-muted">San Francisco, CA, USA • Chrome on macOS</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500">Active Now</Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-card rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Mobile App</p>
                              <p className="text-sm text-muted">San Francisco, CA, USA • iOS App</p>
                            </div>
                            <Badge className="bg-gray-500/20 text-gray-400">3 days ago</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-500/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out All Other Sessions
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-500/20 rounded-md bg-red-500/5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-red-400">Delete Account</h4>
                          <p className="text-sm text-muted">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="settings-tab-content">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">New Challenges</div>
                            <div className="text-sm text-muted">Receive notifications about new challenges.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Contest Reminders</div>
                            <div className="text-sm text-muted">Get reminders about upcoming contests.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Solution Comments</div>
                            <div className="text-sm text-muted">
                              Receive notifications when someone comments on your solutions.
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Achievement Unlocked</div>
                            <div className="text-sm text-muted">Get notified when you earn badges or achievements.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Newsletter</div>
                            <div className="text-sm text-muted">
                              Receive our monthly newsletter with tips and updates.
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">In-App Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">New Challenges</div>
                            <div className="text-sm text-muted">Show notifications for new challenges.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Contest Reminders</div>
                            <div className="text-sm text-muted">Show reminders for upcoming contests.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Solution Comments</div>
                            <div className="text-sm text-muted">
                              Show notifications when someone comments on your solutions.
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Achievement Unlocked</div>
                            <div className="text-sm text-muted">Show notifications for badges or achievements.</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Frequency</h3>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Email Digest Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="frequency" className="bg-card/50 border-purple-500/20">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance" className="settings-tab-content">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize the look and feel of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`p-4 rounded-md border-2 ${
                            colorTheme === "dark"
                              ? "border-purple-500 bg-card"
                              : "border-border bg-card/50 hover:border-purple-500/50"
                          } cursor-pointer transition-all`}
                          onClick={() => setColorTheme("dark")}
                        >
                          <div\
