 import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { format, parseISO } from "date-fns"
import DashboardHeader from "@/components/dashboard-header"
import TaskList from "@/components/task-list"
import ProgressCircle from "@/components/progress-circle"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"

interface HistoryDatePageProps {
  params: {
    date: string // Format: yyyy-MM-dd
  }
}

export default async function HistoryDatePage({ params }: HistoryDatePageProps) {
  const { userId } =await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Parse the date from the URL
  const date = parseISO(params.date)
  const formattedDate = format(date, "MMMM d, yyyy")

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/history">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to History</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{formattedDate}</h1>
        </div>

        <div className="flex justify-center">
          <Suspense fallback={<div className="h-48 w-48 rounded-full bg-muted animate-pulse" />}>
            <ProgressCircle userId={userId} date={date} />
          </Suspense>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Tasks</h2>

          <Suspense
            fallback={
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            }
          >
            <TaskList userId={userId} date={date} readOnly={true} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

