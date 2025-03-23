"use server"

import { revalidatePath } from "next/cache"
 import { db } from "@/lib/db"
import { format } from "date-fns"
import { auth } from "@clerk/nextjs/server"

interface TaskData {
  title: string
  description: string
  points: number
}

interface UpdateTaskData extends TaskData {
  id: string
}

export async function createTask(data: TaskData) {
  const { userId } =await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Create the task template
  const task = await db.task.create({
    data: {
      title: data.title,
      description: data.description,
      points: data.points,
      userId,
    },
  })

  // Create a daily task for today
  const today = new Date(format(new Date(), "yyyy-MM-dd"))

  await db.dailyTask.create({
    data: {
      date: today,
      userId,
      taskId: task.id,
      completed: false,
    },
  })

  revalidatePath("/dashboard")
}

export async function updateTask(data: UpdateTaskData) {
  const { userId } =await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const task = await db.task.findUnique({
    where: { id: data.id },
  })

  if (!task || task.userId !== userId) {
    throw new Error("Unauthorized or task not found")
  }

  await db.task.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      points: data.points,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/history")
}

export async function toggleDailyTaskCompletion(dailyTaskId: string) {
  const { userId } =await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const dailyTask = await db.dailyTask.findUnique({
    where: { id: dailyTaskId },
  })

  if (!dailyTask || dailyTask.userId !== userId) {
    throw new Error("Unauthorized or task not found")
  }

  await db.dailyTask.update({
    where: { id: dailyTaskId },
    data: { completed: !dailyTask.completed },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/history/${format(dailyTask.date, "yyyy-MM-dd")}`)
}

export async function deleteTask(taskId: string) {
  const { userId } =await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const task = await db.task.findUnique({
    where: { id: taskId },
  })

  if (!task || task.userId !== userId) {
    throw new Error("Unauthorized or task not found")
  }

  // This will cascade delete all daily tasks
  await db.task.delete({
    where: { id: taskId },
  })

  revalidatePath("/dashboard")
  revalidatePath("/history")
}

