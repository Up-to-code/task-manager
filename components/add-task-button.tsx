"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskDialog } from "./task-dialog"

export default function AddTaskButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>

      <TaskDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

