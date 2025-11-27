import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contactsData = [
  { id: 1, name: "Alice Johnson", phone: "+1 555 123 4567", tags: ["VIP"], status: "Active" },
  { id: 2, name: "Bob Smith", phone: "+1 555 987 6543", tags: ["Lead"], status: "Active" },
  { id: 3, name: "Carol Williams", phone: "+1 555 456 7890", tags: ["Customer"], status: "Inactive" },
  { id: 4, name: "David Brown", phone: "+1 555 234 5678", tags: ["Lead"], status: "Active" },
  { id: 5, name: "Eva Davis", phone: "+1 555 876 5432", tags: ["VIP"], status: "Active" },
];

export default function SelectedContacts() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contactsData.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsData.map(c => c.id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-3xl font-bold tracking-tight">Send to Selected</h2>
             <p className="text-muted-foreground">Select specific contacts and send a targeted message.</p>
           </div>
           <Dialog>
             <DialogTrigger asChild>
               <Button disabled={selectedContacts.length === 0}>
                 <Send className="mr-2 h-4 w-4" />
                 Send to {selectedContacts.length} Contacts
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>Compose Message</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label>Template</Label>
                   <Select>
                     <SelectTrigger>
                       <SelectValue placeholder="Select a template (Optional)" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="none">None (Custom Message)</SelectItem>
                       <SelectItem value="promo">Promo Offer</SelectItem>
                       <SelectItem value="update">Service Update</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid gap-2">
                   <Label>Message</Label>
                   <Textarea placeholder="Type your message here..." className="min-h-[100px]" />
                 </div>
               </div>
               <DialogFooter>
                 <Button type="submit">Send Message</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Contact List</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search contacts..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedContacts.length === contactsData.length && contactsData.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsData.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleSelect(contact.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={contact.status === 'Active' ? 'default' : 'outline'} className={contact.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
