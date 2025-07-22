"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function SidebarDemo() {
  const { state, open, setOpen, isMobile, toggleSidebar } = useSidebar()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Controls</CardTitle>
        <CardDescription>Test the sidebar functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Current State:</span>
          <Badge variant={state === "expanded" ? "default" : "secondary"}>{state}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Is Open:</span>
          <Badge variant={open ? "default" : "secondary"}>{open ? "Yes" : "No"}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Is Mobile:</span>
          <Badge variant={isMobile ? "default" : "secondary"}>{isMobile ? "Yes" : "No"}</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={toggleSidebar} size="sm">
            Toggle Sidebar
          </Button>
          <Button onClick={() => setOpen(true)} variant="outline" size="sm">
            Open
          </Button>
          <Button onClick={() => setOpen(false)} variant="outline" size="sm">
            Close
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>• Use Ctrl/Cmd + B to toggle sidebar</p>
          <p>• Click the hamburger menu in the header</p>
          <p>• On mobile, sidebar becomes a drawer</p>
        </div>
      </CardContent>
    </Card>
  )
}
