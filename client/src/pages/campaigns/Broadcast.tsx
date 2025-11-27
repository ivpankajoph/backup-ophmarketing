import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Send, Users, Loader2, Check, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
}

interface Template {
  id: string;
  name: string;
  content: string;
  status: string;
}

export default function Broadcast() {
  const [, setLocation] = useLocation();
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });

  const approvedTemplates = templates.filter(t => t.status === "approved");

  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create campaign");
      return res.json();
    },
    onSuccess: (campaign) => {
      if (!isScheduled) {
        sendCampaignMutation.mutate(campaign.id);
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
        toast.success("Campaign scheduled successfully");
        setLocation("/campaigns");
      }
    },
    onError: () => {
      toast.error("Failed to create campaign");
    },
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to send campaign");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast.success("Broadcast sent successfully!");
      setLocation("/campaigns");
    },
    onError: () => {
      toast.error("Failed to send campaign");
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
    }
  };

  const toggleContact = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContactIds.length === contacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(contacts.map(c => c.id));
    }
  };

  const handleSendBroadcast = () => {
    if (selectedContactIds.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    createCampaignMutation.mutate({
      name: campaignName,
      message,
      templateId: selectedTemplateId || undefined,
      contactIds: selectedContactIds,
      status: isScheduled ? "scheduled" : "draft",
      scheduledAt: isScheduled ? scheduledTime : undefined,
    });
  };

  const isPending = createCampaignMutation.isPending || sendCampaignMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Send Broadcast</h2>
          <p className="text-muted-foreground">Send bulk messages to your contact lists.</p>
        </div>

        <div className="space-y-2">
          <Label>Campaign Name</Label>
          <Input
            placeholder="e.g., Black Friday Sale"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>1. Select Audience</CardTitle>
              <CardDescription>Choose who will receive this message. Selected: {selectedContactIds.length} contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={selectAllContacts}>
                  {selectedContactIds.length === contacts.length ? "Deselect All" : "Select All"}
                </Button>
                <span className="text-sm text-muted-foreground">{contacts.length} total contacts</span>
              </div>
              
              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleContact(contact.id)}
                  >
                    <Checkbox 
                      checked={selectedContactIds.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.phone}</div>
                    </div>
                    {selectedContactIds.includes(contact.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Compose Message</CardTitle>
              <CardDescription>Select a template or write your message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="template">
                <TabsList className="w-full">
                  <TabsTrigger value="template" className="flex-1">Template</TabsTrigger>
                  <TabsTrigger value="custom" className="flex-1">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="template" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Select Template</Label>
                    <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {approvedTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {approvedTemplates.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No approved templates available. Create and get templates approved first.
                      </p>
                    )}
                  </div>
                  {selectedTemplateId && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{message}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="custom" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Message Text</Label>
                    <Textarea 
                      placeholder="Type your message here... Use {{name}} for personalization" 
                      className="min-h-[150px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{{name}}"} to personalize messages with contact names
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Checkbox 
                  id="schedule"
                  checked={isScheduled}
                  onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
                />
                <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
              </div>

              {isScheduled && (
                <div className="space-y-2">
                  <Label>Schedule Time</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleSendBroadcast}
                disabled={isPending || selectedContactIds.length === 0 || !message.trim() || !campaignName.trim()}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isScheduled ? (
                  <Calendar className="mr-2 h-4 w-4" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isScheduled ? "Schedule Broadcast" : "Send Broadcast"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
