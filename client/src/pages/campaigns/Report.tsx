import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { CheckCircle2, Eye, MousePointerClick, AlertCircle } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const deliveryData = [
  { name: 'Delivered', value: 850, color: '#22c55e' },
  { name: 'Read', value: 600, color: '#3b82f6' },
  { name: 'Failed', value: 50, color: '#ef4444' },
];

const dailyStats = [
  { name: 'Mon', sent: 4000, read: 2400 },
  { name: 'Tue', sent: 3000, read: 1398 },
  { name: 'Wed', sent: 2000, read: 9800 },
  { name: 'Thu', sent: 2780, read: 3908 },
  { name: 'Fri', sent: 1890, read: 4800 },
  { name: 'Sat', sent: 2390, read: 3800 },
  { name: 'Sun', sent: 3490, read: 4300 },
];

export default function Report() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaign Reports</h2>
          <p className="text-muted-foreground">Detailed insights into message delivery and engagement.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard 
             title="Sent" 
             value="15,230" 
             icon={CheckCircle2}
             trend={{ value: 12, label: "vs last month" }}
          />
          <StatsCard 
             title="Delivered" 
             value="98.5%" 
             icon={CheckCircle2}
             className="text-green-600"
          />
          <StatsCard 
             title="Read Rate" 
             value="64.2%" 
             icon={Eye}
             className="text-blue-600"
          />
          <StatsCard 
             title="Failed" 
             value="1.5%" 
             icon={AlertCircle}
             className="text-red-600"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>Overall breakdown of message statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deliveryData.map((entry, index) => (
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
            <CardHeader>
              <CardTitle>Daily Engagement</CardTitle>
              <CardDescription>Messages sent vs read over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                    />
                    <Legend />
                    <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="read" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
