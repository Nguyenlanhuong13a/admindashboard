"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { getCalendarEvents, seedCalendarEvents, addCalendarEvent, deleteCalendarEvent } from "@/actions/dashboard"
import { toast } from "sonner"
import { Plus, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from "lucide-react"

type Event = {
  id: string
  title: string
  date: Date
  type: string // meeting, deadline, reminder
}

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [events, setEvents] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    type: "reminder"
  })

  React.useEffect(() => {
    const init = async () => {
      await seedCalendarEvents()
      const data = await getCalendarEvents()
      setEvents(data)
      setLoading(false)
    }
    init()
  }, [])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  eachDayOfInterval({ start: monthStart, end: monthEnd })

  const selectedDayEvents = events.filter(event => 
    date && isSameDay(new Date(event.date), date)
  )

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title) return

    try {
      await addCalendarEvent({
        title: newEvent.title,
        date: date || new Date(),
        type: newEvent.type
      })
      toast.success("Event added successfully")
      setIsAddOpen(false)
      setNewEvent({ title: "", type: "reminder" })
      const data = await getCalendarEvents()
      setEvents(data)
    } catch {
      toast.error("Failed to add event")
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteCalendarEvent(id)
        toast.success("Event deleted successfully")
        const data = await getCalendarEvents()
        setEvents(data)
      } catch {
        toast.error("Failed to delete event")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
          <DialogContent>
            <form onSubmit={handleAddEvent}>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new event for {date ? format(date, "PPP") : "today"}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <CardDescription>View and manage your schedule</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border w-full flex justify-center"
              classNames={{
                months: "w-full space-y-4",
                month: "w-full space-y-4",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full",
                day: "h-14 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex items-start justify-end p-2",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              {date ? format(date, "PPPP") : "Select a day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg group relative">
                    <div className={`w-1 h-10 rounded-full ${
                      event.type === 'meeting' ? 'bg-blue-500' : 
                      event.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground uppercase">{event.type}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No events for this day</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
