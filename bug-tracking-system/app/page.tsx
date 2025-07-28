"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bug, Users, CheckCircle, Clock, TrendingUp, Activity, Zap, FileText } from "lucide-react"
import { getUser, fetchBugStats } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalBugs: 0,
    openBugs: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get token from URL if present
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      // Remove token from URL for security
      router.replace('/', { scroll: false })
    }

    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    // Fetch dashboard statistics
    fetchBugStats()
      .then((data: any) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router, searchParams])

  const handleUserManagement = () => {
    router.push("/users")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your bug tracking system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bugs</CardTitle>
              <div className="p-2 bg-blue-200 rounded-full">
                <Bug className="h-4 w-4 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalBugs}</div>
              <p className="text-xs text-gray-500 mt-1">All time reports</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open Bugs</CardTitle>
              <div className="p-2 bg-red-200 rounded-full">
                <Clock className="h-4 w-4 text-red-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.openBugs}</div>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              <div className="p-2 bg-yellow-200 rounded-full">
                <Users className="h-4 w-4 text-yellow-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-gray-500 mt-1">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
              <div className="p-2 bg-green-200 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully fixed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <CardTitle>Quick Actions</CardTitle>
              </div>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === "Reporter" && (
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg" onClick={() => router.push("/bugs/new")}>
                  <Bug className="h-4 w-4 mr-2" />
                  Report New Bug
                </Button>
              )}
              <Button variant="outline" className="w-full hover:bg-gray-50 transition-colors" onClick={() => router.push("/bugs")}>
                <FileText className="h-4 w-4 mr-2" />
                View All Bugs
              </Button>
              {user.role === "Admin" && (
                <Button variant="outline" className="w-full hover:bg-gray-50 transition-colors" onClick={handleUserManagement}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <CardTitle>System Status</CardTitle>
              </div>
              <CardDescription>Current system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">System Online</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">Response Time</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">~50ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-800">Uptime</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
