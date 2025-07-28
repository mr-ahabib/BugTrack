"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Send, AlertCircle } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/bugs")} className="hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bugs
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent ml-4">
              Report New Bug
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Report a Bug
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Help us improve by reporting any issues you encounter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error:</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-medium">Bug Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the bug"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      disabled={loading}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-slate-700 font-medium">Priority *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
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
                  <Label htmlFor="module" className="text-slate-700 font-medium">Module/Component</Label>
                  <Select value={formData.module} onValueChange={(value) => setFormData({ ...formData, module: value })} disabled={loading}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
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
              </div>

              {/* Bug Description */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Bug Description
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-medium">Bug Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the bug"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    disabled={loading}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce" className="text-slate-700 font-medium">Steps to Reproduce</Label>
                  <Textarea
                    id="stepsToReproduce"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                    value={formData.stepsToReproduce}
                    onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                    rows={4}
                    disabled={loading}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Behavior Comparison */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Expected vs Actual Behavior
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedBehavior" className="text-slate-700 font-medium">Expected Behavior</Label>
                    <Textarea
                      id="expectedBehavior"
                      placeholder="What should happen?"
                      value={formData.expectedBehavior}
                      onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                      rows={3}
                      disabled={loading}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actualBehavior" className="text-slate-700 font-medium">Actual Behavior</Label>
                    <Textarea
                      id="actualBehavior"
                      placeholder="What actually happens?"
                      value={formData.actualBehavior}
                      onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                      rows={3}
                      disabled={loading}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Attachments
                </h3>
                
                <div className="space-y-4">
                  <Label className="text-slate-700 font-medium">Screenshots/Attachments</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors duration-200">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <div className="space-y-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="block text-lg font-medium text-slate-900">Upload screenshots or files</span>
                        <span className="block text-sm text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</span>
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
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-medium">Uploaded Files:</Label>
                      <div className="space-y-2">
                        {screenshots.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-sm text-slate-700">{file.name}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeScreenshot(index)} disabled={loading} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => router.push("/bugs")} disabled={loading} className="border-slate-300 hover:bg-slate-50">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Bug Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
