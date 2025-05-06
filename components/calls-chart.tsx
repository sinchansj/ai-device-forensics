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

interface CallData {
  name: string
  incoming: number
  outgoing: number
  missed: number
}

interface CallTypeData {
  name: string
  value: number
  color: string
}

interface CallsChartProps {
  detailed?: boolean
}

export default function CallsChart({ detailed = false }: CallsChartProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [callData, setCallData] = useState<CallData[]>([])
  const [callTypeData, setCallTypeData] = useState<CallTypeData[]>([])

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const [callActivityResponse, callTypeResponse] = await Promise.all([
          fetch('http://localhost:8000/api/call-data'),
          fetch('http://localhost:8000/api/call-type-data')
        ])

        const callActivityData = await callActivityResponse.json()
        const callTypeData = await callTypeResponse.json()

        setCallData(callActivityData)
        setCallTypeData(callTypeData)
      } catch (error) {
        console.error('Error fetching call data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!mounted || loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading chart...</div>
  }

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
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
