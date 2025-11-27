import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Bot, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import api from '@/services/api';

interface DashboardStats {
  totalForms: number;
  totalLeads: number;
  totalAgents: number;
  totalMessages: number;
  inboundMessages: number;
  outboundMessages: number;
  recentLeads: any[];
  recentMessages: any[];
}

export default function MainDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats,
    refetchInterval: 30000,
  });

  const statCards = [
    {
      title: 'Lead Forms',
      value: stats?.totalForms || 0,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/fb/forms',
    },
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/fb/leads',
    },
    {
      title: 'AI Agents',
      value: stats?.totalAgents || 0,
      icon: Bot,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/agents',
    },
    {
      title: 'Total Messages',
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/whatsapp',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your WhatsApp + Facebook Lead Ads + AI system
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.link}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Inbound Messages</p>
                    <p className="text-sm text-muted-foreground">Messages received</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.inboundMessages || 0}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Outbound Messages</p>
                    <p className="text-sm text-muted-foreground">Messages sent</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.outboundMessages || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Leads
            </CardTitle>
            <Link href="/fb/leads">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentLeads && stats.recentLeads.length > 0 ? (
              <div className="space-y-3">
                {stats.recentLeads.map((lead: any) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {lead.fieldData?.full_name || 
                           lead.fieldData?.name || 
                           lead.fieldData?.email || 
                           'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.fieldData?.email || lead.fieldData?.phone || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leads yet</p>
                <p className="text-sm mt-1">Sync leads from Facebook to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/fb/forms">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Sync Forms</span>
              </Button>
            </Link>
            <Link href="/fb/leads">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Sync Leads</span>
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Bot className="h-6 w-6" />
                <span>Create Agent</span>
              </Button>
            </Link>
            <Link href="/map-agent">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>Map Agent</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
