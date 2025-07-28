"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bug, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

// API URL - using the URL from .env file
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  
  // Debug: Log the API URL
  console.log('API_URL from env:', process.env.NEXT_PUBLIC_API_URL)
  console.log('Final API_URL:', API_URL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log('Attempting login to:', `${API_URL}/login`)
      const requestBody = {
        email: formData.email,
        password: formData.password,
      }
      console.log('Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorData
        try {
          const responseText = await response.text()
          console.log('Response text:', responseText)
          errorData = JSON.parse(responseText)
        } catch (e) {
          console.log('Failed to parse response as JSON:', e)
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.message || `HTTP ${response.status}: Login failed`)
      }

      const data = await response.json()
      console.log('Login successful:', data)
      
      // Store token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      console.log("token", data.token)
      
      // Navigate to dashboard with token
      router.push('/')
    } catch (err: any) {
      console.error('Login error:', err)
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      setError(err.message || "Login failed - check if API server is running")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bug className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign in to BugTracker</CardTitle>
          <CardDescription>Enter your credentials to access the bug tracking system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Developer:</strong> dev@example.com / 1234
              </p>
              <p>
                <strong>Note:</strong> Use the credentials that work in your backend
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
