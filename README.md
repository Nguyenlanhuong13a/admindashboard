# Next.js 15 Admin Dashboard Starter Kit

A professional, production-ready Admin Dashboard Starter Kit designed to save developers weeks of development time. This kit provides a solid foundation for building SaaS backends, internal tools, and enterprise management systems with the latest tech stack of 2026.

### Who is this for?
- **SaaS Founders**: Launch your MVP faster with a pre-built admin interface.
- **Freelancers**: Deliver high-quality projects to clients in record time.
- **Internal Tool Developers**: Create powerful management dashboards for your team.

---

## 🚀 Features

- **Authentication Ready**: Fully integrated authentication flows.
- **Kanban Board (Full CRUD)**: Professional task management with drag-and-drop and database persistence.
- **Users Management**: Real-time user administration with database connectivity.
- **Invoices Management**: Track business transactions with status-based filtering.
- **Charts & Dashboard Analytics**: Interactive data visualizations for business insights.
- **Empty State UX**: Professional fallback UI for all pages when no data is present.
- **Dark Mode**: Seamless theme switching supported by `next-themes`.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: Tailwind CSS & shadcn/ui
- **Icons**: Lucide React
- **Types**: TypeScript

---

## 📦 Getting Started

Follow these steps to get your dashboard up and running in minutes:

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and update your database connection string and Clerk keys.
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Prepare Database**
   Run the migration/push to sync your schema with the database.
   ```bash
   npx prisma db push
   ```

5. **Seed Demo Data**
   Populate your database with professional demo data (Admin user, 20 users, Kanban board, 50 invoices).
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Folder Structure

- `/src/app`: Application routes, layouts, and page components.
- `/src/actions`: Server actions for secure database operations.
- `/src/components`: Reusable UI components and shared layouts.
- `/prisma`: Database schema and seeding scripts.
- `/src/lib`: Utility functions and shared library configurations (e.g., Prisma client).

---

## 📝 Important Note

This is a **Starter Kit**. It is intended to be a robust foundation for your specific application. While it comes with full functionality out of the box, it is designed to be easily customized and extended to fit your unique business requirements.

---

Built with quality and performance in mind. For support or customization requests, refer to the project documentation.
