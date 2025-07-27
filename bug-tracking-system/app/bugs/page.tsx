"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bug, Search, Filter, Plus, ArrowLeft, Download } from "lucide-react"
import { fetchBugs, getUser } from "@/lib/api"

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

export default function BugsList() {
  const router = useRouter()
  const [bugs, setBugs] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    module: "all",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadBugs()
  }, [])

  const loadBugs = async () => {
    try {
      setLoading(true)
      setError(null)
      const bugsData = await fetchBugs(filters)
      setBugs(bugsData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadBugs()
    }
  }, [filters, user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getRoleBasedTitle = () => {
    if (!user) return "All Bugs"
    switch (user.role) {
      case "Reporter":
        return "My Bug Reports"
      case "Developer":
        return "Assigned Bugs"
      case "Admin":
        return "All Bugs"
      default:
        return "All Bugs"
    }
  }

  const canCreateBug = () => {
    return user?.role === "Reporter" || user?.role === "Admin"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bugs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Bug className="h-6 w-6 text-red-600" />
                <h1 className="text-xl font-bold text-gray-900">{getRoleBasedTitle()}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {canCreateBug() && (
                <Button onClick={() => router.push("/bugs/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Bug
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bugs..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Module</label>
                <Select value={filters.module} onValueChange={(value) => setFilters({ ...filters, module: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                    <SelectItem value="Reports">Reports</SelectItem>
                    <SelectItem value="Notifications">Notifications</SelectItem>
                    <SelectItem value="UI/UX">UI/UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <Bug className="h-4 w-4" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Bug Reports ({bugs.length} found)</CardTitle>
          </CardHeader>
          <CardContent>
            {bugs.length === 0 ? (
              <div className="text-center py-8">
                <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bugs found</h3>
                <p className="text-gray-600 mb-4">
                  {user?.role === "Reporter" 
                    ? "You haven't reported any bugs yet." 
                    : user?.role === "Developer"
                    ? "No bugs are currently assigned to you."
                    : "No bugs match your current filters."
                  }
                </p>
                {user?.role === "Reporter" && (
                  <Button onClick={() => router.push("/bugs/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Report Your First Bug
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bugs.map((bug) => (
                      <TableRow key={bug.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">#{bug.id}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{bug.title}</p>
                            <p className="text-sm text-gray-500 truncate">{bug.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[bug.priority as keyof typeof priorityColors]}>
                            {bug.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[bug.status as keyof typeof statusColors]}>{bug.status}</Badge>
                        </TableCell>
                        <TableCell>{bug.reporter}</TableCell>
                        <TableCell>{bug.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{bug.module}</TableCell>
                        <TableCell>{formatDate(bug.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/bugs/${bug.id}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
