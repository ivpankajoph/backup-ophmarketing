import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const dailySpending = [
  { date: 'Mon', marketing: 45, utility: 12, service: 5 },
  { date: 'Tue', marketing: 30, utility: 15, service: 8 },
  { date: 'Wed', marketing: 20, utility: 10, service: 4 },
  { date: 'Thu', marketing: 50, utility: 18, service: 6 },
  { date: 'Fri', marketing: 35, utility: 14, service: 9 },
  { date: 'Sat', marketing: 60, utility: 20, service: 10 },
  { date: 'Sun', marketing: 40, utility: 16, service: 7 },
];

export default function Spending() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daily WhatsApp Spending</h2>
          <p className="text-muted-foreground">Track your daily expenditure on WhatsApp conversations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$414.00</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Daily Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$59.14</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,800.00</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown by Category</CardTitle>
            <CardDescription>Daily spend split by conversation type (Marketing, Utility, Service).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                    formatter={(value) => [`$${value}`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="marketing" name="Marketing" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="utility" name="Utility" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="service" name="Service" stackId="a" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
           <Card>
             <CardHeader>
                <CardTitle className="text-base">Marketing Conversations</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">$0.08 <span className="text-sm font-normal text-muted-foreground">/ conv</span></div>
                <p className="text-xs text-muted-foreground mt-1">Promotions, offers, updates</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
                <CardTitle className="text-base">Utility Conversations</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">$0.05 <span className="text-sm font-normal text-muted-foreground">/ conv</span></div>
                <p className="text-xs text-muted-foreground mt-1">Transaction updates, post-purchase</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
                <CardTitle className="text-base">Service Conversations</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">$0.03 <span className="text-sm font-normal text-muted-foreground">/ conv</span></div>
                <p className="text-xs text-muted-foreground mt-1">User-initiated support inquiries</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
