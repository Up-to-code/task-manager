"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toggleDailyTaskCompletion, deleteTask } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { EditTaskDialog } from "./edit-task-dialog"
import { useUser } from "@clerk/nextjs"

interface DailyTaskProps {
  id: string
  taskId: string
  title: string
  description?: string
  points: number
  completed: boolean
  date: Date
  readOnly?: boolean
}

export default function TaskItem({
  id,
  taskId,
  title,
  description,
  points,
  completed,
  readOnly = false,
}: DailyTaskProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
 const {user} = useUser()
  const handleToggle = async () => {
    if (readOnly) return

    setIsPending(true)
    await toggleDailyTaskCompletion(id)
    router.refresh()
    setIsPending(false)
  }

  const handleDelete = async () => {
    if (readOnly) return

    if (confirm("Are you sure you want to delete this task? This will remove it from all days.")) {
      await deleteTask(taskId)
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            id={`task-${id}`}
            checked={completed}
            onCheckedChange={handleToggle}
            disabled={isPending || readOnly}
            className="h-5 w-5"
          />
          <div className="flex flex-col">
            <label
              htmlFor={`task-${id}`}
              className={`font-medium ${completed ? "line-through text-muted-foreground" : ""}`}
            >
              {title}
            </label>
            {description && <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{points} pts</Badge>
          {!readOnly && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {!readOnly && (
        <EditTaskDialog
          task={{
            id: taskId,
            title,
            description: description || "",
            points,
            userId: user?.id || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          open={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </>
  )
}

