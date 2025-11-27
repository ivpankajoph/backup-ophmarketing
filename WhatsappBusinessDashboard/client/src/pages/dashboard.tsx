import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { 
  MessageCircle, 
  CheckCircle2, 
  Eye, 
  CornerUpLeft, 
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = [
  { name: "Mon", sent: 4000, delivered: 3800, read: 2400 },
  { name: "Tue", sent: 3000, delivered: 2800, read: 1398 },
  { name: "Wed", sent: 2000, delivered: 1900, read: 9800 },
  { name: "Thu", sent: 2780, delivered: 2600, read: 3908 },
  { name: "Fri", sent: 1890, delivered: 1800, read: 4800 },
  { name: "Sat", sent: 2390, delivered: 2300, read: 3800 },
  { name: "Sun", sent: 3490, delivered: 3300, read: 4300 },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your messaging performance today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 7 Days
            </Button>
            <Button>
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Messages" 
            value="12,345" 
            icon={MessageCircle}
            trend={{ value: 12, label: "from last week" }}
          />
          <StatsCard 
            title="Delivered" 
            value="11,980" 
            icon={CheckCircle2}
            trend={{ value: 2.1, label: "from last week" }}
          />
          <StatsCard 
            title="Read Rate" 
            value="84.2%" 
            icon={Eye}
            trend={{ value: 5.4, label: "from last week" }}
          />
          <StatsCard 
            title="Replied" 
            value="2,103" 
            icon={CornerUpLeft}
            trend={{ value: -1.2, label: "from last week" }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Message Activity</CardTitle>
              <CardDescription>
                Daily message volume and delivery status.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sent" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorSent)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Recent broadcast engagement rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="delivered" name="Delivered" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="read" name="Read" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Active Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="mt-4 h-[200px] flex items-center justify-center border rounded-md bg-muted/20 border-dashed">
                 <p className="text-sm text-muted-foreground">Contact Map Visualization Placeholder</p>
               </div>
             </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center gap-4">
                     <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <MessageCircle className="h-4 w-4" />
                     </div>
                     <div className="flex-1 space-y-1">
                       <p className="text-sm font-medium leading-none">New message from +1 (555) 000-000{i}</p>
                       <p className="text-xs text-muted-foreground">2 minutes ago</p>
                     </div>
                     <div className="text-sm font-medium text-muted-foreground">View</div>
                   </div>
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
