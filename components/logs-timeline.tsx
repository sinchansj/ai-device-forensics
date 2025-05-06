"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function LogsTimeline() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading timeline...</div>
  }

  const logEvents = [
    {
      time: "2024-05-10 23:17:42",
      event: "Device factory reset attempted",
      details: "User attempted to perform factory reset but was interrupted",
      severity: "high",
    },
    {
      time: "2024-05-09 14:22:05",
      event: "GPS location services disabled",
      details: "Location services manually disabled by user",
      severity: "medium",
    },
    {
      time: "2024-05-08 09:45:33",
      event: "Multiple failed login attempts",
      details: "5 failed login attempts within 10 minutes",
      severity: "medium",
    },
    {
      time: "2024-05-07 18:30:12",
      event: "Secure messaging app installed",
      details: "Installation of Signal messaging application",
      severity: "low",
    },
    {
      time: "2024-05-06 12:15:47",
      event: "Device connected to unknown WiFi",
      details: "Connected to SSID 'PublicWiFi123'",
      severity: "low",
    },
    {
      time: "2024-05-05 22:15:47",
      event: "Browser history cleared",
      details: "Chrome browser history and cookies cleared",
      severity: "medium",
    },
    {
      time: "2024-05-04 16:42:19",
      event: "File deletion detected",
      details: "Multiple image and document files deleted",
      severity: "medium",
    },
    {
      time: "2024-05-03 08:30:55",
      event: "Device powered off for 6 hours",
      details: "Unusual period of inactivity",
      severity: "low",
    },
  ]

  return (
    <div className="h-full w-full overflow-y-auto pr-2">
      <div className="space-y-4">
        {logEvents.map((log, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${
                log.severity === "high" ? "bg-red-500" : log.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
              }`}
            />
            <div className="flex-1">
              <Card className="p-3">
                <p className="font-medium">{log.event}</p>
                <p className="text-sm text-slate-500">{log.time}</p>
                <p className="text-sm mt-2">{log.details}</p>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
