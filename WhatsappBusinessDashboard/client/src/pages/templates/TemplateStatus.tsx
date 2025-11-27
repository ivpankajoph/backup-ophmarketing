import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TemplateStatus() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold tracking-tight">Template Status</h2>
        <Card>
          <CardHeader>
             <CardTitle>Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">welcome_message</TableCell>
                  <TableCell>Marketing</TableCell>
                  <TableCell>en_US</TableCell>
                  <TableCell><Badge className="bg-green-500">Approved</Badge></TableCell>
                  <TableCell>2 days ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">promo_offer</TableCell>
                  <TableCell>Marketing</TableCell>
                  <TableCell>en_US</TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell>1 hour ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">alert_msg</TableCell>
                  <TableCell>Utility</TableCell>
                  <TableCell>en_US</TableCell>
                  <TableCell><Badge variant="destructive">Rejected</Badge></TableCell>
                  <TableCell>Yesterday</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
