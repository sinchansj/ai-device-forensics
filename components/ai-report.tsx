"use client"

import { useEffect, useState } from "react"

interface AIReport {
  executive_summary: string[];
  key_findings: string[];
  recommended_next_steps: string[];
  timeline_of_significant_events: Array<{
    date: string;
    event: string;
  }>;
  error?: string;
}

export default function AiReport() {
  const [report, setReport] = useState<AIReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/ai-report')
        
        if (!response.ok) {
          throw new Error('Failed to fetch AI report')
        }
        
        const data = await response.json()
        setReport(data)
      } catch (err) {
        console.error("Error fetching AI report:", err)
        setError((err as Error).message || 'Error fetching report')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-slate-100 animate-pulse rounded-lg h-40"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-5 bg-slate-100 animate-pulse rounded w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !report) {
    return <div className="text-red-500">Error loading AI report: {error || "Report data is missing"}</div>
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-lg font-medium mb-4">Executive Summary</h3>
        {report.executive_summary.map((paragraph, i) => (
          <p key={i} className="text-slate-700 leading-relaxed mb-3">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Key Findings</h3>
          <ul className="space-y-2">
            {report.key_findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-slate-800 flex-shrink-0" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recommendations</h3>
          <ul className="space-y-2">
            {report.recommended_next_steps.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-slate-800 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-lg font-medium mb-4">Timeline of Significant Events</h3>
        <div className="space-y-4">
          {report.timeline_of_significant_events.map((item, i) => (
            <div key={i} className="border-l-2 border-slate-300 pl-4 pb-2">
              <h4 className="font-medium">{item.date}</h4>
              <p className="mt-1 text-slate-600">
                {item.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}