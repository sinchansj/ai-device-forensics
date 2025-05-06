"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HiddenFile {
  path: string
  size: number
  modified: string
  owner: string
  permissions: string
  content_analysis: string
  severity: string
}

export default function HiddenFilesTimeline() {
  const [mounted, setMounted] = useState(false)
  const [hiddenFiles, setHiddenFiles] = useState<HiddenFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hidden-files')
        if (response.ok) {
          const data = await response.json()
          setHiddenFiles(data)
        } else {
          console.error("Failed to fetch hidden files data")
        }
      } catch (error) {
        console.error("Error fetching hidden files:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format file size for display
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // Simplified date formatting without date-fns
  const formatModifiedDate = (modified: string): string => {
    if (!modified || modified === "Unknown") return "Unknown"
    
    // Just return the original string, or you can do basic formatting here
    return modified
  }

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading timeline...</div>
  }

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading hidden files data...</div>
  }

  return (
    <div className="h-full w-full overflow-y-auto pr-2">
      <div className="space-y-4">
        {hiddenFiles.length === 0 ? (
          <div className="text-center p-6 text-slate-500">No hidden files found in the analysis</div>
        ) : (
          hiddenFiles.map((file, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${
                  file.severity === "high" ? "bg-red-500" : file.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <Card className="p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="font-mono text-sm font-medium truncate max-w-lg">
                      {file.path || "Unknown path"}
                    </div>
                    <Badge
                      variant={
                        file.severity === "high"
                          ? "destructive"
                          : file.severity === "medium"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {file.severity}
                    </Badge>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Size:</span> {formatFileSize(file.size)}
                    </div>
                    <div>
                      <span className="text-slate-500">Modified:</span> {formatModifiedDate(file.modified)}
                    </div>
                    <div>
                      <span className="text-slate-500">Owner:</span> {file.owner || "Unknown"}
                    </div>
                    <div>
                      <span className="text-slate-500">Permissions:</span> {file.permissions || "Unknown"}
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="text-slate-500">Analysis:</span>{" "}
                    <span className="text-slate-700">{file.content_analysis}</span>
                  </div>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}