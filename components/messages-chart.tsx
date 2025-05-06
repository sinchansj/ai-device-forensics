"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts"

interface MessagesChartProps {
  detailed?: boolean
}

export default function MessagesChart({ detailed = false }: MessagesChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading chart...</div>
  }

  const messageData = [
    { name: "Apr 15", sent: 45, received: 52 },
    { name: "Apr 22", sent: 58, received: 63 },
    { name: "Apr 29", sent: 87, received: 92 },
    { name: "May 06", sent: 125, received: 138 },
    { name: "May 13", sent: 95, received: 105 },
  ]

  const hourlyData = [
    { hour: "00:00", count: 12 },
    { hour: "03:00", count: 5 },
    { hour: "06:00", count: 8 },
    { hour: "09:00", count: 45 },
    { hour: "12:00", count: 78 },
    { hour: "15:00", count: 92 },
    { hour: "18:00", count: 65 },
    { hour: "21:00", count: 38 },
  ]

  if (detailed) {
    return (
      <div className="h-full w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="h-full">
            <h3 className="text-sm font-medium mb-4 text-center">Message Volume Over Time</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={messageData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" name="Sent" stroke="#60a5fa" strokeWidth={2} />
                <Line type="monotone" dataKey="received" name="Received" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-full">
            <h3 className="text-sm font-medium mb-4 text-center">Message Activity by Hour</h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Messages" fill="#818cf8" stroke="#4f46e5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={messageData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sent" name="Sent" stroke="#60a5fa" strokeWidth={2} />
          <Line type="monotone" dataKey="received" name="Received" stroke="#4ade80" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
