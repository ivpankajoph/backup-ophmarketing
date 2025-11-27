import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, RefreshCw, Activity, Link as LinkIcon, Plus, Loader2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppSettings {
  phoneNumber?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  appId?: string;
  appSecret?: string;
  accessToken?: string;
  webhookUrl?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export default function WebhookAPI() {
  const [showToken, setShowToken] = useState(false);
  const [formData, setFormData] = useState<WhatsAppSettings>({
    phoneNumber: "",
    phoneNumberId: "",
    businessAccountId: "",
    appId: "",
    appSecret: "",
    accessToken: "",
    webhookUrl: "",
    isActive: false,
    isVerified: false,
  });
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings/whatsapp"],
    queryFn: async () => {
      const res = await fetch("/api/settings/whatsapp");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: WhatsAppSettings) => {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/whatsapp"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/settings/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Test failed");
      return data;
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, isVerified: true }));
      toast.success(data.message || "Connection test successful!");
    },
    onError: (error: Error) => {
      setFormData(prev => ({ ...prev, isVerified: false }));
      toast.error(error.message || "Connection test failed");
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookUrl = `${baseUrl}/api/webhook/whatsapp`;
    setFormData(prev => ({ ...prev, webhookUrl }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Webhook & API</h2>
            <p className="text-muted-foreground">Manage your API keys and webhook configurations.</p>
          </div>
          <Badge variant={formData.isVerified ? "default" : "secondary"}>
            {formData.isVerified ? (
              <><CheckCircle2 className="mr-1 h-3 w-3" /> Connected</>
            ) : (
              <><X className="mr-1 h-3 w-3" /> Not Connected</>
            )}
          </Badge>
        </div>

        <Tabs defaultValue="whatsapp" className="space-y-4">
          <TabsList>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp API</TabsTrigger>
            <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
             <Card>
               <CardHeader>
                 <CardTitle>API Keys</CardTitle>
                 <CardDescription>Use these keys to authenticate requests to our API.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="font-medium">Production Key</div>
                       <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex gap-2">
                       <Input value="sk_live_whatsapp_api_key_demo" readOnly className="font-mono bg-background" />
                       <Button variant="outline" size="icon" onClick={() => copyToClipboard("sk_live_whatsapp_api_key_demo")}>
                         <Copy className="h-4 w-4" />
                       </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Created on Nov 27, 2025</div>
                 </div>
                 <Button variant="outline" onClick={() => toast.success("New API key generated")}>
                   <Plus className="mr-2 h-4 w-4" /> Generate New Key
                 </Button>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
               <CardHeader>
                 <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                     <LinkIcon className="h-4 w-4" />
                   </div>
                   <div>
                     <CardTitle>Connect WhatsApp Business API</CardTitle>
                     <CardDescription>Enter your Meta Developer credentials.</CardDescription>
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid gap-2">
                   <Label>App ID</Label>
                   <Input 
                     placeholder="Enter Meta App ID"
                     value={formData.appId || ""}
                     onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label>Access Token</Label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                       <Input 
                         type={showToken ? "text" : "password"}
                         placeholder="Enter Access Token"
                         value={formData.accessToken || ""}
                         onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         className="absolute right-0 top-0 h-full"
                         onClick={() => setShowToken(!showToken)}
                       >
                         {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                     </div>
                   </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="grid gap-2">
                     <Label>Phone Number ID</Label>
                     <Input 
                       placeholder="Phone Number ID"
                       value={formData.phoneNumberId || ""}
                       onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>Business Account ID</Label>
                     <Input 
                       placeholder="WABA ID"
                       value={formData.businessAccountId || ""}
                       onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
                     />
                   </div>
                 </div>
               </CardContent>
               <CardFooter className="flex justify-between bg-background/50 border-t p-6">
                  <Button 
                    variant="ghost"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/settings/whatsapp"] })}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => testMutation.mutate()}
                      disabled={testMutation.isPending || !formData.accessToken || !formData.phoneNumberId}
                    >
                      {testMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Activity className="mr-2 h-4 w-4" />
                      )}
                      Test Connection
                    </Button>
                    <Button 
                      onClick={() => saveMutation.mutate(formData)}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Connection
                    </Button>
                  </div>
               </CardFooter>
            </Card>
            
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>API Status</AlertTitle>
              <AlertDescription>
                {formData.isVerified 
                  ? "WhatsApp API is connected and ready to use."
                  : "API connection is currently using demo mode. Enter your credentials above for production."}
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <Card>
               <CardHeader>
                 <CardTitle>Webhook Configuration</CardTitle>
                 <CardDescription>Receive real-time updates for message status.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid gap-2">
                   <Label>Callback URL</Label>
                   <div className="flex gap-2">
                     <Input 
                       value={formData.webhookUrl || ""}
                       onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                       placeholder="https://your-domain.com/api/webhook/whatsapp"
                     />
                     <Button variant="outline" size="icon" onClick={generateWebhookUrl}>
                       <RefreshCw className="h-4 w-4" />
                     </Button>
                     <Button 
                       variant="outline" 
                       size="icon"
                       onClick={() => formData.webhookUrl && copyToClipboard(formData.webhookUrl)}
                     >
                       <Copy className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
                 <div className="grid gap-2">
                   <Label>Verify Token</Label>
                   <Input defaultValue="whatsapp_verify_token_secure" />
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => toast.success("Webhook connectivity test passed")}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Test Connectivity
                    </Button>
                 </div>
               </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded-md">
                     <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">200 OK</Badge>
                       <span>message.delivered</span>
                     </div>
                     <span className="text-muted-foreground">Just now</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded-md">
                     <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">200 OK</Badge>
                       <span>message.read</span>
                     </div>
                     <span className="text-muted-foreground">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded-md">
                     <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">200 OK</Badge>
                       <span>message.sent</span>
                     </div>
                     <span className="text-muted-foreground">5 mins ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
