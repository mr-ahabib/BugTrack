"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Bug, 
  Users, 
  Settings, 
  LogOut, 
  User,
  Bell,
  ChevronDown,
  Home,
  FileText
} from "lucide-react"
import { getUser, logout } from "@/lib/api"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const user = getUser()
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (path: string) => pathname === path

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Bugs", href: "/bugs", icon: Bug },
    ...(user.role === "Admin" ? [{ name: "Users", href: "/users", icon: Users }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bug className="h-8 w-8 text-red-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">BugTracker Pro</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.push(item.href)}
                    className={`${
                      isActive(item.href)
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {showNotifications && (
                <Card className="absolute right-0 mt-2 w-80 shadow-lg border-0">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Bug #123</span> was resolved
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Bug #124</span> was assigned to you
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Bug #125</span> needs your attention
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-sm">
                    {user.name?.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showProfileDropdown && (
                <Card className="absolute right-0 mt-2 w-64 shadow-lg border-0">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {user.name?.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="border-t pt-3 space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 