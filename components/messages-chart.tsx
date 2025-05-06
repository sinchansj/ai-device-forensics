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
  const [messageData, setMessageData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messageResponse, hourlyResponse] = await Promise.all([
          fetch('http://localhost:8000/api/message-data'),
          fetch('http://localhost:8000/api/message-hourly')
        ]);
        
        const messageData = await messageResponse.json();
        const hourlyData = await hourlyResponse.json();
        
        setMessageData(messageData);
        setHourlyData(hourlyData);
      } catch (error) {
        console.error('Error fetching message data:', error);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    fetchData();
  }, []);

  if (!mounted || loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading chart...</div>
  }

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
