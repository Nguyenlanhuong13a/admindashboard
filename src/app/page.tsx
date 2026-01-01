"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, DollarSign, ShoppingCart, Activity } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const barChartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const pieData = [
  { name: "Desktop", value: 400, fill: "var(--color-desktop)" },
  { name: "Mobile", value: 300, fill: "var(--color-mobile)" },
  { name: "Tablet", value: 300, fill: "var(--color-tablet)" },
]

const lineData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 5900 },
  { month: "Jun", revenue: 7200 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Subscriptions",
    value: "+2350",
    description: "+180.1% from last month",
    icon: Users,
  },
  {
    title: "Sales",
    value: "+12,234",
    description: "+19% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Active Now",
    value: "+573",
    description: "+201 since last hour",
    icon: Activity,
  },
]

/**
 * Dashboard Page
 * 
 * This is the main overview page of the admin dashboard.
 * It features statistical cards and various charts using Recharts.
 * 
 * Features:
 * - Responsive grid layout
 * - Statistical overview cards with icons
 * - Bar chart for visitor statistics
 * - Line chart for revenue growth
 * - Pie chart for device usage distribution
 * - Recent sales list with customer details
 */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Bar Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
            <CardDescription>Monthly desktop vs mobile visitors</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <BarChart data={barChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Sales List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initials: "OM" },
                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "JL" },
                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initials: "IN" },
                { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK" },
                { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initials: "SD" },
              ].map((user, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{user.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Line Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Track your earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <LineChart data={lineData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Usage Pie Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Distribution of traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
