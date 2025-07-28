import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

// Dynamically import navbar to reduce initial bundle size
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: true,
  loading: () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
      </div>
    </nav>
  )
})

export const metadata: Metadata = {
  title: "BugTracker Pro - Bug Reporting & Feedback System",
  description: "A comprehensive bug tracking and feedback management system for development teams",
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: "BugTracker Pro",
    description: "Bug tracking and feedback management system",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BugTracker Pro",
    description: "Bug tracking and feedback management system",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}
