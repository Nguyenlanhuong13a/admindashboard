"use client"

import * as React from "react"
import { Search, MoreVertical, Send, Phone, Video, Info, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type User = {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  lastMessage: string
  time: string
  unread?: number
}

const users: User[] = [
  { id: "1", name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?u=1", status: "online", lastMessage: "Let me know when you're ready", time: "2m ago", unread: 3 },
  { id: "2", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=2", status: "offline", lastMessage: "The presentation is finished", time: "1h ago" },
  { id: "3", name: "Alice Freeman", avatar: "https://i.pravatar.cc/150?u=3", status: "online", lastMessage: "Thanks for the help!", time: "3h ago" },
  { id: "4", name: "James Miller", avatar: "https://i.pravatar.cc/150?u=4", status: "away", lastMessage: "I'll check the files later", time: "5h ago" },
]

type Message = {
  id: string
  senderId: string
  text: string
  time: string
  isMe: boolean
}

const initialMessages: Message[] = [
  { id: "1", senderId: "1", text: "Hi there! How is the project going?", time: "10:30 AM", isMe: false },
  { id: "2", senderId: "me", text: "It's going well! We just finished the auth integration.", time: "10:32 AM", isMe: true },
  { id: "3", senderId: "1", text: "That's great news. Did you use Clerk?", time: "10:33 AM", isMe: false },
  { id: "4", senderId: "me", text: "Yes, it works perfectly with Next.js 15.", time: "10:35 AM", isMe: true },
]

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = React.useState<User>(users[0])
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = React.useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 p-4">
      {/* Sidebar */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedUser.id === user.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${
                    user.status === 'online' ? "bg-green-500" : user.status === 'away' ? "bg-yellow-500" : "bg-gray-500"
                  }`} />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground">{user.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>
                    {user.unread && (
                      <Badge className="h-4 min-w-[1rem] px-1 text-[10px] flex items-center justify-center">
                        {user.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card/50">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedUser.avatar} />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">{selectedUser.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{selectedUser.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] space-y-1 ${message.isMe ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-2xl text-sm ${
                    message.isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  }`}>
                    {message.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-card/50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" type="button">
              <Smile className="h-4 w-4" />
            </Button>
            <Button size="icon" type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
