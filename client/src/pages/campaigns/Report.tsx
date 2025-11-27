import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Eye, MessageSquare, AlertCircle, DollarSign, TrendingUp, Users, Star, Download, BarChart3, FileText } from "lucide-react";
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
  Legend,
  LineChart,
  Line
} from "recharts";
import { useLocation } from "wouter";

const deliveryData = [
  { name: 'Delivered', value: 14980, color: '#22c55e' },
  { name: 'Read', value: 9620, color: '#3b82f6' },
  { name: 'Replied', value: 2890, color: '#8b5cf6' },
  { name: 'Failed', value: 250, color: '#ef4444' },
];

const dailyStats = [
  { name: 'Mon', sent: 4000, read: 2400, replied: 720 },
  { name: 'Tue', sent: 3000, read: 1800, replied: 540 },
  { name: 'Wed', sent: 5200, read: 3640, replied: 1092 },
  { name: 'Thu', sent: 2780, read: 1946, replied: 584 },
  { name: 'Fri', sent: 3890, read: 2723, replied: 817 },
  { name: 'Sat', sent: 2390, read: 1673, replied: 502 },
  { name: 'Sun', sent: 1490, read: 1043, replied: 313 },
];

const templatePerformance = [
  { name: 'hello_world', sent: 5230, delivered: 5180, read: 3626, replied: 1088, cost: 52.30, readRate: 70, replyRate: 21 },
  { name: 'welcome_message', sent: 3420, delivered: 3386, read: 2370, replied: 711, cost: 34.20, readRate: 70, replyRate: 21 },
  { name: 'order_confirmation', sent: 2890, delivered: 2875, read: 2300, replied: 920, cost: 28.90, readRate: 80, replyRate: 32 },
  { name: 'shipping_update', sent: 2150, delivered: 2129, read: 1489, replied: 297, cost: 21.50, readRate: 70, replyRate: 14 },
  { name: 'special_offer', sent: 1540, delivered: 1509, read: 755, replied: 151, cost: 15.40, readRate: 50, replyRate: 10 },
];

const campaignStats = [
  { name: 'Black Friday Sale', type: 'Marketing', sent: 5000, delivered: 4950, read: 3465, replied: 1039, cost: 50.00, date: '2025-11-25' },
  { name: 'New Product Launch', type: 'Marketing', sent: 3500, delivered: 3465, read: 2426, replied: 485, cost: 35.00, date: '2025-11-20' },
  { name: 'Order Updates', type: 'Utility', sent: 2890, delivered: 2875, read: 2300, replied: 920, cost: 14.45, date: '2025-11-24' },
  { name: 'Welcome Series', type: 'Utility', sent: 2100, delivered: 2079, read: 1455, replied: 436, cost: 10.50, date: '2025-11-22' },
  { name: 'Weekly Newsletter', type: 'Marketing', sent: 1740, delivered: 1705, read: 853, replied: 171, cost: 17.40, date: '2025-11-18' },
];

const costTrend = [
  { date: 'Nov 18', cost: 17.40, messages: 1740 },
  { date: 'Nov 20', cost: 35.00, messages: 3500 },
  { date: 'Nov 22', cost: 10.50, messages: 2100 },
  { date: 'Nov 24', cost: 14.45, messages: 2890 },
  { date: 'Nov 25', cost: 50.00, messages: 5000 },
  { date: 'Nov 27', cost: 22.30, messages: 2230 },
];

export default function Report() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState("7days");

  const totalSent = 15230;
  const totalDelivered = 14980;
  const totalRead = 9620;
  const totalReplied = 2890;
  const totalCost = 149.35;
  const deliveryRate = ((totalDelivered / totalSent) * 100).toFixed(1);
  const readRate = ((totalRead / totalDelivered) * 100).toFixed(1);
  const replyRate = ((totalReplied / totalRead) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Campaign Reports</h2>
            <p className="text-muted-foreground">Detailed insights into message delivery, engagement, and costs.</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setLocation("/reports/user-engagement")}>
              <Star className="mr-2 h-4 w-4" />
              User Engagement Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <StatsCard 
             title="Total Sent" 
             value={totalSent.toLocaleString()} 
             icon={CheckCircle2}
             trend={{ value: 12, label: "vs last period" }}
          />
          <StatsCard 
             title="Delivered" 
             value={`${deliveryRate}%`} 
             icon={CheckCircle2}
             className="text-green-600"
          />
          <StatsCard 
             title="Read Rate" 
             value={`${readRate}%`} 
             icon={Eye}
             className="text-blue-600"
          />
          <StatsCard 
             title="Reply Rate" 
             value={`${replyRate}%`} 
             icon={MessageSquare}
             className="text-purple-600"
          />
          <StatsCard 
             title="Total Cost" 
             value={`₹${totalCost.toFixed(2)}`} 
             icon={DollarSign}
             trend={{ value: 8, label: "vs last period" }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Wise</TabsTrigger>
            <TabsTrigger value="templates">Template Performance</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
                          label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                        >
                          {deliveryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString()} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Engagement</CardTitle>
                  <CardDescription>Messages sent, read, and replied over the last 7 days.</CardDescription>
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
                        <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="read" name="Read" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="replied" name="Replied" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed breakdown of each campaign's performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Sent</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Read</TableHead>
                      <TableHead className="text-right">Replied</TableHead>
                      <TableHead className="text-right">Cost (₹)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignStats.map((campaign, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant={campaign.type === 'Marketing' ? 'default' : 'secondary'}>
                            {campaign.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">{campaign.delivered.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-blue-600">{campaign.read.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-purple-600">{campaign.replied.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{campaign.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Template Performance
                </CardTitle>
                <CardDescription>How each template is performing in terms of engagement.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead className="text-right">Sent</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Read</TableHead>
                      <TableHead className="text-right">Replied</TableHead>
                      <TableHead className="text-right">Read Rate</TableHead>
                      <TableHead className="text-right">Reply Rate</TableHead>
                      <TableHead className="text-right">Cost (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templatePerformance.map((template, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium font-mono text-sm">{template.name}</TableCell>
                        <TableCell className="text-right">{template.sent.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{template.delivered.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-blue-600">{template.read.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-purple-600">{template.replied.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={template.readRate >= 70 ? 'default' : template.readRate >= 50 ? 'secondary' : 'outline'}>
                            {template.readRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={template.replyRate >= 25 ? 'default' : template.replyRate >= 15 ? 'secondary' : 'outline'}>
                            {template.replyRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{template.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost per Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalCost / totalSent).toFixed(4)}</div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost per Reply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalCost / totalReplied).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cost Trend</CardTitle>
                <CardDescription>Daily spending over the selected period.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                        formatter={(value: number, name: string) => [name === 'cost' ? `₹${value}` : value.toLocaleString(), name === 'cost' ? 'Cost' : 'Messages']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cost" name="Cost (₹)" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
