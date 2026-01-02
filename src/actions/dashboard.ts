"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// --- User Actions ---
export async function getUsers() {
  return await db.user.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function addUser(data: { name: string, email: string, role: string, status: string }) {
  const user = await db.user.create({
    data,
  })
  revalidatePath("/users")
  return user
}

export async function deleteUser(id: string) {
  await db.user.delete({
    where: { id },
  })
  revalidatePath("/users")
  return { success: true }
}

export async function seedUsers() {
  const count = await db.user.count()
  if (count === 0) {
    await db.user.createMany({
      data: [
        { name: "Olivia Martin", email: "olivia.martin@email.com", role: "Admin", status: "Active" },
        { name: "Jackson Lee", email: "jackson.lee@email.com", role: "User", status: "Active" },
        { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", role: "Editor", status: "Active" },
        { name: "William Kim", email: "will@email.com", role: "User", status: "Inactive" },
        { name: "Sofia Davis", email: "sofia.davis@email.com", role: "User", status: "Active" },
      ],
    })
  }
}

// --- Product Actions ---
export async function getProducts() {
  return await db.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function addProduct(data: { name: string, category: string, price: string, stock: number, status: string }) {
  const product = await db.product.create({
    data,
  })
  revalidatePath("/products")
  return product
}

export async function deleteProduct(id: string) {
  await db.product.delete({
    where: { id },
  })
  revalidatePath("/products")
  return { success: true }
}

export async function seedProducts() {
  const count = await db.product.count()
  if (count === 0) {
    await db.product.createMany({
      data: [
        { id: "PROD-001", name: "Premium Dashboard Kit", category: "Software", price: "$49.00", stock: 120, status: "In Stock" },
        { id: "PROD-002", name: "React SaaS Boilerplate", category: "Software", price: "$89.00", stock: 45, status: "In Stock" },
        { id: "PROD-003", name: "UI Icons Pack", category: "Design", price: "$19.00", stock: 0, status: "Out of Stock" },
      ],
    })
  }
}

// --- Invoice Actions ---
export async function getInvoices() {
  return await db.invoice.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function addInvoice(data: { customer: string, amount: string, date: string, status: string }) {
  const invoice = await db.invoice.create({
    data,
  })
  revalidatePath("/invoices")
  revalidatePath("/") // Dashboard also needs refresh for stats/recent sales
  return invoice
}

export async function deleteInvoice(id: string) {
  await db.invoice.delete({
    where: { id },
  })
  revalidatePath("/invoices")
  revalidatePath("/")
  return { success: true }
}

export async function seedInvoices() {
  const count = await db.invoice.count()
  if (count === 0) {
    await db.invoice.createMany({
      data: [
        { id: "INV-001", customer: "Olivia Martin", amount: "$1,999.00", date: "2026-01-01", status: "Paid" },
        { id: "INV-002", customer: "Jackson Lee", amount: "$39.00", date: "2026-01-02", status: "Pending" },
        { id: "INV-003", customer: "Isabella Nguyen", amount: "$299.00", date: "2026-01-03", status: "Unpaid" },
      ],
    })
  }
}

// --- Calendar Actions ---
export async function getCalendarEvents() {
  return await db.calendarEvent.findMany({
    orderBy: { date: "asc" },
  })
}

export async function addCalendarEvent(data: { title: string, date: Date, type: string }) {
  const event = await db.calendarEvent.create({
    data,
  })
  revalidatePath("/calendar")
  return event
}

export async function deleteCalendarEvent(id: string) {
  await db.calendarEvent.delete({
    where: { id },
  })
  revalidatePath("/calendar")
  return { success: true }
}

export async function seedCalendarEvents() {
  const count = await db.calendarEvent.count()
  if (count === 0) {
    await db.calendarEvent.createMany({
      data: [
        { title: "Project Kickoff", date: new Date(), type: "meeting" },
        { title: "Submit Report", date: new Date(), type: "deadline" },
      ],
    })
  }
}

// --- Chat Actions ---
export async function getChatMessages() {
  return await db.chatMessage.findMany({
    orderBy: { createdAt: "asc" },
  })
}

export async function seedChatMessages() {
  const count = await db.chatMessage.count()
  if (count === 0) {
    await db.chatMessage.createMany({
      data: [
        { senderId: "1", text: "Hi there! How is the project going?", time: "10:30 AM", isMe: false },
        { senderId: "me", text: "It's going well! We just finished the auth integration.", time: "10:32 AM", isMe: true },
      ],
    })
  }
}

export async function sendChatMessage(text: string) {
  const message = await db.chatMessage.create({
    data: {
      senderId: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    },
  })
  return message
}

// --- File Actions ---
export async function getFileItems() {
  return await db.fileItem.findMany({
    orderBy: { updatedAt: "desc" },
  })
}

export async function addFileItem(data: { name: string, type: string, extension?: string, size?: string }) {
  const item = await db.fileItem.create({
    data,
  })
  revalidatePath("/files")
  return item
}

export async function deleteFileItem(id: string) {
  await db.fileItem.delete({
    where: { id },
  })
  revalidatePath("/files")
  return { success: true }
}

export async function seedFileItems() {
  const count = await db.fileItem.count()
  if (count === 0) {
    await db.fileItem.createMany({
      data: [
        { name: "Documents", type: "folder" },
        { name: "Project-v1.pdf", type: "file", extension: "pdf", size: "2.4 MB" },
      ],
    })
  }
}

// --- Profile Actions ---
export async function getProfile(clerkId: string) {
  let profile = await db.profile.findUnique({
    where: { clerkId },
  })

  if (!profile) {
    profile = await db.profile.create({
      data: {
        clerkId,
        username: "user_" + clerkId.slice(-6),
        marketingEmails: false,
        securityEmails: true,
        theme: "system",
        language: "en",
      },
    })
  }

  return profile
}

export async function updateProfile(clerkId: string, data: {
  username?: string | null
  bio?: string | null
  marketingEmails?: boolean
  securityEmails?: boolean
  theme?: string
  language?: string
  dob?: Date | null
}) {
  const profile = await db.profile.update({
    where: { clerkId },
    data,
  })
  revalidatePath("/settings")
  return profile
}

// --- Dashboard Stats ---
export async function getDashboardStats() {
  const [userCount, productCount, invoiceCount] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.invoice.count(),
  ])

  // Simple aggregate for total revenue from invoices
  const allInvoices = await db.invoice.findMany()
  const totalRevenue = allInvoices.reduce((acc: number, inv: { amount: string }) => {
    const amount = parseFloat(inv.amount.replace(/[^0-9.-]+/g, ""))
    return acc + (isNaN(amount) ? 0 : amount)
  }, 0)

  return [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "+20.1% from last month",
      icon: "DollarSign",
    },
    {
      title: "Subscriptions",
      value: `+${userCount}`,
      description: "+180.1% from last month",
      icon: "Users",
    },
    {
      title: "Products",
      value: `+${productCount}`,
      description: "+19% from last month",
      icon: "ShoppingCart",
    },
    {
      title: "Active Now",
      value: `+${invoiceCount}`,
      description: "Total invoices",
      icon: "Activity",
    },
  ]
}
