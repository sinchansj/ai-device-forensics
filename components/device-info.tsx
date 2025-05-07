import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Battery, MemoryStickIcon as Memory, Database, Wifi } from "lucide-react"

export default function DeviceInfo() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Device Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Device Model</p>
              <p className="font-medium">Pixel 9</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Memory className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Android Version</p>
              <p className="font-medium">Android 15 (Build SP1A.210812.016)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Storage</p>
              <p className="font-medium">128GB (87% used)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Battery className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">IMEI</p>
              <p className="font-medium">359125780246813</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Last Network</p>
              <p className="font-medium">T-Mobile US</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
