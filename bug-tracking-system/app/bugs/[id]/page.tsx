"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Download, Edit, MessageCircle, Calendar, User, Tag, AlertTriangle, Trash2 } from "lucide-react"
import { fetchBug, updateBug, deleteBug, addComment, exportBugAsPDF, getUser } from "@/lib/api"

const priorityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

const statusColors = {
  Open: "bg-red-100 text-red-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
}

// Mock developers for assignment
const mockDevelopers = [
  { id: 2, name: "Sarah Wilson", email: "sarah@example.com" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com" },
]

export default function BugDetails() {
  const router = useRouter()
  const params = useParams()
  const [bug, setBug] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadBug()
  }, [params.id])

  const loadBug = async () => {
    try {
      setLoading(true)
      setError(null)
      const bugData = await fetchBug(params.id as string)
      setBug(bugData)
      setComments(bugData.comments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedBug = await updateBug(bug.id, { status: newStatus })
      setBug(updatedBug)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    try {
      const updatedBug = await updateBug(bug.id, { priority: newPriority })
      setBug(updatedBug)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAssignDeveloper = async (developerId: string) => {
    try {
      const developer = mockDevelopers.find(d => d.id === parseInt(developerId))
      const updatedBug = await updateBug(bug.id, { 
        assignedTo: developer?.name || null,
        assignedToId: developerId === "unassigned" ? null : parseInt(developerId)
      })
      setBug(updatedBug)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const comment = await addComment(bug.id, newComment)
      setComments([...comments, comment])
      setNewComment("")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteBug = async () => {
    if (!confirm("Are you sure you want to delete this bug?")) return

    try {
      await deleteBug(bug.id)
      router.push("/bugs")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleExportPDF = async () => {
    try {
      await exportBugAsPDF(bug.id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canEditBug = () => {
    if (!user || !bug) return false
    if (user.role === "Admin") return true
    if (user.role === "Reporter" && bug.userId === user.id && bug.status === "Open") return true
    if (user.role === "Developer" && bug.assignedToId === user.id) return true
    return false
  }

  const canDeleteBug = () => {
    return user?.role === "Admin"
  }

  const canAssignDeveloper = () => {
    return user?.role === "Admin"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bug details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/bugs")}>Back to Bugs</Button>
        </div>
      </div>
    )
  }

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Bug Not Found</h2>
          <p className="text-gray-600 mb-4">The bug you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/bugs")}>Back to Bugs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/bugs")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bugs
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Bug #{bug.id}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              {canEditBug() && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              )}
              {canDeleteBug() && (
                <Button variant="destructive" size="sm" onClick={handleDeleteBug}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bug Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{bug.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={priorityColors[bug.priority as keyof typeof priorityColors]}>
                      {bug.priority}
                    </Badge>
                    <Badge className={statusColors[bug.status as keyof typeof statusColors]}>{bug.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{bug.description}</p>
                </div>

                {bug.stepsToReproduce && (
                  <div>
                    <h3 className="font-semibold mb-2">Steps to Reproduce</h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {bug.stepsToReproduce}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bug.expectedBehavior && (
                    <div>
                      <h3 className="font-semibold mb-2">Expected Behavior</h3>
                      <p className="text-sm text-gray-700 bg-green-50 p-3 rounded">{bug.expectedBehavior}</p>
                    </div>
                  )}

                  {bug.actualBehavior && (
                    <div>
                      <h3 className="font-semibold mb-2">Actual Behavior</h3>
                      <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">{bug.actualBehavior}</p>
                    </div>
                  )}
                </div>

                {bug.screenshots && bug.screenshots.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Screenshots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bug.screenshots.map((screenshot: string, index: number) => (
                        <img
                          key={index}
                          src={screenshot || "/placeholder.svg"}
                          alt={`Screenshot ${index + 1}`}
                          className="rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    Add Comment
                  </Button>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {comment.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.user.role}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={bug.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={bug.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {canAssignDeveloper() && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign Developer</label>
                    <Select 
                      value={bug.assignedToId?.toString() || "unassigned"} 
                      onValueChange={handleAssignDeveloper}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {mockDevelopers.map((dev) => (
                          <SelectItem key={dev.id} value={dev.id.toString()}>
                            {dev.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bug Information */}
            <Card>
              <CardHeader>
                <CardTitle>Bug Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Reporter</p>
                    <p className="text-sm text-gray-600">{bug.reporter}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-gray-600">{bug.assignedTo || "Unassigned"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Module</p>
                    <p className="text-sm text-gray-600">{bug.module}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(bug.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(bug.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Duplicate Bug
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                {canDeleteBug() && (
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteBug}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Bug
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
