 import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import TaskList from "@/components/task-list"
import ProgressCircle from "@/components/progress-circle"
import AddTaskButton from "@/components/add-task-button"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
        <div className="flex justify-center">
          <Suspense fallback={<div className="h-48 w-48 rounded-full bg-muted animate-pulse" />}>
            <ProgressCircle userId={userId} />
          </Suspense>
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href="/history">
              <CalendarDays className="h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <AddTaskButton />
          </div>

          <Suspense
            fallback={
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            }
          >
            <TaskList userId={userId} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

