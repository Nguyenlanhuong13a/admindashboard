export type User = {
  id: string
  name: string
  email: string
  role: "Admin" | "User" | "Editor"
  status: "Active" | "Inactive"
}

export const users: User[] = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com", role: "Admin", status: "Active" },
  { id: "2", name: "Jackson Lee", email: "jackson.lee@email.com", role: "User", status: "Active" },
  { id: "3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", role: "Editor", status: "Active" },
  { id: "4", name: "William Kim", email: "will@email.com", role: "User", status: "Inactive" },
  { id: "5", name: "Sofia Davis", email: "sofia.davis@email.com", role: "User", status: "Active" },
  { id: "6", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: "7", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
  { id: "8", name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "9", name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active" },
  { id: "10", name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "Inactive" },
  { id: "11", name: "David Miller", email: "david@example.com", role: "Editor", status: "Active" },
  { id: "12", name: "Eva Green", email: "eva@example.com", role: "User", status: "Active" },
  { id: "13", name: "Frank Wright", email: "frank@example.com", role: "User", status: "Active" },
  { id: "14", name: "Grace Hall", email: "grace@example.com", role: "Editor", status: "Inactive" },
  { id: "15", name: "Henry Adams", email: "henry@example.com", role: "User", status: "Active" },
  { id: "16", name: "Ivy Scott", email: "ivy@example.com", role: "Admin", status: "Active" },
  { id: "17", name: "Jack Black", email: "jack@example.com", role: "User", status: "Active" },
  { id: "18", name: "Kelly White", email: "kelly@example.com", role: "User", status: "Inactive" },
  { id: "19", name: "Liam Neeson", email: "liam@example.com", role: "Editor", status: "Active" },
  { id: "20", name: "Mia Wong", email: "mia@example.com", role: "User", status: "Active" },
]

export const products = [
  { id: "PROD-001", name: "Premium Dashboard Kit", category: "Software", price: "$49.00", stock: 120, status: "In Stock" },
  { id: "PROD-002", name: "React SaaS Boilerplate", category: "Software", price: "$89.00", stock: 45, status: "In Stock" },
  { id: "PROD-003", name: "UI Icons Pack", category: "Design", price: "$19.00", stock: 0, status: "Out of Stock" },
  { id: "PROD-004", name: "Tailwind CSS Templates", category: "Software", price: "$29.00", stock: 85, status: "In Stock" },
  { id: "PROD-005", name: "Node.js Backend Starter", category: "Software", price: "$59.00", stock: 30, status: "In Stock" },
  { id: "PROD-006", name: "Figma Design System", category: "Design", price: "$39.00", stock: 150, status: "In Stock" },
  { id: "PROD-007", name: "Next.js Blog Theme", category: "Software", price: "$25.00", stock: 0, status: "Out of Stock" },
  { id: "PROD-008", name: "Vue Admin Template", category: "Software", price: "$45.00", stock: 60, status: "In Stock" },
]

export const invoices = [
  { id: "INV-001", customer: "Olivia Martin", amount: "$1,999.00", date: "2026-01-01", status: "Paid" },
  { id: "INV-002", customer: "Jackson Lee", amount: "$39.00", date: "2026-01-02", status: "Pending" },
  { id: "INV-003", customer: "Isabella Nguyen", amount: "$299.00", date: "2026-01-03", status: "Unpaid" },
  { id: "INV-004", customer: "William Kim", amount: "$99.00", date: "2026-01-04", status: "Paid" },
  { id: "INV-005", customer: "Sofia Davis", amount: "$39.00", date: "2026-01-05", status: "Paid" },
  { id: "INV-006", customer: "John Doe", amount: "$150.00", date: "2026-01-06", status: "Paid" },
  { id: "INV-007", customer: "Jane Smith", amount: "$450.00", date: "2026-01-07", status: "Pending" },
  { id: "INV-008", customer: "Bob Johnson", amount: "$75.00", date: "2026-01-08", status: "Unpaid" },
  { id: "INV-009", customer: "Alice Brown", amount: "$120.00", date: "2026-01-09", status: "Paid" },
  { id: "INV-010", customer: "Charlie Wilson", amount: "$300.00", date: "2026-01-10", status: "Pending" },
]
