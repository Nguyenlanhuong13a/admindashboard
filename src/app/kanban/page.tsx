"use client"

import * as React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical } from "lucide-react"

type Task = {
  id: string
  content: string
  priority: "low" | "medium" | "high"
}

type Column = {
  id: string
  title: string
  taskIds: string[]
}

const initialTasks: Record<string, Task> = {
  "task-1": { id: "task-1", content: "Implement Clerk Auth", priority: "high" },
  "task-2": { id: "task-2", content: "Design Landing Page", priority: "medium" },
  "task-3": { id: "task-3", content: "Optimize API routes", priority: "low" },
  "task-4": { id: "task-4", content: "Write Documentation", priority: "medium" },
}

const initialColumns: Record<string, Column> = {
  "col-1": {
    id: "col-1",
    title: "To Do",
    taskIds: ["task-1", "task-2"],
  },
  "col-2": {
    id: "col-2",
    title: "In Progress",
    taskIds: ["task-3"],
  },
  "col-3": {
    id: "col-3",
    title: "Done",
    taskIds: ["task-4"],
  },
}

const columnOrder = ["col-1", "col-2", "col-3"]

export default function KanbanPage() {
  const [tasks, setTasks] = React.useState(initialTasks)
  const [columns, setColumns] = React.useState(initialColumns)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const startColumn = columns[source.droppableId]
    const finishColumn = columns[destination.droppableId]

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
      return
    }

    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finishColumn.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    }

    setColumns({
      ...columns,
      [newStartColumn.id]: newStartColumn,
      [newFinishColumn.id]: newFinishColumn,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {columnOrder.map((columnId) => {
            const column = columns[columnId]
            const columnTasks = column.taskIds.map((taskId) => tasks[taskId])

            return (
              <div key={column.id} className="flex flex-col w-80 shrink-0 gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-1 flex-col gap-3 p-2 bg-muted/50 rounded-lg min-h-[150px]"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                            >
                              <CardContent className="p-3 flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium leading-none">
                                    {task.content}
                                  </p>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    variant={
                                      task.priority === "high"
                                        ? "destructive"
                                        : task.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
