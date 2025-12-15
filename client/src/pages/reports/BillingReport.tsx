import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  MessageSquare,
  Bot,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Loader2,
  Download,
  Filter,
} from "lucide-react";
import { getAuthHeaders } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AgentBilling {
  agentId: string;
  agentName: string;
  conversationCount: number;
  messageCount: number;
  cost: number;
}

interface DailyBreakdown {
  date: string;
  userMessages: number;
  aiMessages: number;
  totalMessages: number;
  cost: number;
}

interface BillingSummary {
  userId: string;
  userName: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
    totalConversations: number;
    totalCost: number;
    costPerMessage: number;
  };
  agentBreakdown: AgentBilling[];
  dailyBreakdown: DailyBreakdown[];
}

interface ConversationBilling {
  contactId: string;
  contactName: string;
  contactPhone: string;
  userMessages: number;
  aiMessages: number;
  totalMessages: number;
  cost: number;
  agentName: string | null;
  lastMessageAt: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function BillingReport() {
  const [period, setPeriod] = useState<string>("month");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomDate, setShowCustomDate] = useState(false);

  const getQueryParams = () => {
    if (period === "custom" && customStartDate && customEndDate) {
      return `?period=custom&startDate=${customStartDate}&endDate=${customEndDate}`;
    }
    return `?period=${period}`;
  };

  const { data: billingSummary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery<BillingSummary>({
    queryKey: ["/api/reports/billing/summary", period, customStartDate, customEndDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/billing/summary${getQueryParams()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch billing summary");
      return res.json();
    },
  });

  const { data: conversationsData, isLoading: conversationsLoading } = useQuery<{
    conversations: ConversationBilling[];
    total: number;
  }>({
    queryKey: ["/api/reports/billing/conversations", period, customStartDate, customEndDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/billing/conversations${getQueryParams()}&limit=100`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch conversations billing");
      return res.json();
    },
  });

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    setShowCustomDate(value === "custom");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const agentPieData = billingSummary?.agentBreakdown?.map((agent) => ({
    name: agent.agentName,
    value: agent.messageCount,
    cost: agent.cost,
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Billing Report</h1>
            <p className="text-gray-500">
              Track message costs and usage across your WhatsApp conversations
            </p>
          </div>
          <Button variant="outline" onClick={() => refetchSummary()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 flex-wrap">
              <div className="space-y-2">
                <Label>Time Period</Label>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showCustomDate && (
                <>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-48"
                    />
                  </div>
                </>
              )}
            </div>

            {billingSummary && (
              <div className="mt-4 text-sm text-gray-500">
                Showing data from {formatDate(billingSummary.period.start)} to{" "}
                {formatDate(billingSummary.period.end)}
              </div>
            )}
          </CardContent>
        </Card>

        {summaryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : billingSummary ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(billingSummary.metrics.totalCost)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    @ {formatCurrency(billingSummary.metrics.costPerMessage)}/message
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    Total Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {billingSummary.metrics.totalMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Billable messages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    User Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {billingSummary.metrics.userMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inbound messages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bot className="h-4 w-4 text-orange-600" />
                    AI Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {billingSummary.metrics.aiMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">AI agent responses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600">
                    {billingSummary.metrics.totalConversations.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Unique contacts</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="daily" className="w-full">
              <TabsList>
                <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
                <TabsTrigger value="agents">AI Agent Costs</TabsTrigger>
                <TabsTrigger value="conversations">Per Conversation</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Message & Cost Trend</CardTitle>
                    <CardDescription>
                      Message volume and costs over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {billingSummary.dailyBreakdown.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={billingSummary.dailyBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(val) =>
                              new Date(val).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })
                            }
                          />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              if (name === "cost") return [formatCurrency(value), "Cost"];
                              return [value, name];
                            }}
                            labelFormatter={(label) => formatDate(label)}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="userMessages"
                            fill="#8884d8"
                            name="User Messages"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="aiMessages"
                            fill="#82ca9d"
                            name="AI Messages"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cost"
                            stroke="#ff7300"
                            name="Cost"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        No data available for selected period
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">User Messages</TableHead>
                          <TableHead className="text-right">AI Messages</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingSummary.dailyBreakdown.map((day) => (
                          <TableRow key={day.date}>
                            <TableCell>{formatDate(day.date)}</TableCell>
                            <TableCell className="text-right">{day.userMessages}</TableCell>
                            <TableCell className="text-right">{day.aiMessages}</TableCell>
                            <TableCell className="text-right font-medium">
                              {day.totalMessages}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(day.cost)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50 font-bold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">
                            {billingSummary.metrics.userMessages}
                          </TableCell>
                          <TableCell className="text-right">
                            {billingSummary.metrics.aiMessages}
                          </TableCell>
                          <TableCell className="text-right">
                            {billingSummary.metrics.totalMessages}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(billingSummary.metrics.totalCost)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Agent Message Distribution</CardTitle>
                      <CardDescription>Messages handled by each AI agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {agentPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={agentPieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {agentPieData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [value, "Messages"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          No AI agent data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Agent Cost Breakdown</CardTitle>
                      <CardDescription>
                        Cost per AI agent based on messages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agent Name</TableHead>
                            <TableHead className="text-right">Conversations</TableHead>
                            <TableHead className="text-right">Messages</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingSummary.agentBreakdown.length > 0 ? (
                            billingSummary.agentBreakdown.map((agent) => (
                              <TableRow key={agent.agentId}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Bot className="h-4 w-4 text-orange-500" />
                                    {agent.agentName}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {agent.conversationCount}
                                </TableCell>
                                <TableCell className="text-right">
                                  {agent.messageCount}
                                </TableCell>
                                <TableCell className="text-right font-medium text-green-600">
                                  {formatCurrency(agent.cost)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500">
                                No AI agent activity in this period
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="conversations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Per Conversation Billing</CardTitle>
                    <CardDescription>
                      Message counts and costs for each contact conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {conversationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : conversationsData && conversationsData.conversations.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Contact</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>AI Agent</TableHead>
                              <TableHead className="text-right">User Msgs</TableHead>
                              <TableHead className="text-right">AI Msgs</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="text-right">Cost</TableHead>
                              <TableHead>Last Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {conversationsData.conversations.map((conv) => (
                              <TableRow key={conv.contactId}>
                                <TableCell className="font-medium">
                                  {conv.contactName}
                                </TableCell>
                                <TableCell>{conv.contactPhone}</TableCell>
                                <TableCell>
                                  {conv.agentName ? (
                                    <Badge variant="secondary">
                                      <Bot className="h-3 w-3 mr-1" />
                                      {conv.agentName}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {conv.userMessages}
                                </TableCell>
                                <TableCell className="text-right">
                                  {conv.aiMessages}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {conv.totalMessages}
                                </TableCell>
                                <TableCell className="text-right font-medium text-green-600">
                                  {formatCurrency(conv.cost)}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                  {formatDate(conv.lastMessageAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-4 text-sm text-gray-500">
                          Showing {conversationsData.conversations.length} of{" "}
                          {conversationsData.total} conversations
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        No conversations found in this period
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No billing data available. Start sending messages to see your usage.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
