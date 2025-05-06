"use client"

import { useEffect, useState } from "react"

export default function AiSmsAnalysis() {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/sms-analysis')
        
        if (!response.ok) {
          throw new Error('Failed to fetch SMS analysis')
        }
        
        const data = await response.json()
        setAnalysis(data.analysis || "No analysis available")
      } catch (err) {
        console.error("Error fetching SMS analysis:", err)
        setError((err as Error).message || 'Error fetching analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-[90%] bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-[95%] bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-[85%] bg-slate-200 animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading SMS analysis: {error}</div>
  }

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
        {analysis}
      </p>
    </div>
  )
}