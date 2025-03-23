import { getDailySummary } from "@/lib/tasks"
import { format } from "date-fns"

interface ProgressCircleProps {
  userId: string
  date?: Date
}

export default async function ProgressCircle({ userId, date = new Date() }: ProgressCircleProps) {
  const summary = await getDailySummary(userId, date)
  const formattedDate = format(date, "MMMM d, yyyy")

  // SVG parameters
  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (summary.percentage * circumference) / 100

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2">
        <h2 className="text-lg font-medium">{formattedDate}</h2>
      </div>

      <div className="relative h-48 w-48">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - dash}
            strokeLinecap="round"
            className="stroke-primary transition-all duration-1000 ease-in-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold">{summary.percentage}%</span>
          <span className="text-sm text-muted-foreground">
            {summary.earnedPoints}/{summary.totalPoints} points
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm text-muted-foreground">
          {summary.completedTasks} of {summary.totalTasks} tasks completed
        </p>
      </div>
    </div>
  )
}

