"use client"

import * as React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Loader2, LayoutPanelLeft, PlusCircle } from "lucide-react"
import { getKanbanBoard, updateTaskPosition, addTask, deleteTask, seedInitialData } from "@/actions/kanban"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function KanbanPage() {
  const [columns, setColumns] = React.useState<Array<{
    id: string
    title: string
    tasks: Array<{
      id: string
      content: string
      priority: string
    }>
  }>>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(null)
  const [newTask, setNewTask] = React.useState({
    content: "",
    priority: "low"
  })

  // Fetch data on mount
  React.useEffect(() => {
    const init = async () => {
      try {
        await seedInitialData()
        const data = await getKanbanBoard()
        setColumns(data)
      } catch (error) {
        console.error("Failed to fetch Kanban board:", error)
        toast.error("Failed to load board. Check database connection.")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Optimistic update
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex(c => c.id === source.droppableId)
    const destColIndex = newColumns.findIndex(c => c.id === destination.droppableId)
    
    const sourceCol = newColumns[sourceColIndex]
    const destCol = newColumns[destColIndex]
    
    const sourceTasks = [...sourceCol.tasks]
    const [movedTask] = sourceTasks.splice(source.index, 1)
    
    if (sourceColIndex === destColIndex) {
      sourceTasks.splice(destination.index, 0, movedTask)
      newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks }
    } else {
      const destTasks = [...destCol.tasks]
      destTasks.splice(destination.index, 0, movedTask)
      newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks }
      newColumns[destColIndex] = { ...destCol, tasks: destTasks }
    }
    
    setColumns(newColumns)

    // Sync with backend
    await updateTaskPosition(
      draggableId,
      destination.droppableId,
      destination.index
    )
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeColumnId || !newTask.content) return

    try {
      const res = await addTask(newTask.content, newTask.priority, activeColumnId)
      if (res.success) {
        toast.success("Task added successfully")
        setIsAddOpen(false)
        setNewTask({ content: "", priority: "low" })
        const data = await getKanbanBoard()
        setColumns(data)
      } else {
        toast.error(res.error || "Failed to add task")
      }
    } catch {
      toast.error("An error occurred while adding the task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await deleteTask(taskId)
      if (res.success) {
        toast.success("Task deleted successfully")
        const data = await getKanbanBoard()
        setColumns(data)
      } else {
        toast.error(res.error || "Failed to delete task")
      }
    } catch {
      toast.error("An error occurred while deleting the task")
    }
  }

  const openAddModal = (columnId: string) => {
    setActiveColumnId(columnId)
    setIsAddOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed rounded-lg p-12 gap-4">
        <div className="bg-muted p-4 rounded-full">
          <LayoutPanelLeft className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Kanban columns available</h3>
          <p className="text-muted-foreground max-w-sm">
            Your board is currently empty. Start by seeding initial data or creating your first column to manage tasks.
          </p>
        </div>
        <Button size="lg" className="mt-4" onClick={async () => {
          setLoading(true)
          await seedInitialData()
          const data = await getKanbanBoard()
          setColumns(data)
          setLoading(false)
          toast.success("Initial columns created")
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create First Column
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col w-80 shrink-0 gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold">{column.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{column.tasks.length}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAddModal(column.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-1 flex-col gap-3 p-2 bg-muted/50 rounded-lg min-h-[150px]"
                  >
                    {column.tasks.map((task: { id: string; content: string; priority: string }, index: number) => (
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
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive cursor-pointer"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Delete Task</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddTask}>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for this column.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Task Content</Label>
                <Input
                  id="content"
                  placeholder="What needs to be done?"
                  value={newTask.content}
                  onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
