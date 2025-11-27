import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { 
  MessageCircle, 
  CheckCircle2, 
  Eye, 
  CornerUpLeft, 
  TrendingUp,
  Users,
  Calendar,
  Loader2
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

interface DashboardStats {
  totalMessages: number;
  delivered: number;
  readRate: number;
  replied: number;
  messagesChange: number;
  deliveredChange: number;
  readRateChange: number;
  repliedChange: number;
  dailyActivity: Array<{ day: string; sent: number; delivered: number; read: number }>;
  campaignPerformance: Array<{ name: string; delivered: number; read: number }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const recentMessages = messages?.slice(-3).reverse() || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const chartData = stats?.dailyActivity || [
    { day: "Mon", sent: 0, delivered: 0, read: 0 },
    { day: "Tue", sent: 0, delivered: 0, read: 0 },
    { day: "Wed", sent: 0, delivered: 0, read: 0 },
    { day: "Thu", sent: 0, delivered: 0, read: 0 },
    { day: "Fri", sent: 0, delivered: 0, read: 0 },
    { day: "Sat", sent: 0, delivered: 0, read: 0 },
    { day: "Sun", sent: 0, delivered: 0, read: 0 },
  ];

  const campaignData = stats?.campaignPerformance || [];

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
            value={stats?.totalMessages?.toLocaleString() || "0"} 
            icon={MessageCircle}
            trend={{ value: stats?.messagesChange || 0, label: "from last week" }}
          />
          <StatsCard 
            title="Delivered" 
            value={stats?.delivered?.toLocaleString() || "0"} 
            icon={CheckCircle2}
            trend={{ value: stats?.deliveredChange || 0, label: "from last week" }}
          />
          <StatsCard 
            title="Read Rate" 
            value={`${stats?.readRate || 0}%`} 
            icon={Eye}
            trend={{ value: stats?.readRateChange || 0, label: "from last week" }}
          />
          <StatsCard 
            title="Replied" 
            value={stats?.replied?.toLocaleString() || "0"} 
            icon={CornerUpLeft}
            trend={{ value: stats?.repliedChange || 0, label: "from last week" }}
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
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
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
                  <BarChart data={campaignData.length > 0 ? campaignData : chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey={campaignData.length > 0 ? "name" : "day"}
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
                 {recentMessages.length > 0 ? recentMessages.map((msg: any, i: number) => (
                   <div key={msg.id || i} className="flex items-center gap-4">
                     <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <MessageCircle className="h-4 w-4" />
                     </div>
                     <div className="flex-1 space-y-1">
                       <p className="text-sm font-medium leading-none">
                         {msg.direction === "inbound" ? "New message received" : "Message sent"}
                       </p>
                       <p className="text-xs text-muted-foreground">
                         {new Date(msg.timestamp).toLocaleString()}
                       </p>
                     </div>
                     <div className="text-sm font-medium text-muted-foreground">View</div>
                   </div>
                 )) : [1, 2, 3].map((i) => (
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
