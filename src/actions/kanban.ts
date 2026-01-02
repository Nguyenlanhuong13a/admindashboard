"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Fetch all Kanban data
export async function getKanbanBoard() {
  try {
    const columns = await db.kanbanColumn.findMany({
      include: {
        tasks: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })
    return columns
  } catch (error) {
    console.error("SERVER ACTION ERROR (getKanbanBoard):", error)
    throw error
  }
}

// Update task position after drag & drop
export async function updateTaskPosition(
  taskId: string,
  newColumnId: string,
  newOrder: number
) {
  try {
    await db.kanbanTask.update({
      where: { id: taskId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    })
    revalidatePath("/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to move task:", error)
    return { success: false, error: "Failed to move task" }
  }
}

// Add a new task to a column
export async function addTask(content: string, priority: string, columnId: string) {
  try {
    const lastTask = await db.kanbanTask.findFirst({
      where: { columnId },
      orderBy: { order: "desc" },
    })

    await db.kanbanTask.create({
      data: {
        content,
        priority,
        columnId,
        order: (lastTask?.order ?? -1) + 1,
      },
    })
    revalidatePath("/kanban")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create task" }
  }
}

// Delete a task
export async function deleteTask(taskId: string) {
  try {
    await db.kanbanTask.delete({
      where: { id: taskId },
    })
    revalidatePath("/kanban")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

// Optional: Seed initial columns if empty
export async function seedInitialData() {
  const count = await db.kanbanColumn.count()
  if (count === 0) {
    await db.kanbanColumn.createMany({
      data: [
        { title: "To Do", order: 0 },
        { title: "In Progress", order: 1 },
        { title: "Done", order: 2 },
      ],
    })
  }
}
