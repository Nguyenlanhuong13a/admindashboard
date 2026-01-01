"use client"

import * as React from "react"
import { 
  File, 
  Folder, 
  Grid, 
  List, 
  MoreVertical, 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type FileItem = {
  id: string
  name: string
  type: 'folder' | 'file'
  extension?: string
  size?: string
  updatedAt: string
}

const initialFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", updatedAt: "2023-12-01" },
  { id: "2", name: "Images", type: "folder", updatedAt: "2023-12-05" },
  { id: "3", name: "Project-v1.pdf", type: "file", extension: "pdf", size: "2.4 MB", updatedAt: "2023-12-10" },
  { id: "4", name: "Presentation.pptx", type: "file", extension: "pptx", size: "5.1 MB", updatedAt: "2023-12-12" },
  { id: "5", name: "Hero-bg.jpg", type: "file", extension: "jpg", size: "1.2 MB", updatedAt: "2023-12-14" },
  { id: "6", name: "Invoices-2023.zip", type: "file", extension: "zip", size: "15.8 MB", updatedAt: "2023-12-15" },
]

export default function FileManagerPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredFiles = initialFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="h-10 w-10 text-blue-500 fill-blue-500" />
    
    switch (file.extension) {
      case 'pdf': return <FileText className="h-10 w-10 text-red-500" />
      case 'jpg':
      case 'png': return <ImageIcon className="h-10 w-10 text-green-500" />
      case 'mp4': return <Film className="h-10 w-10 text-purple-500" />
      case 'mp3': return <Music className="h-10 w-10 text-pink-500" />
      default: return <File className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button>
            <Folder className="mr-2 h-4 w-4" /> New Folder
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8 w-full md:max-w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center border rounded-md p-1">
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('grid')}
            className="h-8 w-8"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('list')}
            className="h-8 w-8"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center gap-2 relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="py-4">
                  {getFileIcon(file)}
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-medium truncate px-2">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size || 'Folder'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground font-medium">
                  <th className="p-4">Name</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Last Modified</th>
                  <th className="p-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-muted/50 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 flex items-center justify-center">
                          {React.isValidElement(getFileIcon(file)) && 
                            React.cloneElement(getFileIcon(file) as React.ReactElement<{ className?: string }>, { 
                              className: "h-5 w-5" 
                            })}
                        </div>
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{file.size || '--'}</td>
                    <td className="p-4 text-muted-foreground">{file.updatedAt}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
