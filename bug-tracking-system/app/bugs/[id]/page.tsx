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
import { ArrowLeft, Download, Edit, MessageCircle, Calendar, User, Tag, AlertTriangle, Trash2, Bug, FileText, Activity } from "lucide-react"
import { fetchBug, updateBug, deleteBug, addComment, exportBugAsPDF, fetchDevelopers, updateBugAssignment, getUser } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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



export default function BugDetails() {
  const router = useRouter()
  const params = useParams()
  const [bug, setBug] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [developers, setDevelopers] = useState<any[]>([])
  const [developersLoading, setDevelopersLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadBug()
    loadDevelopers()
  }, [mounted, params.id])

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

  const loadDevelopers = async () => {
    try {
      setDevelopersLoading(true)
      console.log('Loading developers...')
      const developersData = await fetchDevelopers()
      console.log('Developers data received:', developersData)
      // Ensure developers is always an array
      const developersArray = Array.isArray(developersData) ? developersData : []
      console.log('Setting developers array:', developersArray)
      setDevelopers(developersArray)
    } catch (err: any) {
      console.error('Failed to load developers:', err)
      setDevelopers([])
    } finally {
      setDevelopersLoading(false)
    }
  }



  const handleAssignDeveloper = async (developerId: string) => {
    try {
      console.log('Assigning developer:', developerId);
      
      // Convert developerId to number or null for unassigned
      const assignedTo = developerId === "unassigned" ? null : parseInt(developerId);
      
      // Call the new API endpoint
      await updateBugAssignment(bug.id, assignedTo);
      
      // Update local state instead of reloading
      const developer = developers.find(d => d.id === parseInt(developerId));
      setBug({
        ...bug,
        assigned_to: developer?.name || null,
        assignedToId: assignedTo
      });
      
      console.log('Developer assignment updated successfully');
    } catch (err: any) {
      console.error('Error assigning developer:', err);
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

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString; // Return raw string during SSR
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }



  const canDeleteBug = () => {
    return user?.role === "Admin"
  }

  const canAssignDeveloper = () => {
    return user?.role === "Admin" || user?.role === "Developer"
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bug details...</p>
        </div>
      </div>
    )
  }

  // Don't render anything that depends on user state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  if (!bug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/bugs")}
              className="rounded-full bg-white/70 shadow-md hover:bg-white/90 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bugs
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <Bug className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight drop-shadow">Bug #{bug.id}</h1>
            </div>
          </div>
          <p className="text-lg text-gray-700 font-medium italic bg-white/60 rounded-xl px-4 py-2 shadow-sm inline-block">{bug.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bug Details */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-200 rounded-full">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                    <CardTitle className="tracking-wide">Bug Details</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {mounted && canDeleteBug() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteBug}
                        className="text-red-600 hover:text-red-700 rounded-full shadow hover:shadow-lg"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800">{error}</span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Title</Label>
                  <p className="text-lg font-medium text-gray-900">{bug.title}</p>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className={statusColors[bug.status as keyof typeof statusColors]}>
                      {bug.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Priority</Label>
                    <Badge className={priorityColors[bug.priority as keyof typeof priorityColors]}>
                      {bug.priority}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-gray-700 bg-white/60 rounded-xl px-4 py-2 shadow-sm">{bug.description}</p>
                </div>

                {/* Steps to Reproduce */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Steps to Reproduce</Label>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-inner border border-gray-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{bug.steps}</pre>
                  </div>
                </div>

                {/* Expected vs Actual Behavior */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Expected Behavior</Label>
                    <p className="text-gray-700 bg-green-50 rounded-xl px-4 py-2 shadow-sm">{bug.expected_behavior}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Actual Behavior</Label>
                    <p className="text-gray-700 bg-red-50 rounded-xl px-4 py-2 shadow-sm">{bug.actual_behavior}</p>
                  </div>
                </div>

                {/* Screenshots */}
                {bug.screenshot_url && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Screenshot</Label>
                    <div className="border rounded-2xl overflow-hidden shadow-lg bg-white/70">
                      {imageError ? (
                        <div className="p-4 text-center">
                          <p className="text-gray-500 mb-2">Image failed to load</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              setImageError(false);
                              setImageLoading(true);
                              
                              // Test if image is accessible via proxy
                              try {
                                const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(bug.screenshot_url)}`;
                                const response = await fetch(proxyUrl, { method: 'HEAD' });
                                if (response.ok) {
                                  // Force re-render with proxy
                                  const img = document.querySelector('img[src="' + proxyUrl + '"]');
                                  if (img) img.src = proxyUrl;
                                }
                              } catch (error) {
                                // Silent error handling
                              } finally {
                                setImageLoading(false);
                              }
                            }}
                            disabled={imageLoading}
                          >
                            {imageLoading ? 'Testing...' : 'Retry'}
                          </Button>
                          <p className="text-xs text-gray-400 mt-2">{bug.screenshot_url}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(bug.screenshot_url, '_blank')}
                          >
                            Open in New Tab
                          </Button>
                        </div>
                      ) : (
                        <img 
                          src={`/api/image-proxy?url=${encodeURIComponent(bug.screenshot_url)}`} 
                          alt="Bug Screenshot" 
                          className="w-full h-auto"
                          onLoad={() => {
                            setImageError(false);
                          }}
                          onError={(e) => {
                            setImageError(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}


              </CardContent>
            </Card>

            {/* Comments Timeline */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="tracking-wide">Comments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-white/50"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow">
                      Add Comment
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments Timeline */}
                <div className="relative ml-4 before:absolute before:top-0 before:left-4 before:bottom-0 before:w-1 before:bg-gradient-to-b from-green-200 to-green-400 before:rounded-full">
                  {comments.map((comment, idx) => (
                    <div key={comment.id} className="flex gap-3 mb-8 relative group">
                      <div className="z-10">
                        <Avatar className="h-10 w-10 shadow-lg ring-2 ring-green-400">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {comment.user.name.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-green-900">{comment.user.name}</span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {comment.user.role}
                          </Badge>
                          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-white/80 rounded-2xl px-5 py-3 shadow-md border border-green-100 relative">
                          <span className="block text-sm text-gray-700 leading-relaxed">{comment.text}</span>
                          <span className="absolute left-[-18px] top-4 w-4 h-4 bg-green-200 rounded-full border-2 border-white"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bug Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Tag className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle>Bug Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-600">Created</p>
                    <p className="font-medium">{formatDate(bug.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-600">Reporter</p>
                    <p className="font-medium">{bug.reporter || `User ID: ${bug.user_id}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-600">Module</p>
                    <p className="font-medium">{bug.module}</p>
                  </div>
                </div>
                {bug.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-medium">{formatDate(bug.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment */}
            {mounted && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <CardTitle>Assignment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mounted && canAssignDeveloper() ? (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Assign To</Label>
                      {developersLoading ? (
                        <div className="text-sm text-gray-500">Loading developers...</div>
                      ) : (
                        <>
                          <div className="text-xs text-gray-500 mb-2">
                            Debug: {developers.length} developers loaded
                          </div>
                          <Select
                            value={bug.assignedToId?.toString() || "unassigned"}
                            onValueChange={handleAssignDeveloper}
                          >
                            <SelectTrigger className="bg-white/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {Array.isArray(developers) && developers.map((developer) => (
                                <SelectItem key={developer.id} value={developer.id.toString()}>
                                  {developer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-medium">{bug.assigned_to || "Unassigned"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Download className="h-4 w-4 text-yellow-600" />
                  </div>
                  <CardTitle>Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Actions can be added here in the future */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
