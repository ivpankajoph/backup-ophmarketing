import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";

const replies = [
  { id: 1, name: "Alice Johnson", message: "Yes, I am interested in the pro plan.", time: "10 mins ago", sentiment: "Positive" },
  { id: 2, name: "Bob Smith", message: "Stop sending me these messages.", time: "1 hour ago", sentiment: "Negative" },
  { id: 3, name: "Carol Williams", message: "How much is shipping to NY?", time: "2 hours ago", sentiment: "Neutral" },
  { id: 4, name: "David Brown", message: "Thanks for the update!", time: "Yesterday", sentiment: "Positive" },
  { id: 5, name: "Eva Davis", message: "I need to speak to an agent.", time: "Yesterday", sentiment: "Neutral" },
];

export default function CustomerReplies() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers Who Replied</h2>
          <p className="text-muted-foreground">Track incoming messages and customer sentiment.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Replies (7d)</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">342</div>
             </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Positive Sentiment</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-green-600">68%</div>
             </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Unsubscribe Requests</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-red-600">12</div>
             </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Recent Replies</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Customer</TableHead>
                   <TableHead>Message Snippet</TableHead>
                   <TableHead>Time</TableHead>
                   <TableHead>Sentiment</TableHead>
                   <TableHead className="text-right">Action</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {replies.map((reply) => (
                   <TableRow key={reply.id}>
                     <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                             <AvatarFallback className="text-xs">{reply.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {reply.name}
                        </div>
                     </TableCell>
                     <TableCell className="text-muted-foreground max-w-[300px] truncate">"{reply.message}"</TableCell>
                     <TableCell>{reply.time}</TableCell>
                     <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            reply.sentiment === 'Positive' ? 'text-green-600 bg-green-50 border-green-200' :
                            reply.sentiment === 'Negative' ? 'text-red-600 bg-red-50 border-red-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }
                        >
                          {reply.sentiment}
                        </Badge>
                     </TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" /> Reply
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
