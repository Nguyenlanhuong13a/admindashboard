"use client"

import * as React from "react"
import { Search, MoreVertical, Send, Phone, Video, Info, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getChatMessages, seedChatMessages, sendChatMessage, getUsers } from "@/actions/dashboard"
import { Loader2 } from "lucide-react"

type ChatUser = {
  id: string
  name: string
  avatar: string
  status: string
  lastMessage: string
  time: string
  unread?: number
}

type Message = {
  id: string
  senderId: string
  text: string
  time: string
  isMe: boolean
}

export default function ChatPage() {
  const [chatUsers, setChatUsers] = React.useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = React.useState<ChatUser | null>(null)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [newMessage, setNewMessage] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const init = async () => {
      try {
        await seedChatMessages()
        const [usersData, messagesData] = await Promise.all([
          getUsers(),
          getChatMessages()
        ])
        
        const mappedUsers: ChatUser[] = usersData.map((u: { id: string; name: string }) => ({
          id: u.id,
          name: u.name,
          avatar: `https://i.pravatar.cc/150?u=${u.id}`,
          status: 'online',
          lastMessage: "Hey, how's it going?",
          time: "2m ago"
        }))

        setChatUsers(mappedUsers)
        if (mappedUsers.length > 0) {
          setSelectedUser(mappedUsers[0])
        }
        setMessages(messagesData as Message[])
      } catch (error) {
        console.error("Failed to load chat data", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageText = newMessage
    setNewMessage("")

    // Optimistic update
    const tempId = Date.now().toString()
    const tempMessage: Message = {
      id: tempId,
      senderId: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }
    setMessages(prev => [...prev, tempMessage])

    try {
      await sendChatMessage(messageText)
      const data = await getChatMessages()
      setMessages(data)
    } catch (error) {
      console.error("Failed to send message", error)
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
            {chatUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedUser?.id === user.id ? "bg-accent" : "hover:bg-accent/50"
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
        {selectedUser ? (
          <>
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  )
}
