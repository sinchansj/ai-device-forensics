"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wifi, ShieldAlert, ShieldCheck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NetworkSecurity {
  name: string
  value: number
  color: string
}

interface Network {
  ssid: string
  security: string
  raw_security: string
}

export default function NetworkAnalysis() {
  const [securityData, setSecurityData] = useState<NetworkSecurity[]>([])
  const [networkList, setNetworkList] = useState<Network[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch security distribution data
        const securityRes = await fetch('http://localhost:8000/api/network-security')
        const securityData = await securityRes.json()
        
        // Fetch network list
        const networksRes = await fetch('http://localhost:8000/api/network-list')
        const networksData = await networksRes.json()
        
        setSecurityData(securityData)
        setNetworkList(networksData)
      } catch (error) {
        console.error("Error fetching network data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSecurityIcon = (securityType: string) => {
    switch (securityType) {
      case 'WPA3':
      case 'WPA2':
        return <ShieldCheck className="h-4 w-4 text-green-500" />
      case 'Open':
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      default:
        return <Wifi className="h-4 w-4 text-blue-500" />
    }
  }

  const getSecurityBadge = (securityType: string) => {
    switch (securityType) {
      case 'WPA3':
        return <Badge className="bg-blue-500">WPA3</Badge>
      case 'WPA2':
        return <Badge className="bg-green-500">WPA2</Badge>
      case 'OWE':
        return <Badge className="bg-yellow-500">OWE</Badge>
      case 'Open':
        return <Badge variant="destructive">Open</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

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

  return (
    <div>
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="networks">Network List</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-4">Security Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={securityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {securityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-4">Security Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <h4 className="font-medium flex items-center gap-2 text-amber-800">
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                      Open Networks
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      {securityData.find(s => s.name === 'Open')?.value || 0} unsecured networks detected. 
                      Connection to these networks poses a security risk.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <h4 className="font-medium flex items-center gap-2 text-blue-800">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      Network Diversity
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Device has connected to {networkList.length} different networks,
                      suggesting significant mobility or network scanning activity.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <h4 className="font-medium flex items-center gap-2 text-green-800">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      Secure Connections
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      {
                        (securityData.find(s => s.name === 'WPA2')?.value || 0) + 
                        (securityData.find(s => s.name === 'WPA3')?.value || 0)
                      } secure networks (WPA2/WPA3) identified in device history.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networks">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">Detected Networks ({networkList.length})</h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {networkList.map((network, i) => (
                    <div 
                      key={i} 
                      className="p-3 border rounded-md flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        {getSecurityIcon(network.security)}
                        <div>
                          <h4 className="font-medium">{network.ssid}</h4>
                          <p className="text-xs text-slate-500">{network.raw_security}</p>
                        </div>
                      </div>
                      {getSecurityBadge(network.security)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}