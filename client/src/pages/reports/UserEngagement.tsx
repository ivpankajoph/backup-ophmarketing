import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star, Download, Search, TrendingUp, Eye, MessageSquare, ArrowUp, ArrowDown, Users, Trophy } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const topEngagedUsers = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", messagesReceived: 45, messagesRead: 44, replies: 28, readRate: 97.8, replyRate: 62.2, engagement: 95 },
  { id: 2, name: "Priya Patel", phone: "+91 87654 32109", messagesReceived: 38, messagesRead: 36, replies: 22, readRate: 94.7, replyRate: 57.9, engagement: 89 },
  { id: 3, name: "Amit Kumar", phone: "+91 76543 21098", messagesReceived: 42, messagesRead: 39, replies: 18, readRate: 92.9, replyRate: 42.9, engagement: 85 },
  { id: 4, name: "Sneha Gupta", phone: "+91 65432 10987", messagesReceived: 35, messagesRead: 32, replies: 15, readRate: 91.4, replyRate: 42.9, engagement: 82 },
  { id: 5, name: "Vikram Singh", phone: "+91 54321 09876", messagesReceived: 50, messagesRead: 44, replies: 19, readRate: 88.0, replyRate: 38.0, engagement: 78 },
  { id: 6, name: "Neha Verma", phone: "+91 43210 98765", messagesReceived: 32, messagesRead: 28, replies: 14, readRate: 87.5, replyRate: 43.8, engagement: 76 },
  { id: 7, name: "Rajesh Iyer", phone: "+91 32109 87654", messagesReceived: 28, messagesRead: 24, replies: 12, readRate: 85.7, replyRate: 42.9, engagement: 74 },
  { id: 8, name: "Anita Reddy", phone: "+91 21098 76543", messagesReceived: 40, messagesRead: 33, replies: 13, readRate: 82.5, replyRate: 32.5, engagement: 70 },
  { id: 9, name: "Deepak Joshi", phone: "+91 10987 65432", messagesReceived: 36, messagesRead: 29, replies: 10, readRate: 80.6, replyRate: 27.8, engagement: 65 },
  { id: 10, name: "Kavita Shah", phone: "+91 09876 54321", messagesReceived: 44, messagesRead: 34, replies: 11, readRate: 77.3, replyRate: 25.0, engagement: 60 },
  { id: 11, name: "Suresh Nair", phone: "+91 98123 45678", messagesReceived: 30, messagesRead: 23, replies: 8, readRate: 76.7, replyRate: 26.7, engagement: 58 },
  { id: 12, name: "Meera Kapoor", phone: "+91 87234 56789", messagesReceived: 25, messagesRead: 19, replies: 7, readRate: 76.0, replyRate: 28.0, engagement: 55 },
  { id: 13, name: "Arun Menon", phone: "+91 76345 67890", messagesReceived: 33, messagesRead: 24, replies: 6, readRate: 72.7, replyRate: 18.2, engagement: 50 },
  { id: 14, name: "Pooja Rao", phone: "+91 65456 78901", messagesReceived: 29, messagesRead: 20, replies: 5, readRate: 69.0, replyRate: 17.2, engagement: 45 },
  { id: 15, name: "Kiran Desai", phone: "+91 54567 89012", messagesReceived: 38, messagesRead: 25, replies: 4, readRate: 65.8, replyRate: 10.5, engagement: 40 },
];

const engagementDistribution = [
  { range: '90-100%', count: 2, color: '#22c55e' },
  { range: '80-89%', count: 3, color: '#84cc16' },
  { range: '70-79%', count: 3, color: '#eab308' },
  { range: '60-69%', count: 2, color: '#f97316' },
  { range: '50-59%', count: 2, color: '#ef4444' },
  { range: '40-49%', count: 2, color: '#dc2626' },
  { range: '<40%', count: 1, color: '#991b1b' },
];

export default function UserEngagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"engagement" | "readRate" | "replyRate">("engagement");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const filteredUsers = topEngagedUsers
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

  const avgReadRate = (topEngagedUsers.reduce((sum, u) => sum + u.readRate, 0) / topEngagedUsers.length).toFixed(1);
  const avgReplyRate = (topEngagedUsers.reduce((sum, u) => sum + u.replyRate, 0) / topEngagedUsers.length).toFixed(1);
  const totalMessages = topEngagedUsers.reduce((sum, u) => sum + u.messagesReceived, 0);
  const totalReplies = topEngagedUsers.reduce((sum, u) => sum + u.replies, 0);

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-600";
    if (engagement >= 75) return "text-lime-600";
    if (engagement >= 60) return "text-yellow-600";
    if (engagement >= 45) return "text-orange-600";
    return "text-red-600";
  };

  const getEngagementBadge = (engagement: number) => {
    if (engagement >= 90) return <Badge className="bg-green-500">Excellent</Badge>;
    if (engagement >= 75) return <Badge className="bg-lime-500">Good</Badge>;
    if (engagement >= 60) return <Badge className="bg-yellow-500">Average</Badge>;
    if (engagement >= 45) return <Badge className="bg-orange-500">Low</Badge>;
    return <Badge variant="destructive">Very Low</Badge>;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-700" />;
    return <span className="w-5 text-center text-muted-foreground">{index + 1}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500" />
              User Engagement Report
            </h2>
            <p className="text-muted-foreground">See which users engage most with your messages - sorted by engagement percentage.</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topEngagedUsers.length}</div>
              <p className="text-xs text-muted-foreground">Active recipients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Avg Read Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{avgReadRate}%</div>
              <p className="text-xs text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                Avg Reply Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{avgReplyRate}%</div>
              <p className="text-xs text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Total Replies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalReplies}</div>
              <p className="text-xs text-muted-foreground">From {totalMessages} messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Engaged Users</CardTitle>
                  <CardDescription>Users ranked by engagement score (read + reply rates)</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engagement">Engagement %</SelectItem>
                      <SelectItem value="readRate">Read Rate %</SelectItem>
                      <SelectItem value="replyRate">Reply Rate %</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                  >
                    {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Messages</TableHead>
                    <TableHead className="text-right">Read %</TableHead>
                    <TableHead className="text-right">Reply %</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 10).map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center justify-center">
                          {getRankIcon(index)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.messagesReceived}</div>
                        <div className="text-xs text-muted-foreground">{user.replies} replies</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={user.readRate} className="w-16 h-2" />
                          <span className="text-sm font-medium text-blue-600">{user.readRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={user.replyRate} className="w-16 h-2" />
                          <span className="text-sm font-medium text-purple-600">{user.replyRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-lg font-bold ${getEngagementColor(user.engagement)}`}>
                            {user.engagement}%
                          </span>
                          {getEngagementBadge(user.engagement)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Distribution</CardTitle>
              <CardDescription>How users are distributed across engagement levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={70} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                      formatter={(value: number) => [`${value} users`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {engagementDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Legend</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Excellent (90%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-lime-500" />
                    <span>Good (80-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Average (70-79%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Low (60-69%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Very Low (&lt;60%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users by Engagement</CardTitle>
            <CardDescription>Complete list of users sorted from highest to lowest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Read</TableHead>
                  <TableHead className="text-right">Replied</TableHead>
                  <TableHead className="text-right">Read Rate</TableHead>
                  <TableHead className="text-right">Reply Rate</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell className="text-right">{user.messagesReceived}</TableCell>
                    <TableCell className="text-right text-blue-600">{user.messagesRead}</TableCell>
                    <TableCell className="text-right text-purple-600">{user.replies}</TableCell>
                    <TableCell className="text-right">{user.readRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{user.replyRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${getEngagementColor(user.engagement)}`}>
                        {user.engagement}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
