import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Phone, User } from "lucide-react";

export default function Single() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Single Message</h2>
            <p className="text-muted-foreground">Quickly send a message to a specific number.</p>
          </div>

          <Card>
            <CardHeader>
               <CardTitle>Compose Message</CardTitle>
               <CardDescription>Send a one-off message without creating a campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                 <Label>Phone Number</Label>
                 <div className="relative">
                   <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="+1 555 000 0000" className="pl-9" />
                 </div>
               </div>
               
               <div className="grid gap-2">
                 <Label>Recipient Name (Optional)</Label>
                 <div className="relative">
                   <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="John Doe" className="pl-9" />
                 </div>
               </div>

               <div className="grid gap-2">
                 <Label>Template (Optional)</Label>
                 <Select>
                   <SelectTrigger>
                     <SelectValue placeholder="Select a template" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="none">None - Write Custom Message</SelectItem>
                     <SelectItem value="hello">hello_world</SelectItem>
                     <SelectItem value="shipping">shipping_update</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div className="grid gap-2">
                 <Label>Message Text</Label>
                 <Textarea placeholder="Type your message here..." className="min-h-[150px]" />
               </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Clear Form</Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
