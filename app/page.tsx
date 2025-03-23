 import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <CheckCircle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">TaskTracker</h1>
          <p className="text-muted-foreground">
            Track your daily tasks, build better habits, and visualize your progress
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            By using TaskTracker, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

