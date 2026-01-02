"use server"

import { db } from "@/lib/db"

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    })
    return users
  } catch (error) {
    console.error("SERVER ACTION ERROR (getUsers):", error)
    throw error
  }
}
