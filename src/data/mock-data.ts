export type User = {
  id: string
  name: string
  email: string
  role: "Admin" | "User" | "Editor"
  status: "Active" | "Inactive"
}

export const users: User[] = [
  {
    id: "728ed52f",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "489e1d42",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: "3e5a6b7c",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "1a2b3c4d",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: "5e6f7g8h",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: "k9l0m1n2",
    name: "David Miller",
    email: "david@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "o3p4q5r6",
    name: "Eva Green",
    email: "eva@example.com",
    role: "User",
    status: "Active",
  },
]

export const products = [
  {
    id: "PROD-001",
    name: "Premium Dashboard Kit",
    category: "Software",
    price: "$49.00",
    stock: 120,
    status: "In Stock",
  },
  {
    id: "PROD-002",
    name: "React SaaS Boilerplate",
    category: "Software",
    price: "$89.00",
    stock: 45,
    status: "In Stock",
  },
  {
    id: "PROD-003",
    name: "UI Icons Pack",
    category: "Design",
    price: "$19.00",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PROD-004",
    name: "Tailwind CSS Templates",
    category: "Software",
    price: "$29.00",
    stock: 85,
    status: "In Stock",
  },
]

export const invoices = [
  {
    id: "INV-001",
    customer: "John Doe",
    amount: "$49.00",
    date: "2026-01-01",
    status: "Paid",
  },
  {
    id: "INV-002",
    customer: "Jane Smith",
    amount: "$89.00",
    date: "2026-01-02",
    status: "Pending",
  },
  {
    id: "INV-003",
    customer: "Bob Johnson",
    amount: "$19.00",
    date: "2026-01-03",
    status: "Unpaid",
  },
  {
    id: "INV-004",
    customer: "Alice Brown",
    amount: "$29.00",
    date: "2026-01-04",
    status: "Paid",
  },
]
