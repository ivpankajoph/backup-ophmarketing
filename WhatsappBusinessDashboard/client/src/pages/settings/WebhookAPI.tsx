import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, RefreshCw, Activity, Link as LinkIcon, Plus } from "lucide-react";

export default function WebhookAPI() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Webhook & API</h2>
          <p className="text-muted-foreground">Manage your API keys and webhook configurations.</p>
        </div>

        <Tabs defaultValue="api" className="space-y-4">
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
                       <Input value="sk_live_51Mz..." readOnly className="font-mono bg-background" />
                       <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Created on Nov 27, 2025</div>
                 </div>
                 <Button variant="outline">
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
                   <Input placeholder="Enter Meta App ID" />
                 </div>
                 <div className="grid gap-2">
                   <Label>App Secret / Token</Label>
                   <Input type="password" placeholder="Enter Access Token" />
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="grid gap-2">
                     <Label>Phone Number ID</Label>
                     <Input placeholder="Phone Number ID" />
                   </div>
                   <div className="grid gap-2">
                     <Label>Business Account ID</Label>
                     <Input placeholder="WABA ID" />
                   </div>
                 </div>
               </CardContent>
               <CardFooter className="flex justify-between bg-background/50 border-t p-6">
                  <Button variant="ghost">Refresh Status</Button>
                  <div className="flex gap-2">
                    <Button variant="outline">Test Connection</Button>
                    <Button>Save Connection</Button>
                  </div>
               </CardFooter>
            </Card>
            
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>API Status</AlertTitle>
              <AlertDescription>
                API connection is currently using Replit-hosted dummy endpoints. Switch to your own credentials above for production.
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
                   <Input defaultValue="https://api.yourdomain.com/webhook/whatsapp" />
                 </div>
                 <div className="grid gap-2">
                   <Label>Verify Token</Label>
                   <Input defaultValue="random_secure_token_123" />
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                    <Button variant="secondary" size="sm">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
