import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle2, 
  Clock,
  PlayCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const campaigns = [
  { id: 1, name: "Summer Sale Blast", status: "Completed", sent: 5000, delivered: 4950, read: 3200, date: "Jun 15, 2025" },
  { id: 2, name: "New Collection Alert", status: "Scheduled", sent: 0, delivered: 0, read: 0, date: "Jun 20, 2025" },
  { id: 3, name: "Abandoned Cart Recovery", status: "Active", sent: 120, delivered: 118, read: 85, date: "Automated" },
  { id: 4, name: "VIP Exclusive Offer", status: "Draft", sent: 0, delivered: 0, read: 0, date: "Not scheduled" },
  { id: 5, name: "Weekend Promo", status: "Completed", sent: 2500, delivered: 2480, read: 1900, date: "Jun 10, 2025" },
];

export default function Campaigns() {
  return (
    <DashboardLayout>
       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
            <p className="text-muted-foreground">Manage your broadcast lists and scheduled messages.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Campaigns
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Running right now
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scheduled
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Messages Sent
              </CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2k</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>
              A list of all your recent broadcasts and automated sequences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          campaign.status === 'Completed' ? 'secondary' : 
                          campaign.status === 'Active' ? 'default' : 
                          campaign.status === 'Scheduled' ? 'outline' : 'outline'
                        }
                        className={
                          campaign.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                    <TableCell>{campaign.delivered.toLocaleString()}</TableCell>
                    <TableCell>{campaign.read.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {campaign.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
