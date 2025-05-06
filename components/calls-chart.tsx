"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface CallsChartProps {
  detailed?: boolean
}

export default function CallsChart({ detailed = false }: CallsChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading chart...</div>
  }

  const callData = [
    { name: "Apr 15", incoming: 8, outgoing: 5, missed: 1 },
    { name: "Apr 22", incoming: 12, outgoing: 9, missed: 3 },
    { name: "Apr 29", incoming: 15, outgoing: 18, missed: 2 },
    { name: "May 06", incoming: 25, outgoing: 22, missed: 4 },
    { name: "May 13", incoming: 18, outgoing: 14, missed: 1 },
  ]

  const callTypeData = [
    { name: "Incoming", value: 78, color: "#4ade80" },
    { name: "Outgoing", value: 68, color: "#60a5fa" },
    { name: "Missed", value: 11, color: "#f87171" },
    { name: "Blocked", value: 5, color: "#94a3b8" },
  ]

  const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#94a3b8"]

  if (detailed) {
    return (
      <div className="h-full w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="h-full">
            <h3 className="text-sm font-medium mb-4 text-center">Call Activity Over Time</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={callData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" name="Incoming" fill="#4ade80" />
                <Bar dataKey="outgoing" name="Outgoing" fill="#60a5fa" />
                <Bar dataKey="missed" name="Missed" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-full">
            <h3 className="text-sm font-medium mb-4 text-center">Call Types Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={callTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {callTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={callData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="incoming" name="Incoming" fill="#4ade80" />
          <Bar dataKey="outgoing" name="Outgoing" fill="#60a5fa" />
          <Bar dataKey="missed" name="Missed" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
