import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Play } from "lucide-react";

export default function NewAgent() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold tracking-tight">New AI Agent</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Define how your AI agent should behave.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Agent Name</Label>
                <Input placeholder="e.g., Support Bot Level 1" />
              </div>
              <div className="grid gap-2">
                <Label>System Instructions</Label>
                <Textarea 
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="You are a helpful support assistant for Acme Corp. You answer questions about our widgets. If you don't know the answer, politely transfer the chat to a human agent."
                />
              </div>
              <Button className="w-full">
                 Create Agent
              </Button>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Test Playground</CardTitle>
              <CardDescription>Interact with your agent to test the instructions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 bg-muted/50 rounded-md border p-4 mb-4">
                <div className="flex gap-2 mb-4">
                   <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                     <Bot className="h-5 w-5" />
                   </div>
                   <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-sm">
                     Hello! I am your AI assistant. How can I help you today?
                   </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." />
                <Button size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
