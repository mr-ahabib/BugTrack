"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Search, UserPlus, Edit, Trash2, AlertTriangle, Users, Shield, Activity } from "lucide-react"
import { getUser } from "@/lib/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"

// Define user interface
interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  username: string
  bugsReported?: number
  bugsAssigned?: number
  joinedAt?: string
  lastActive?: string
}

const roleColors = {
  Admin: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
  Developer: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
  Reporter: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
}

const statusColors = {
  Active: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
  Inactive: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200",
}

export default function UsersManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Fetch users from real API
  const fetchUsersFromAPI = async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found. Please login again.')
      }

      const endpoint = `${API_URL}/alluser`
      console.log('Making API call to:', endpoint)
      console.log('Token:', token ? 'Available' : 'Missing')

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Handle different response formats
      let usersData: User[]
      if (Array.isArray(data)) {
        usersData = data
      } else if (data.users && Array.isArray(data.users)) {
        usersData = data.users
      } else if (data.data && Array.isArray(data.data)) {
        usersData = data.data
      } else {
        console.error('Unexpected data format:', data)
        throw new Error('Invalid data format received from API')
      }

      return usersData
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // Load users function
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading users from API...')
      
      const usersData = await fetchUsersFromAPI()
      console.log('Users loaded:', usersData)
      
      setUsers(usersData)
      console.log(`Successfully loaded ${usersData.length} users from API`)
    } catch (err: any) {
      console.error('Error loading users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update user via API
  const updateUser = async (userId: number, userData: Partial<User>): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('User updated successfully')
    } catch (error: any) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Delete user via API
  const deleteUserFromAPI = async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('User deleted successfully')
    } catch (error: any) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingUser) return

    try {
      await updateUser(editingUser.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      })

      // Update the user in the local state
      setUsers(users.map((user) => 
        user.id === editingUser.id 
          ? { ...user, name: editForm.name, email: editForm.email, role: editForm.role }
          : user
      ))

      setIsEditDialogOpen(false)
      setEditingUser(null)
      setEditForm({ name: "", email: "", role: "" })
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditDialogOpen(false)
    setEditingUser(null)
    setEditForm({ name: "", email: "", role: "" })
  }

  useEffect(() => {
    console.log('useEffect triggered - checking authentication and loading users')
    
    const currentUser = getUser()
    if (!currentUser) {
      console.log('No current user found, redirecting to login')
      router.push("/login")
      return
    }
    
    // Only Admin can access user management
    if (currentUser.role !== "Admin") {
      console.log('User is not Admin, redirecting to dashboard')
      router.push("/")
      return
    }
    
    setUser(currentUser)
    console.log('User authenticated as Admin:', currentUser.name)
    
    // Check if token exists and load users
    const token = localStorage.getItem('token')
    if (token) {
      console.log('Token found, loading users...')
      loadUsers()
    } else {
      console.log('No token found, redirecting to login')
      setError('No authentication token found. Please login again.')
      router.push("/login")
    }
  }, [])

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await deleteUserFromAPI(userId)
      setUsers(users.filter((user) => user.id !== userId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
    const matchesRole = filters.role === "all" || user.role === filters.role

    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading users...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== "Admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don't have permission to access user management.</p>
          <Button onClick={() => router.push("/")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                User Management
              </h1>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Edit User
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">
                  Role
                </label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Reporter">Reporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCancelEdit} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="h-5 w-5 text-blue-600" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Reporter">Reporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Users className="h-5 w-5 text-blue-600" />
              Users ({filteredUsers.length} found)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-4">
                  {users.length === 0 
                    ? "No users have been loaded from the API." 
                    : "No users match the current filters."}
                </p>
                {users.length === 0 && (
                  <Button onClick={loadUsers} variant="outline">
                    Try Loading Users Again
                  </Button>
                )}
              </div>
            )}
            
            {filteredUsers.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-700 font-semibold">User</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Email</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Role</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-200 hover:bg-slate-50/80 transition-colors duration-200">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-slate-700">{user.email}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role as keyof typeof roleColors]}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditUser(user)}
                              className="border-slate-300 hover:bg-slate-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
