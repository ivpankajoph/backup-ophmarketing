import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const agents = [
  { id: 1, name: "Sarah Miller", chats: 145, avgResponse: "2m 30s", resolved: "98%", rating: 4.9, avatar: "SM" },
  { id: 2, name: "John Doe", chats: 132, avgResponse: "3m 15s", resolved: "95%", rating: 4.7, avatar: "JD" },
  { id: 3, name: "Emily Chen", chats: 98, avgResponse: "1m 45s", resolved: "92%", rating: 4.8, avatar: "EC" },
  { id: 4, name: "Michael Scott", chats: 80, avgResponse: "5m 00s", resolved: "85%", rating: 4.2, avatar: "MS" },
];

export default function AgentPerformance() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agent Performance</h2>
          <p className="text-muted-foreground">Track team productivity and customer satisfaction.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">3m 12s</div>
               <p className="text-xs text-muted-foreground text-green-600">-15s vs last week</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">94.2%</div>
               <p className="text-xs text-muted-foreground text-green-600">+1.2% vs last week</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Chats Closed</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">455</div>
             </CardContent>
           </Card>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Agent Leaderboard</CardTitle>
             <CardDescription>Top performing agents this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Chats Handled</TableHead>
                  <TableHead>Avg Response</TableHead>
                  <TableHead>Resolution Rate</TableHead>
                  <TableHead>CSAT Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{agent.avatar}</AvatarFallback>
                        </Avatar>
                        {agent.name}
                      </div>
                    </TableCell>
                    <TableCell>{agent.chats}</TableCell>
                    <TableCell>{agent.avgResponse}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         <Progress value={parseInt(agent.resolved)} className="w-[60px] h-2" />
                         <span className="text-xs text-muted-foreground">{agent.resolved}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1 font-medium">
                         <span className="text-yellow-500">★</span> {agent.rating}
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
