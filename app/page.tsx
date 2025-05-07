'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Phone,
  MessageSquare,
  Brain,
  Download,
  Calendar,
  Clock,
  User,
  Shield,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import CallsChart from "@/components/calls-chart"
import MessagesChart from "@/components/messages-chart"
import LogsTimeline from "@/components/logs-timeline"
import AiSummary from "@/components/ai-summary"
import DeviceInfo from "@/components/device-info"
import AiSmsAnalysis from "@/components/ai-sms-analysis"
import HiddenFilesTimeline from "@/components/hidden-files-timeline"
import { useTopContacts } from "@/lib/utils"
import AiReport from "@/components/ai-report"

export default function Home() {
  const [stats, setStats] = useState({
    calls: 0,
    messages: 0,
    hiddenFiles: 0
  });
  
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch('http://localhost:8000/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          calls: data.call_count,
          messages: data.message_count,
          hiddenFiles: data.hidden_files_count
        });
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-slate-800" />
            <h1 className="text-xl font-bold text-slate-800">Android Forensics Report</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Generated: May 8, 2024</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Case #DF-2024-0517</span>
            </Badge>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DeviceInfo />

          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Investigation Summary</CardTitle>
              <CardDescription>Key findings from the Android device analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Analysis Progress</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-100 rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-5 w-5 text-slate-700" />
                      <span className="font-medium">Calls</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.calls}</span>
                    <span className="text-sm text-slate-500">Total calls analyzed</span>
                  </div>

                  <div className="bg-slate-100 rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-slate-700" />
                      <span className="font-medium">Messages</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.messages}</span>
                    <span className="text-sm text-slate-500">Total messages analyzed</span>
                  </div>

                  <div className="bg-slate-100 rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Hidden Files</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.hiddenFiles}</span>
                    <span className="text-sm text-slate-500">Found in analysis</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Hidden Files</TabsTrigger>
            <TabsTrigger value="ai-report">AI Report</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Call Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <CallsChart />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm flex items-center gap-1"
                      onClick={() => setActiveTab("calls")}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <MessagesChart />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm flex items-center gap-1"
                      onClick={() => setActiveTab("messages")}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Network Security Analysis</CardTitle>
                <CardDescription>Analysis of detected wireless networks</CardDescription>
              </CardHeader>
              <CardContent>
                <AiSummary />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Call Analysis</CardTitle>
                <CardDescription>Detailed breakdown of call patterns and contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="h-80">
                    <CallsChart detailed={true} />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Top Contacts</h3>
                    <div className="space-y-2">
                      {useTopContacts().data.map((contact, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-slate-500">{contact.number}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{contact.count} calls</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Analysis</CardTitle>
                <CardDescription>Text message patterns and content analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="h-80">
                    <MessagesChart detailed={true} />
                  </div>

                  <Separator />

                  <div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Message Analysis</h3>
                      <AiSmsAnalysis />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Hidden Files Analysis</CardTitle>
                <CardDescription>Suspicious and hidden files detected on the device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-96">
                    <HiddenFilesTimeline />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Notable Hidden Files</h3>
                    <div className="space-y-3">
                      {[
                        { name: ".nomedia files", description: "Used to hide media from gallery apps", severity: "low" },
                        { name: "Hidden zip archives", description: "Multiple encrypted zip files found", severity: "medium" },
                        { name: "Base64 encoded content", description: "Possibly obfuscated data", severity: "medium" },
                        { name: "Hidden configuration files", description: "Application settings with stored credentials", severity: "high" },
                        { name: "System logs with PII", description: "Personal information found in hidden logs", severity: "medium" },
                      ].map((file, i) => (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              file.severity === "high"
                                ? "bg-red-500"
                                : file.severity === "medium"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-slate-500">{file.description}</p>
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
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-report">
            <Card>
              <CardHeader>
                <CardTitle>AI Forensic Report</CardTitle>
                <CardDescription>Comprehensive analysis generated by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <AiReport />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
