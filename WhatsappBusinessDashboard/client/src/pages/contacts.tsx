import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Filter, 
  Upload, 
  Download,
  MoreHorizontal,
  Tag
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const contacts = [
  { id: 1, name: "Alice Johnson", phone: "+1 555 123 4567", tags: ["VIP", "Customer"], lastActive: "2 hours ago", status: "active" },
  { id: 2, name: "Bob Smith", phone: "+1 555 987 6543", tags: ["Lead"], lastActive: "1 day ago", status: "active" },
  { id: 3, name: "Carol Williams", phone: "+1 555 456 7890", tags: ["Support", "Pending"], lastActive: "3 days ago", status: "inactive" },
  { id: 4, name: "David Brown", phone: "+1 555 234 5678", tags: ["Customer"], lastActive: "1 week ago", status: "active" },
  { id: 5, name: "Eva Davis", phone: "+1 555 876 5432", tags: ["New"], lastActive: "Just now", status: "active" },
  { id: 6, name: "Frank Miller", phone: "+1 555 345 6789", tags: ["Lead"], lastActive: "5 hours ago", status: "active" },
  { id: 7, name: "Grace Wilson", phone: "+1 555 765 4321", tags: ["VIP"], lastActive: "2 days ago", status: "inactive" },
];

export default function Contacts() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
            <p className="text-muted-foreground">Manage your customer database and segments.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Contacts</CardTitle>
                <CardDescription>Total 2,345 contacts in your database.</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search contacts..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contact.lastActive}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         <span className={`h-2 w-2 rounded-full ${contact.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                         <span className="capitalize text-sm text-muted-foreground">{contact.status}</span>
                       </div>
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
