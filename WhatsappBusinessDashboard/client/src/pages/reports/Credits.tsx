import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Coins } from "lucide-react";

const transactions = [
  { id: 1, date: "Nov 27, 2025", type: "Recharge", amount: "+$50.00", balance: "$74.50", status: "Success" },
  { id: 2, date: "Nov 26, 2025", type: "Usage - Marketing", amount: "-$12.40", balance: "$24.50", status: "Success" },
  { id: 3, date: "Nov 25, 2025", type: "Usage - Utility", amount: "-$5.20", balance: "$36.90", status: "Success" },
  { id: 4, date: "Nov 20, 2025", type: "Recharge", amount: "+$20.00", balance: "$42.10", status: "Success" },
  { id: 5, date: "Nov 15, 2025", type: "Monthly Subscription", amount: "-$29.00", balance: "$22.10", status: "Success" },
];

export default function Credits() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Credits & Transactions</h2>
            <p className="text-muted-foreground">Monitor your wallet balance and usage history.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Credits
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Coins className="h-5 w-5" />
                   Current Balance
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-5xl font-bold">$74.50</div>
                 <p className="text-primary-foreground/80 mt-2">Auto-recharge disabled</p>
              </CardContent>
           </Card>
           
           <Card>
              <CardHeader>
                 <CardTitle>Low Balance Alert</CardTitle>
                 <CardDescription>Get notified when your credits fall below a threshold.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="text-sm text-muted-foreground mb-4">
                   Current threshold: <span className="font-bold text-foreground">$10.00</span>
                 </div>
                 <Button variant="outline" size="sm">Configure Alert</Button>
              </CardContent>
           </Card>
        </div>

        <Card>
           <CardHeader>
              <div className="flex items-center justify-between">
                 <CardTitle>Transaction History</CardTitle>
                 <Button variant="ghost" size="sm">
                   <Download className="mr-2 h-4 w-4" /> Export
                 </Button>
              </div>
           </CardHeader>
           <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className={tx.amount.startsWith('+') ? 'text-green-600 font-medium' : ''}>
                        {tx.amount}
                      </TableCell>
                      <TableCell>{tx.balance}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {tx.status}
                        </Badge>
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
