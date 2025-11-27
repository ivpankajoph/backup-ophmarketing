import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MoreHorizontal, Plus, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

const schedules = [
  { id: 1, name: "Weekly Newsletter", template: "newsletter_v1", time: "Every Mon, 9:00 AM", recipients: 2500, status: "Active", nextRun: "Nov 30, 2025" },
  { id: 2, name: "Holiday Promo", template: "holiday_sale", time: "Dec 20, 2025, 10:00 AM", recipients: 5000, status: "Scheduled", nextRun: "Dec 20, 2025" },
  { id: 3, name: "Feedback Request", template: "feedback_survey", time: "After 2 days", recipients: "Trigger based", status: "Paused", nextRun: "-" },
];

export default function Schedule() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Schedule Messages</h2>
            <p className="text-muted-foreground">Manage your upcoming scheduled campaigns.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Schedule
          </Button>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Upcoming Schedules</CardTitle>
             <CardDescription>View and manage your automated dispatch queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Schedule Rule</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.template}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {item.time}
                      </div>
                    </TableCell>
                    <TableCell>{item.recipients}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Active' ? 'default' : item.status === 'Scheduled' ? 'secondary' : 'outline'}
                        className={item.status === 'Active' ? 'bg-green-500' : ''}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.nextRun}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'Paused' ? (
                          <Button variant="ghost" size="icon" title="Resume"><PlayCircle className="h-4 w-4" /></Button>
                        ) : (
                          <Button variant="ghost" size="icon" title="Pause"><PauseCircle className="h-4 w-4" /></Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
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
