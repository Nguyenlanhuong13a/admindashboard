"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getDashboardStats, getInvoices } from "@/actions/dashboard"
import { Loader2, DollarSign, Users, ShoppingCart, Activity, Download } from "lucide-react"
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
import { subDays, isWithinInterval, format, eachDayOfInterval } from "date-fns"
import { DateRange } from "react-day-picker"

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
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"

// Generate granular dummy data
const generateDailyData = (days: number) => {
  return eachDayOfInterval({
    start: subDays(new Date(), days - 1),
    end: new Date(),
  }).map(date => ({
    date,
    formattedDate: format(date, "MMM dd"),
    desktop: Math.floor(Math.random() * 500) + 100,
    mobile: Math.floor(Math.random() * 300) + 50,
    revenue: Math.floor(Math.random() * 2000) + 500,
  }))
}

const pieDataAll = [
  { name: "Desktop", value: 400, fill: "var(--color-desktop)" },
  { name: "Mobile", value: 300, fill: "var(--color-mobile)" },
  { name: "Tablet", value: 300, fill: "var(--color-tablet)" },
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
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [chartData, setChartData] = React.useState<Array<{
    date: Date
    formattedDate: string
    desktop: number
    mobile: number
    revenue: number
  }>>([])
  const [statsData, setStatsData] = React.useState<Array<{
    title: string
    value: string
    description: string
    icon: string
  }>>([])
  const [recentSales, setRecentSales] = React.useState<Array<{
    customer: string
    amount: string
    date: string
  }>>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const init = async () => {
      try {
        const [stats, invoices] = await Promise.all([
          getDashboardStats(),
          getInvoices(),
        ])
        setStatsData(stats)
        setRecentSales(invoices.slice(0, 5))
        setChartData(generateDailyData(90))
      } catch (error) {
        console.error("Dashboard data fetch error:", error)
        setStatsData([])
        setRecentSales([])
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    if (!date?.from || !date?.to) return chartData.slice(-30)
    
    return chartData.filter(item => 
      isWithinInterval(item.date, { start: date.from!, end: date.to! })
    )
  }, [date, chartData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const iconMap: Record<string, React.ElementType> = {
    DollarSign,
    Users,
    ShoppingCart,
    Activity,
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={date} setDate={setDate} />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = iconMap[stat.icon] || Activity
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Bar Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
            <CardDescription>Daily desktop vs mobile visitors for selected period</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <BarChart data={filteredData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval="preserveStartEnd"
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
              You made {recentSales.length} sales recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{sale.customer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.date}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Line Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Track your earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <LineChart data={filteredData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval="preserveStartEnd"
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
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Distribution of traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
              <PieChart>
                <Pie
                  data={pieDataAll}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {pieDataAll.map((entry, index) => (
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
