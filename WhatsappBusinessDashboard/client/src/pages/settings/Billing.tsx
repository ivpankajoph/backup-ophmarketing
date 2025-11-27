import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Coins, ArrowUpRight } from "lucide-react";

export default function Billing() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing & Credits</h2>
          <p className="text-muted-foreground">Manage your subscription and conversation credits.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-primary text-primary-foreground border-none">
             <CardHeader className="pb-2">
               <CardTitle className="text-lg font-medium opacity-90">Available Credits</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">$24.50</div>
               <Button variant="secondary" className="w-full mt-4 text-primary">
                 <Plus className="mr-2 h-4 w-4" /> Recharge
               </Button>
             </CardContent>
          </Card>

          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg font-medium">Monthly Usage</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">$12.30</div>
               <p className="text-xs text-muted-foreground mt-1">Since Nov 1, 2025</p>
               <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[45%]"></div>
               </div>
             </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg font-medium">Payment Method</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center gap-2 mb-4">
                 <CreditCard className="h-5 w-5 text-muted-foreground" />
                 <span className="font-medium">•••• 4242</span>
               </div>
               <Button variant="outline" className="w-full">Manage Cards</Button>
             </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent purchases and usage charges.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Nov 27, 2025</TableCell>
                  <TableCell>Credit Recharge</TableCell>
                  <TableCell><Badge className="bg-green-500">Success</Badge></TableCell>
                  <TableCell className="text-right">+$50.00</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nov 01, 2025</TableCell>
                  <TableCell>Monthly Subscription (Pro)</TableCell>
                  <TableCell><Badge className="bg-green-500">Success</Badge></TableCell>
                  <TableCell className="text-right">-$29.00</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { Plus } from "lucide-react";
