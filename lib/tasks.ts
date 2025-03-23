import { db } from "@/lib/db"
import { format } from "date-fns"

// Get all task templates for a user
export async function getTasks(userId: string) {
  if (!userId) {
    return []
  }

  return db.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

// Get daily tasks for a specific date
export async function getDailyTasks(userId: string, date: Date) {
  if (!userId) {
    return []
  }

  // Format the date to remove time component
  const formattedDate = new Date(format(date, "yyyy-MM-dd"))

  // Get all tasks for the user
  const tasks = await db.task.findMany({
    where: {
      userId,
    },
    include: {
      dailyTasks: {
        where: {
          date: formattedDate,
          userId,
        },
      },
    },
  })

  // For each task, check if there's a daily task for the specified date
  // If not, we'll create one
  const dailyTasks = await Promise.all(
    tasks.map(async (task) => {
      if (task.dailyTasks.length === 0) {
        // Create a new daily task for this date
        const dailyTask = await db.dailyTask.create({
          data: {
            date: formattedDate,
            userId,
            taskId: task.id,
            completed: false,
          },
        })

        return {
          id: dailyTask.id,
          taskId: task.id,
          title: task.title,
          description: task.description,
          points: task.points,
          completed: dailyTask.completed,
          date: dailyTask.date,
        }
      }

      // Return the existing daily task
      return {
        id: task.dailyTasks[0].id,
        taskId: task.id,
        title: task.title,
        description: task.description,
        points: task.points,
        completed: task.dailyTasks[0].completed,
        date: task.dailyTasks[0].date,
      }
    }),
  )

  return dailyTasks
}

// Get all dates that have daily tasks
export async function getTaskDates(userId: string) {
  if (!userId) {
    return []
  }

  const dates = await db.$queryRaw<{ date: Date }[]>`
    SELECT DISTINCT date 
    FROM "DailyTask" 
    WHERE "userId" = ${userId}
    ORDER BY date DESC
  `

  return dates.map((d) => d.date)
}

// Get summary stats for a specific date
export async function getDailySummary(userId: string, date: Date) {
  if (!userId) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      totalPoints: 0,
      earnedPoints: 0,
      percentage: 0,
    }
  }

  const formattedDate = new Date(format(date, "yyyy-MM-dd"))

  const dailyTasks = await db.dailyTask.findMany({
    where: {
      userId,
      date: formattedDate,
    },
    include: {
      task: true,
    },
  })

  const totalTasks = dailyTasks.length
  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalPoints = dailyTasks.reduce((sum, task) => sum + task.task.points, 0)
  const earnedPoints = dailyTasks.filter((task) => task.completed).reduce((sum, task) => sum + task.task.points, 0)

  const percentage = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100)

  return {
    totalTasks,
    completedTasks,
    totalPoints,
    earnedPoints,
    percentage,
  }
}

