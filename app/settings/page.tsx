"use client"

import { useEffect, useState } from "react"
import { Bell, Moon, Save, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface Settings {
  displayName: string
  email: string
  reduceMotion: boolean
  emailNotifications: boolean
}

const defaults: Settings = {
  displayName: "",
  email: "",
  reduceMotion: false,
  emailNotifications: true,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults)
  const { toast } = useToast()

  useEffect(() => {
    const stored = window.localStorage.getItem("codium:settings")
    if (stored) {
      try {
        setSettings({ ...defaults, ...(JSON.parse(stored) as Partial<Settings>) })
      } catch {
        window.localStorage.removeItem("codium:settings")
      }
    }
  }, [])

  const save = () => {
    window.localStorage.setItem("codium:settings", JSON.stringify(settings))
    document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion)
    toast({ title: "Settings saved", description: "Your browser-local preferences have been updated." })
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted">Preferences are saved locally until account storage is connected.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Profile</CardTitle><CardDescription>How your name appears in browser-local activity.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" value={settings.displayName} onChange={(event) => setSettings((value) => ({ ...value, displayName: event.target.value }))} /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={settings.email} onChange={(event) => setSettings((value) => ({ ...value, email: event.target.value }))} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SettingToggle id="notifications" title="Email notifications" description="Use this preference when the notifications service is connected." checked={settings.emailNotifications} onCheckedChange={(emailNotifications) => setSettings((value) => ({ ...value, emailNotifications }))} />
          <SettingToggle id="reduce-motion" title="Reduce motion" description="Minimizes interface animation in this browser." checked={settings.reduceMotion} onCheckedChange={(reduceMotion) => setSettings((value) => ({ ...value, reduceMotion }))} />
        </CardContent>
        <CardFooter className="justify-end"><Button onClick={save}><Save className="mr-2 h-4 w-4" />Save settings</Button></CardFooter>
      </Card>
      <p className="flex items-center gap-2 text-sm text-muted"><Sun className="h-4 w-4" /><Moon className="h-4 w-4" />Theme follows the application theme selector.</p>
    </main>
  )
}

function SettingToggle({ id, title, description, checked, onCheckedChange }: { id: string; title: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border p-4"><div><Label htmlFor={id}>{title}</Label><p className="text-sm text-muted">{description}</p></div><Switch id={id} checked={checked} onCheckedChange={onCheckedChange} /></div>
}
