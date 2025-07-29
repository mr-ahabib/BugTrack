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
import { ArrowLeft, Upload, X, Bug, FileText, AlertCircle } from "lucide-react"
import { createBug, getUser } from "@/lib/api"

export default function NewBug() {
  const router = useRouter()
  
  // Debug: Log environment variable
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');
  
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
    console.log('Form submit triggered');
    
    // Check if user is logged in
    const user = getUser()
    console.log('Current user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push("/login")
      return
    }

    // Check if user can create bugs
    if (user.role !== "Reporter") {
      console.log('User role not allowed:', user.role);
      setError("You don't have permission to create bug reports")
      return
    }

    // Validate required fields
    const requiredFields = ['title', 'module', 'description', 'stepsToReproduce', 'expectedBehavior', 'actualBehavior'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true)
    setError(null)

    console.log('Form submission started with data:', formData);
    console.log('Screenshots:', screenshots);

    try {
      console.log('Calling createBug API...');
      await createBug(formData, screenshots)
      console.log('API call successful');
      alert("Bug report submitted successfully!")
      router.push("/bugs")
    } catch (err: any) {
      console.error('Error submitting bug:', err);
      setError(err.message || "Failed to submit bug report")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    console.log('Files selected:', files);
    setScreenshots([...screenshots, ...files])
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/bugs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bugs
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <Bug className="h-4 w-4 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Report New Bug</h1>
            </div>
          </div>
          <p className="text-gray-600">Provide detailed information about the bug you've encountered</p>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle>Bug Report Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Debug Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Debug Info:</h4>
                <div className="text-sm text-blue-700">
                  <p>Title: {formData.title || 'Not set'}</p>
                  <p>Module: {formData.module || 'Not set'}</p>
                  <p>Priority: {formData.priority}</p>
                  <p>Description: {formData.description ? 'Set' : 'Not set'}</p>
                  <p>Steps: {formData.stepsToReproduce ? 'Set' : 'Not set'}</p>
                  <p>Expected: {formData.expectedBehavior ? 'Set' : 'Not set'}</p>
                  <p>Actual: {formData.actualBehavior ? 'Set' : 'Not set'}</p>
                  <p>Files: {screenshots.length}</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Bug Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the bug"
                    className="bg-white/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module">Module *</Label>
                  <Select value={formData.module} onValueChange={(value) => {
                    console.log('Module selected:', value);
                    setFormData({ ...formData, module: value });
                  }}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Authentication">Authentication</SelectItem>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="Reports">Reports</SelectItem>
                      <SelectItem value="User Management">User Management</SelectItem>
                      <SelectItem value="Notifications">Notifications</SelectItem>
                      <SelectItem value="UI/UX">UI/UX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="bg-white/50">
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

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the bug"
                  rows={4}
                  className="bg-white/50"
                  required
                />
              </div>

              {/* Steps to Reproduce */}
              <div className="space-y-2">
                <Label htmlFor="stepsToReproduce">Steps to Reproduce *</Label>
                <Textarea
                  id="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                  rows={4}
                  className="bg-white/50"
                  required
                />
              </div>

              {/* Expected vs Actual Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedBehavior">Expected Behavior *</Label>
                  <Textarea
                    id="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                    placeholder="What should happen?"
                    rows={3}
                    className="bg-white/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualBehavior">Actual Behavior *</Label>
                  <Textarea
                    id="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                    placeholder="What actually happens?"
                    rows={3}
                    className="bg-white/50"
                    required
                  />
                </div>
              </div>

              {/* Screenshots */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Screenshots (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload screenshots or files</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                {screenshots.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScreenshot(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/bugs")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/createBug`, {
                        method: 'GET'
                      });
                      console.log('API test response:', response.status);
                      alert(`API is reachable! Status: ${response.status}`);
                    } catch (error) {
                      console.error('API test failed:', error);
                      alert('API test failed: ' + error);
                    }
                  }}
                >
                  Test API
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
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
