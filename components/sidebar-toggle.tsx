"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-7 w-7" aria-label="Toggle Sidebar">
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
