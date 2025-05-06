"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react"

export default function AiSummary() {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div>
      <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            The AI analysis has identified several patterns of interest in this device. Communication frequency
            increased significantly between April 29 and May 10, with a notable spike in secure messaging app usage. The
            device shows evidence of attempted data deletion and multiple security-conscious behaviors including browser
            history clearing and location services manipulation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Suspicious Activity</span>
                </div>
                <p className="text-sm text-amber-700">12 suspicious events detected</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Data Recovery</span>
                </div>
                <p className="text-sm text-green-700">87% of deleted data recovered</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Location Data</span>
                </div>
                <p className="text-sm text-blue-700">5 significant locations identified</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="space-y-3">
            {[
              {
                title: "Unusual Activity Pattern",
                description: "Device shows abnormal usage patterns between 1AM-4AM for 7 consecutive days",
                severity: "high",
              },
              {
                title: "Data Deletion",
                description: "Mass deletion of messages and files on May 5th",
                severity: "high",
              },
              {
                title: "Security Changes",
                description: "Multiple changes to security settings in short timeframe",
                severity: "medium",
              },
              {
                title: "App Installation Pattern",
                description: "Installation and immediate use of secure communication apps",
                severity: "medium",
              },
              {
                title: "Network Behavior",
                description: "Connection to multiple unknown WiFi networks",
                severity: "low",
              },
            ].map((anomaly, i) => (
              <Card key={i} className="p-4 border-l-4 border-l-slate-400">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          anomaly.severity === "high"
                            ? "bg-red-500"
                            : anomaly.severity === "medium"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }`}
                      />
                      {anomaly.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{anomaly.description}</p>
                  </div>
                  <Badge
                    variant={
                      anomaly.severity === "high"
                        ? "destructive"
                        : anomaly.severity === "medium"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {anomaly.severity}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Location map visualization</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                location: "Downtown Financial District",
                visits: 7,
                lastVisit: "May 10, 2024",
                significance: "high",
              },
              {
                location: "Harbor Warehouse Area",
                visits: 3,
                lastVisit: "May 8, 2024",
                significance: "high",
              },
              {
                location: "Westside Residential Complex",
                visits: 5,
                lastVisit: "May 7, 2024",
                significance: "medium",
              },
              {
                location: "North Industrial Park",
                visits: 2,
                lastVisit: "May 3, 2024",
                significance: "medium",
              },
              {
                location: "Airport Terminal B",
                visits: 1,
                lastVisit: "April 29, 2024",
                significance: "low",
              },
            ].map((loc, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{loc.location}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Visited {loc.visits} times • Last visit: {loc.lastVisit}
                    </p>
                  </div>
                  <Badge
                    variant={
                      loc.significance === "high" ? "default" : loc.significance === "medium" ? "outline" : "secondary"
                    }
                  >
                    {loc.significance}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="space-y-3">
            {[
              {
                name: "Unknown Contact #1",
                number: "+1 (555) 123-4567",
                interactions: 42,
                type: "Calls & Messages",
                significance: "high",
              },
              {
                name: "Unknown Contact #2",
                number: "+1 (555) 987-6543",
                interactions: 28,
                type: "Messages only",
                significance: "high",
              },
              {
                name: "John Smith",
                number: "+1 (555) 555-5555",
                interactions: 15,
                type: "Calls only",
                significance: "medium",
              },
              {
                name: "Mary Johnson",
                number: "+1 (555) 222-3333",
                interactions: 12,
                type: "Calls & Messages",
                significance: "medium",
              },
              {
                name: "David Williams",
                number: "+1 (555) 444-5555",
                interactions: 9,
                type: "Messages only",
                significance: "low",
              },
            ].map((contact, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-slate-600">{contact.number}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {contact.interactions} interactions • {contact.type}
                    </p>
                  </div>
                  <Badge
                    variant={
                      contact.significance === "high"
                        ? "default"
                        : contact.significance === "medium"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {contact.significance}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
