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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-slate-800" />
            <h1 className="text-xl font-bold text-slate-800">Digital Forensics Report</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Generated: May 16, 2024</span>
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
                    <span className="text-2xl font-bold">247</span>
                    <span className="text-sm text-slate-500">Total calls analyzed</span>
                  </div>

                  <div className="bg-slate-100 rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-slate-700" />
                      <span className="font-medium">Messages</span>
                    </div>
                    <span className="text-2xl font-bold">1,893</span>
                    <span className="text-sm text-slate-500">Total messages analyzed</span>
                  </div>

                  <div className="bg-slate-100 rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Alerts</span>
                    </div>
                    <span className="text-2xl font-bold">12</span>
                    <span className="text-sm text-slate-500">Suspicious activities</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Log Files</TabsTrigger>
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
                    <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
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
                    <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Forensic Insights
                </CardTitle>
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
                      {[
                        { name: "John Smith", number: "+1 (555) 123-4567", count: 42 },
                        { name: "Mary Johnson", number: "+1 (555) 987-6543", count: 28 },
                        { name: "Unknown", number: "+1 (555) 555-5555", count: 15 },
                        { name: "David Williams", number: "+1 (555) 222-3333", count: 12 },
                        { name: "Sarah Davis", number: "+1 (555) 444-5555", count: 9 },
                      ].map((contact, i) => (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Key Phrases</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "meeting tomorrow",
                          "send money",
                          "call me back",
                          "don't tell",
                          "new number",
                          "delete this",
                          "password is",
                          "secret",
                          "location",
                          "evidence",
                        ].map((phrase, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            {phrase}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Message Sentiment</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Positive</span>
                            <span className="text-sm">32%</span>
                          </div>
                          <Progress value={32} className="h-2 bg-slate-200" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Neutral</span>
                            <span className="text-sm">45%</span>
                          </div>
                          <Progress value={45} className="h-2 bg-slate-200" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Negative</span>
                            <span className="text-sm">23%</span>
                          </div>
                          <Progress value={23} className="h-2 bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Log File Analysis</CardTitle>
                <CardDescription>System and application logs from the device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-96">
                    <LogsTimeline />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Notable Events</h3>
                    <div className="space-y-3">
                      {[
                        { time: "2024-05-10 23:17:42", event: "Device factory reset attempted", severity: "high" },
                        { time: "2024-05-09 14:22:05", event: "GPS location services disabled", severity: "medium" },
                        { time: "2024-05-08 09:45:33", event: "Multiple failed login attempts", severity: "medium" },
                        { time: "2024-05-07 18:30:12", event: "Secure messaging app installed", severity: "low" },
                        { time: "2024-05-05 22:15:47", event: "Browser history cleared", severity: "medium" },
                      ].map((log, i) => (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              log.severity === "high"
                                ? "bg-red-500"
                                : log.severity === "medium"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{log.event}</p>
                            <p className="text-sm text-slate-500">{log.time}</p>
                          </div>
                          <Badge
                            variant={
                              log.severity === "high"
                                ? "destructive"
                                : log.severity === "medium"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {log.severity}
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
                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-medium mb-4">Executive Summary</h3>
                    <p className="text-slate-700 leading-relaxed">
                      The forensic analysis of the Android device reveals a pattern of suspicious activities between
                      April 15 and May 10, 2024. The device shows evidence of attempted data deletion, installation of
                      secure messaging applications, and communication patterns consistent with covert operations.
                      Location data indicates the device was present at several locations of interest during the
                      investigation timeframe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Key Findings</h3>
                      <ul className="space-y-2">
                        {[
                          "Evidence of deleted messages recovered from database",
                          "Pattern of communication with 3 unidentified numbers",
                          "Location data places device at all sites of interest",
                          "Secure messaging apps installed and used extensively",
                          "Multiple attempts to clear device history and logs",
                          "Unusual pattern of device activation during night hours",
                        ].map((finding, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-slate-800 flex-shrink-0" />
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Recommendations</h3>
                      <ul className="space-y-2">
                        {[
                          "Further analysis of recovered deleted messages",
                          "Cross-reference call patterns with other suspects",
                          "Detailed analysis of secure messaging app data",
                          "Expand investigation to include cloud backups",
                          "Correlate GPS data with surveillance footage",
                          "Request carrier data for unidentified numbers",
                        ].map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-slate-800 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-medium mb-4">Timeline of Significant Events</h3>
                    <div className="space-y-4">
                      {[
                        {
                          date: "May 10, 2024",
                          events: ["Device factory reset attempted at 23:17", "Last known location: Downtown area"],
                        },
                        {
                          date: "May 8, 2024",
                          events: [
                            "Multiple calls to suspect #2",
                            "Secure messaging app shows heavy usage",
                            "GPS shows presence at location of interest #3",
                          ],
                        },
                        {
                          date: "May 5, 2024",
                          events: [
                            "Browser history cleared",
                            "Multiple text messages with coded language",
                            "Device inactive for 6 hours during daytime",
                          ],
                        },
                        {
                          date: "April 28, 2024",
                          events: [
                            "First contact with unidentified number",
                            "Installation of secure messaging application",
                            "Location data shows first visit to site of interest",
                          ],
                        },
                      ].map((item, i) => (
                        <div key={i} className="border-l-2 border-slate-300 pl-4 pb-2">
                          <h4 className="font-medium">{item.date}</h4>
                          <ul className="mt-2 space-y-1">
                            {item.events.map((event, j) => (
                              <li key={j} className="text-sm text-slate-600">
                                {event}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
