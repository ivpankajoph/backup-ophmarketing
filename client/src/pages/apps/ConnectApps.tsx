import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Facebook, Instagram, Globe, Webhook, MessageSquare, FileSpreadsheet } from "lucide-react";

export default function ConnectApps() {
  const apps = [
    { name: "Facebook Leads", description: "Sync leads from Facebook Ads", icon: Facebook, color: "bg-blue-600" },
    { name: "Instagram", description: "Connect Instagram Direct Messages", icon: Instagram, color: "bg-pink-600" },
    { name: "Webhooks", description: "Receive real-time data via webhooks", icon: Webhook, color: "bg-purple-600" },
    { name: "Google Sheets", description: "Sync contacts and messages", icon: FileSpreadsheet, color: "bg-green-600" },
    { name: "Zapier", description: "Connect with 5000+ apps", icon: Globe, color: "bg-orange-600" },
    { name: "Shopify", description: "Send order updates automatically", icon: MessageSquare, color: "bg-green-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Connect Apps</h2>
          <p className="text-muted-foreground">Integrate with your favorite tools and services.</p>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for apps..." className="pl-9" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Card key={app.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white ${app.color}`}>
                  <app.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base">{app.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 h-10">{app.description}</CardDescription>
                <Button variant="outline" className="w-full">Connect</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
