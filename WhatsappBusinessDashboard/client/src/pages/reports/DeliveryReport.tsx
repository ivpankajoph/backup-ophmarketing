import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const data = [
  { date: 'Mon', sent: 4000, delivered: 3800, read: 2400, failed: 200 },
  { date: 'Tue', sent: 3000, delivered: 2800, read: 1398, failed: 200 },
  { date: 'Wed', sent: 2000, delivered: 1900, read: 980, failed: 100 },
  { date: 'Thu', sent: 2780, delivered: 2600, read: 1908, failed: 180 },
  { date: 'Fri', sent: 1890, delivered: 1800, read: 1200, failed: 90 },
  { date: 'Sat', sent: 2390, delivered: 2300, read: 1800, failed: 90 },
  { date: 'Sun', sent: 3490, delivered: 3300, read: 2300, failed: 190 },
];

export default function DeliveryReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Message Delivery Report</h2>
            <p className="text-muted-foreground">Detailed analysis of message delivery rates over time.</p>
          </div>
          <div className="flex items-center gap-2">
             <Select defaultValue="7d">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
             </Select>
             <Button variant="outline">
               <Download className="mr-2 h-4 w-4" />
               Export CSV
             </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">19,550</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-green-600">18,500</div>
               <div className="text-xs text-muted-foreground">94.6% Delivery Rate</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Read</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-blue-600">11,986</div>
               <div className="text-xs text-muted-foreground">64.8% Read Rate</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-destructive">1,050</div>
               <div className="text-xs text-muted-foreground">5.4% Failure Rate</div>
             </CardContent>
           </Card>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Delivery Timeline</CardTitle>
             <CardDescription>Message status trends over the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="sent" stroke="#8884d8" fillOpacity={1} fill="url(#colorSent)" name="Sent" />
                  <Area type="monotone" dataKey="delivered" stroke="#22c55e" fillOpacity={1} fill="url(#colorDelivered)" name="Delivered" />
                  <Area type="monotone" dataKey="read" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRead)" name="Read" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
