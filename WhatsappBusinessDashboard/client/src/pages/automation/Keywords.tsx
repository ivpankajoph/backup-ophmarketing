import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const keywords = [
  { id: 1, keyword: "PRICE", matchType: "Exact", reply: "Our pricing starts at $10/month. Check details here...", status: "Active" },
  { id: 2, keyword: "HELP", matchType: "Contains", reply: "Support options: 1. Sales, 2. Tech, 3. Billing", status: "Active" },
  { id: 3, keyword: "STOP", matchType: "Exact", reply: "You have been unsubscribed.", status: "Active" },
];

export default function Keywords() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold tracking-tight">Keyword Auto-replies</h2>
             <p className="text-muted-foreground">Set up triggers for specific words in incoming messages.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
               <Button>
                 <Plus className="mr-2 h-4 w-4" />
                 Add New Rule
               </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                 <DialogTitle>New Keyword Rule</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label>Keyword</Label>
                   <Input placeholder="e.g., HELLO" />
                 </div>
                 <div className="grid gap-2">
                   <Label>Match Type</Label>
                   <Select defaultValue="exact">
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="exact">Exact Match</SelectItem>
                       <SelectItem value="contains">Contains</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid gap-2">
                   <Label>Reply Message</Label>
                   <Textarea placeholder="The automated response..." />
                 </div>
               </div>
               <DialogFooter>
                 <Button>Save Rule</Button>
               </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Active Rules</CardTitle>
             <CardDescription>Messages that trigger an automatic response.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Match Type</TableHead>
                  <TableHead>Reply Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono font-bold">{rule.keyword}</TableCell>
                    <TableCell>{rule.matchType}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[300px]">{rule.reply}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{rule.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
