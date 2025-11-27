import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const campaignData = [
  { name: "Summer Sale", sent: 5000, read: 3500, replied: 450 },
  { name: "New Arrival", sent: 3500, read: 2100, replied: 200 },
  { name: "Feedback", sent: 1000, read: 800, replied: 300 },
  { name: "Promo X", sent: 4200, read: 2800, replied: 150 },
];

const campaigns = [
  { id: 1, name: "Summer Sale Blast", date: "Jun 15", sent: 5000, delivered: "99%", read: "70%", replied: "9%", cost: "$45.00" },
  { id: 2, name: "New Arrival Alert", date: "Jun 20", sent: 3500, delivered: "98%", read: "60%", replied: "5.7%", cost: "$31.50" },
  { id: 3, name: "Customer Feedback", date: "Jun 25", sent: 1000, delivered: "99.5%", read: "80%", replied: "30%", cost: "$9.00" },
  { id: 4, name: "Promo X", date: "Jun 28", sent: 4200, delivered: "97%", read: "66%", replied: "3.5%", cost: "$37.80" },
];

export default function CampaignPerformance() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaign Performance</h2>
          <p className="text-muted-foreground">ROI and engagement metrics for your broadcasts.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Comparison</CardTitle>
            <CardDescription>Compare Sent vs Read vs Replied across top campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={campaignData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                   <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                     cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                     contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                   />
                   <Legend />
                   <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Sent" />
                   <Bar dataKey="read" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Read" />
                   <Bar dataKey="replied" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Replied" />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Detailed Report</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Campaign Name</TableHead>
                   <TableHead>Date</TableHead>
                   <TableHead>Sent</TableHead>
                   <TableHead>Delivered</TableHead>
                   <TableHead>Read Rate</TableHead>
                   <TableHead>Reply Rate</TableHead>
                   <TableHead className="text-right">Cost</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {campaigns.map((campaign) => (
                   <TableRow key={campaign.id}>
                     <TableCell className="font-medium">{campaign.name}</TableCell>
                     <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                     <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                     <TableCell><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{campaign.delivered}</Badge></TableCell>
                     <TableCell>{campaign.read}</TableCell>
                     <TableCell>{campaign.replied}</TableCell>
                     <TableCell className="text-right font-medium">{campaign.cost}</TableCell>
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
