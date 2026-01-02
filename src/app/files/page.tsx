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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getFileItems, seedFileItems, addFileItem, deleteFileItem } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type FileItem = {
  id: string
  name: string
  type: string // folder, file
  extension?: string | null
  size?: string | null
  updatedAt: Date | string
}

export default function FileManagerPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState("")
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isFolderOpen, setIsFolderOpen] = React.useState(false)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState("")
  const [newFileName, setNewFileName] = React.useState("")

  React.useEffect(() => {
    const init = async () => {
      await seedFileItems()
      const data = await getFileItems()
      setFiles(data as unknown as FileItem[])
      setLoading(false)
    }
    init()
  }, [])

  const filteredFiles = files.filter(file => 
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

  const handleNewFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName) return

    try {
      await addFileItem({ name: newFolderName, type: "folder" })
      toast.success("Folder created successfully")
      setIsFolderOpen(false)
      setNewFolderName("")
      const data = await getFileItems()
      setFiles(data as unknown as FileItem[])
    } catch {
      toast.error("Failed to create folder")
    }
  }

  const handleDeleteFile = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteFileItem(id)
        toast.success("Item deleted successfully")
        const data = await getFileItems()
        setFiles(data as unknown as FileItem[])
      } catch {
        toast.error("Failed to delete item")
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName) return

    try {
      await addFileItem({ 
        name: newFileName, 
        type: "file", 
        extension: newFileName.split(".").pop() || "txt",
        size: "0 KB"
      })
      toast.success("File uploaded successfully")
      setIsUploadOpen(false)
      setNewFileName("")
      const data = await getFileItems()
      setFiles(data as unknown as FileItem[])
    } catch {
      toast.error("Failed to upload file")
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
        <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
            <DialogContent>
              <form onSubmit={handleUpload}>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Enter the name of the file you want to upload.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                      id="fileName"
                      placeholder="e.g. report.pdf"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Upload</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isFolderOpen} onOpenChange={setIsFolderOpen}>
            <Button onClick={() => setIsFolderOpen(true)}>
              <Folder className="mr-2 h-4 w-4" /> New Folder
            </Button>
            <DialogContent>
              <form onSubmit={handleNewFolder}>
                <DialogHeader>
                  <DialogTitle>New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for the new folder.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input
                      id="folderName"
                      placeholder="e.g. Documents"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Folder</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFile(file.id)}>
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
                    <td className="p-4 text-muted-foreground">{new Date(file.updatedAt).toLocaleDateString()}</td>
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
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFile(file.id)}>
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
