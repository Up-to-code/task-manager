import { getDailyTasks } from "@/lib/tasks"
import TaskItem from "./task-item"
import { EmptyPlaceholder } from "./empty-placeholder"

interface TaskListProps {
  userId: string
  date?: Date
  readOnly?: boolean
}

export default async function TaskList({ userId, date = new Date(), readOnly = false }: TaskListProps) {
  const tasks = await getDailyTasks(userId, date)

  if (tasks.length === 0) {
    return <EmptyPlaceholder title="No tasks yet" description="Add your first task to get started" />
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          taskId={task.taskId}
          title={task.title}
          description={task.description ?? undefined}
          points={task.points}
          completed={task.completed}
          date={task.date}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}

