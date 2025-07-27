"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { createBug, getUser } from "@/lib/api"

export default function NewBug() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    module: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
  })
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user can create bugs
    if (user.role !== "Reporter" && user.role !== "Admin") {
      setError("You don't have permission to create bug reports")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createBug(formData)
      alert("Bug report submitted successfully!")
      router.push("/bugs")
    } catch (err: any) {
      setError(err.message || "Failed to submit bug report")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setScreenshots([...screenshots, ...files])
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/bugs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bugs
            </Button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Report New Bug</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Bug Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Bug Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the bug"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    disabled={loading}
                  >
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">Module/Component</Label>
                <Select value={formData.module} onValueChange={(value) => setFormData({ ...formData, module: value })} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the affected module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                    <SelectItem value="Reports">Reports</SelectItem>
                    <SelectItem value="Notifications">Notifications</SelectItem>
                    <SelectItem value="UI/UX">UI/UX</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Bug Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the bug"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                <Textarea
                  id="stepsToReproduce"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                  value={formData.stepsToReproduce}
                  onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                  <Textarea
                    id="expectedBehavior"
                    placeholder="What should happen?"
                    value={formData.expectedBehavior}
                    onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualBehavior">Actual Behavior</Label>
                  <Textarea
                    id="actualBehavior"
                    placeholder="What actually happens?"
                    value={formData.actualBehavior}
                    onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label>Screenshots/Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">Upload screenshots or files</span>
                      <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Uploaded Files */}
                {screenshots.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    <div className="space-y-2">
                      {screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeScreenshot(index)} disabled={loading}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push("/bugs")} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Bug Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
