 import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTaskDates, getDailySummary } from "@/lib/tasks"
import { auth } from "@clerk/nextjs/server"

export default async function HistoryPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const dates = await getTaskDates(userId)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">History</h1>
        </div>

        <div className="grid gap-4">
          {dates.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No history available yet.</p>
            </div>
          ) : (
            dates.map(async (date) => {
              const summary = await getDailySummary(userId, date)
              const formattedDate = format(date, "MMMM d, yyyy")
              const dateParam = format(date, "yyyy-MM-dd")

              return (
                <Link href={`/history/${dateParam}`} key={dateParam}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{formattedDate}</span>
                        <span className="text-primary">{summary.percentage}%</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {summary.completedTasks} of {summary.totalTasks} tasks completed ({summary.earnedPoints}/
                        {summary.totalPoints} points)
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

