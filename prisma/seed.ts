import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up database...")
  // Clean in reverse order of dependencies
  await prisma.kanbanTask.deleteMany()
  await prisma.kanbanColumn.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.user.deleteMany()
  
  console.log("Seeding data...")

  // --- Users ---
  console.log("Creating users...")
  // Admin User
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
  })

  // 20 Random Users
  const userNames = [
    "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Ross", "Edward Norton",
    "Fiona Apple", "George Clooney", "Hannah Montana", "Ian McKellen", "Julia Roberts",
    "Kevin Spacey", "Liam Neeson", "Meryl Streep", "Natalie Portman", "Oscar Isaac",
    "Penelope Cruz", "Quentin Tarantino", "Ryan Gosling", "Scarlett Johansson", "Tom Hardy"
  ]

  const users = await Promise.all(
    userNames.map((name, i) => {
      const email = `${name.toLowerCase().replace(" ", ".")}@example.com`
      return prisma.user.create({
        data: {
          name,
          email,
          role: i % 5 === 0 ? "Editor" : "User",
          status: i % 4 === 0 ? "Inactive" : "Active",
        }
      })
    })
  )

  // --- Kanban Board ---
  console.log("Creating Kanban board...")
  const todoCol = await prisma.kanbanColumn.create({
    data: { title: "To Do", order: 0 }
  })
  const inProgressCol = await prisma.kanbanColumn.create({
    data: { title: "In Progress", order: 1 }
  })
  const doneCol = await prisma.kanbanColumn.create({
    data: { title: "Done", order: 2 }
  })

  const kanbanTasks = [
    { content: "Integrate Clerk Authentication", priority: "high", col: todoCol },
    { content: "Design System Implementation", priority: "medium", col: todoCol },
    { content: "Setup Prisma Schema", priority: "high", col: todoCol },
    { content: "Configure PostgreSQL Database", priority: "medium", col: todoCol },
    { content: "Create Kanban UI Components", priority: "low", col: todoCol },
    { content: "Implement Server Actions for Users", priority: "high", col: inProgressCol },
    { content: "Develop Dashboard Analytics", priority: "medium", col: inProgressCol },
    { content: "Mobile Responsive Testing", priority: "medium", col: inProgressCol },
    { content: "Dark Mode Support", priority: "low", col: inProgressCol },
    { content: "API Documentation", priority: "low", col: inProgressCol },
    { content: "Initial Project Setup", priority: "medium", col: doneCol },
    { content: "Folder Structure Definition", priority: "low", col: doneCol },
    { content: "Install Core Dependencies", priority: "high", col: doneCol },
    { content: "Configure Tailwind CSS", priority: "medium", col: doneCol },
    { content: "Setup ESLint and Prettier", priority: "low", col: doneCol },
  ]

  for (let i = 0; i < kanbanTasks.length; i++) {
    const task = kanbanTasks[i]
    await prisma.kanbanTask.create({
      data: {
        content: task.content,
        priority: task.priority,
        columnId: task.col.id,
        order: i,
      }
    })
  }

  // --- Invoices ---
  console.log("Creating invoices...")
  const statuses = ["Paid", "Pending", "Unpaid"]
  const invoiceData = []

  for (let i = 1; i <= 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const amount = (Math.random() * 5000 + 50).toFixed(2)
    const date = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]
    
    invoiceData.push({
      customer: randomUser.name,
      amount: `$${parseFloat(amount).toLocaleString()}`,
      date,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    })
  }

  await prisma.invoice.createMany({
    data: invoiceData
  })

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
