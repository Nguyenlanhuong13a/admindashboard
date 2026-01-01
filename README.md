# Premium Next.js 15 Admin Dashboard Starter Kit

A high-quality, professional admin dashboard boilerplate built with the latest technologies for 2026. This template is designed for commercial use, offering a comprehensive set of features and "Pro-Level" pages.

## 🚀 Features

- **Next.js 15 (App Router)**: Fast, modern, and SEO-friendly with React 19 support.
- **Authentication (Clerk)**: Fully integrated Clerk authentication with protected routes and user profile sync.
- **Dynamic Dashboard**: Interactive charts with **Date Range Filtering** and granular dummy data.
- **Pro-Level Pages**:
  - ✅ **Kanban Board**: Drag-and-drop task management.
  - ✅ **Calendar**: Event management with monthly view and details.
  - ✅ **File Manager**: Grid and List views with file-type recognition.
  - ✅ **Chat UI**: Fully functional sidebar and messaging interface.
- **Advanced Forms**: Settings page with Date Picker, Combobox, Avatar upload UI, and Zod validation.
- **Tailwind CSS v4**: Utility-first styling with the latest features.
- **shadcn/ui**: Beautifully designed components.
- **Dark Mode**: Built-in support with `next-themes`.
- **Responsive Sidebar**: Collapsible mobile-friendly sidebar with Clerk user integration.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Auth**: [Clerk](https://clerk.com/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 📦 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env.local` file with your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📁 Project Structure

- `src/app`: Application routes and pages.
- `src/components`: Reusable UI components and layout wrappers.
- `src/components/ui`: shadcn/ui components.
- `src/data`: Mock data for development and demonstration.
- `src/hooks`: Custom React hooks (e.g., `use-mobile`).
- `src/lib`: Utility functions.

## 📝 Customization

- **Theme Colors**: Modify `src/app/globals.css` to change the primary colors and radii.
- **Navigation**: Update the `data.navMain` in `src/components/app-sidebar.tsx`.
- **Mock Data**: Change data in `src/data/mock-data.ts` to reflect your real business logic.

## 📄 License

This starter kit is designed for developers to jumpstart their SaaS or admin panel projects.

---

Built with ❤️ for the 2026 Developer Ecosystem.
