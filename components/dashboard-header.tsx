"use client"

import { UserButton } from "@clerk/nextjs"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b">
      <div className="container max-w-md mx-auto p-4 flex items-center justify-between">
        <h1 className="font-semibold">TaskTracker</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

