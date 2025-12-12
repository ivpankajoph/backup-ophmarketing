import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw,
  Search,
  Send,
  Link2,
  Unlink,
  ExternalLink,
  Bot,
  FileText,
  MoreVertical,
  Check,
  AlertCircle,
  Clock,
  Workflow,
  Eye,
  Plus,
  Trash2,
  Upload,
  Archive
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthHeaders } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface WhatsAppFlow {
  _id: string;
  flowId: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'BLOCKED' | 'THROTTLED';
  categories: string[];
  validationErrors: string[];
  previewUrl?: string;
  entryPoints: { id: string; name: string; type: string }[];
  linkedTemplateIds: string[];
  linkedAgentIds: string[];
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface FlowStats {
  totalFlows: number;
  publishedFlows: number;
  draftFlows: number;
  linkedToTemplates: number;
  linkedToAgents: number;
}

interface Agent {
  id: string;
  name: string;
  isActive: boolean;
}

interface Template {
  id: string;
  name: string;
  status: string;
}

const FLOW_CATEGORIES = [
  { value: 'LEAD_GENERATION', label: 'Lead Generation' },
  { value: 'SIGN_UP', label: 'Sign Up' },
  { value: 'SIGN_IN', label: 'Sign In' },
  { value: 'APPOINTMENT_BOOKING', label: 'Appointment Booking' },
  { value: 'CONTACT_US', label: 'Contact Us' },
  { value: 'CUSTOMER_SUPPORT', label: 'Customer Support' },
  { value: 'SURVEY', label: 'Survey' },
  { value: 'OTHER', label: 'Other' }
];

export default function FlowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFlow, setSelectedFlow] = useState<WhatsAppFlow | null>(null);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [attachType, setAttachType] = useState<'agent' | 'template'>('agent');
  const [sendForm, setSendForm] = useState({
    phoneNumber: "",
    headerText: "",
    bodyText: "",
    footerText: "",
    ctaText: "Start"
  });
  const [createForm, setCreateForm] = useState({
    name: "",
    categories: [] as string[],
    endpointUri: ""
  });

  const queryClient = useQueryClient();

  const { data: flowsData, isLoading } = useQuery<{ flows: WhatsAppFlow[]; total: number }>({
    queryKey: ["/api/whatsapp/flows", statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      const res = await fetch(`/api/whatsapp/flows?${params}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch flows");
      return res.json();
    }
  });

  const { data: statsData } = useQuery<FlowStats>({
    queryKey: ["/api/whatsapp/flows/stats"],
    queryFn: async () => {
      const res = await fetch("/api/whatsapp/flows/stats", {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    }
  });

  const { data: syncStatusData } = useQuery({
    queryKey: ["/api/whatsapp/flows/sync-status"],
    queryFn: async () => {
      const res = await fetch("/api/whatsapp/flows/sync-status", {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch sync status");
      return res.json();
    }
  });

  const { data: agentsData } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/ai-agents"],
    queryFn: async () => {
      const res = await fetch("/api/ai-agents", {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    }
  });

  const { data: templatesData } = useQuery<{ templates: Template[] }>({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates", {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    }
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/whatsapp/flows/sync", {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to sync flows");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/sync-status"] });
      toast.success(`Synced ${data.synced} flows (${data.created} new, ${data.updated} updated)`);
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const sendFlowMutation = useMutation({
    mutationFn: async ({ flowId, data }: { flowId: string; data: typeof sendForm }) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/send`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to send flow");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Flow sent successfully");
      setIsSendDialogOpen(false);
      setSendForm({ phoneNumber: "", headerText: "", bodyText: "", footerText: "", ctaText: "Start" });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const attachAgentMutation = useMutation({
    mutationFn: async ({ flowId, agentId }: { flowId: string; agentId: string }) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/attach-agent`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ agentId })
      });
      if (!res.ok) throw new Error("Failed to attach agent");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      toast.success("Agent attached to flow");
      setIsAttachDialogOpen(false);
    }
  });

  const attachTemplateMutation = useMutation({
    mutationFn: async ({ flowId, templateId }: { flowId: string; templateId: string }) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/attach-template`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ templateId })
      });
      if (!res.ok) throw new Error("Failed to attach template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      toast.success("Template attached to flow");
      setIsAttachDialogOpen(false);
    }
  });

  const detachAgentMutation = useMutation({
    mutationFn: async ({ flowId, agentId }: { flowId: string; agentId: string }) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/attach-agent/${agentId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to detach agent");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      toast.success("Agent detached from flow");
    }
  });

  const createFlowMutation = useMutation({
    mutationFn: async (data: { name: string; categories: string[]; endpointUri?: string }) => {
      const res = await fetch("/api/whatsapp/flows/create", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to create flow");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/stats"] });
      toast.success(`Flow "${data.flow.name}" created successfully`);
      setIsCreateDialogOpen(false);
      setCreateForm({ name: "", categories: [], endpointUri: "" });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const publishFlowMutation = useMutation({
    mutationFn: async (flowId: string) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/publish`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to publish flow");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/stats"] });
      toast.success("Flow published successfully");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deprecateFlowMutation = useMutation({
    mutationFn: async (flowId: string) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/deprecate`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to deprecate flow");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/stats"] });
      toast.success("Flow deprecated successfully");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteFlowMutation = useMutation({
    mutationFn: async (flowId: string) => {
      const res = await fetch(`/api/whatsapp/flows/${flowId}/meta`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete flow");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/flows/stats"] });
      toast.success("Flow deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
      PUBLISHED: { variant: "default", icon: Check },
      DRAFT: { variant: "secondary", icon: Clock },
      DEPRECATED: { variant: "outline", icon: AlertCircle },
      BLOCKED: { variant: "destructive", icon: AlertCircle },
      THROTTLED: { variant: "outline", icon: Clock }
    };
    const config = statusConfig[status] || { variant: "outline", icon: null };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  const activeAgents = agentsData?.agents?.filter(a => a.isActive) || [];
  const approvedTemplates = templatesData?.templates?.filter(t => t.status === 'APPROVED') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp Flows</h1>
            <p className="text-gray-500 mt-1">
              Manage and send interactive WhatsApp flows from Meta Business Suite
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              Sync from Meta
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Flow
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.totalFlows || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statsData?.publishedFlows || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statsData?.draftFlows || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Linked to Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statsData?.linkedToAgents || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Linked to Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statsData?.linkedToTemplates || 0}</div>
            </CardContent>
          </Card>
        </div>

        {syncStatusData?.lastSyncedAt && (
          <p className="text-sm text-gray-500">
            Last synced: {new Date(syncStatusData.lastSyncedAt).toLocaleString()}
          </p>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Flows</CardTitle>
                <CardDescription>Flows synced from your Meta Business Suite</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search flows..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="DEPRECATED">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading flows...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flow Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Linked Agents</TableHead>
                    <TableHead>Linked Templates</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flowsData?.flows?.map((flow) => (
                    <TableRow key={flow._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Workflow className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{flow.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(flow.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {flow.categories?.length > 0 ? (
                            flow.categories.map((cat, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Bot className="h-3 w-3" />
                          {flow.linkedAgentIds?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {flow.linkedTemplateIds?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(flow.lastSyncedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {flow.status === 'PUBLISHED' && (
                              <DropdownMenuItem onClick={() => {
                                setSelectedFlow(flow);
                                setIsSendDialogOpen(true);
                              }}>
                                <Send className="h-4 w-4 mr-2" />
                                Send to User
                              </DropdownMenuItem>
                            )}
                            {flow.status === 'DRAFT' && (
                              <DropdownMenuItem onClick={() => publishFlowMutation.mutate(flow._id)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Publish Flow
                              </DropdownMenuItem>
                            )}
                            {flow.status === 'PUBLISHED' && (
                              <DropdownMenuItem onClick={() => deprecateFlowMutation.mutate(flow._id)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Deprecate Flow
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                              setSelectedFlow(flow);
                              setAttachType('agent');
                              setIsAttachDialogOpen(true);
                            }}>
                              <Bot className="h-4 w-4 mr-2" />
                              Attach to AI Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedFlow(flow);
                              setAttachType('template');
                              setIsAttachDialogOpen(true);
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              Attach to Template
                            </DropdownMenuItem>
                            {flow.previewUrl && (
                              <DropdownMenuItem onClick={() => window.open(flow.previewUrl, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Flow
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => window.open('https://business.facebook.com/latest/whatsapp_manager/flows', '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Edit in Meta
                            </DropdownMenuItem>
                            {flow.status === 'DRAFT' && (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this flow? This will also delete it from Meta.')) {
                                    deleteFlowMutation.mutate(flow._id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Flow
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!flowsData?.flows || flowsData.flows.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        <Workflow className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No flows found</p>
                        <p className="text-sm">Click "Sync Flows" to import from Meta Business Suite</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Flow: {selectedFlow?.name}</DialogTitle>
              <DialogDescription>
                Send this interactive flow to a WhatsApp user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  placeholder="e.g., 919876543210"
                  value={sendForm.phoneNumber}
                  onChange={(e) => setSendForm({ ...sendForm, phoneNumber: e.target.value })}
                />
                <p className="text-xs text-gray-500">Include country code without + sign</p>
              </div>
              <div className="space-y-2">
                <Label>Header Text</Label>
                <Input
                  placeholder="Optional header message"
                  value={sendForm.headerText}
                  onChange={(e) => setSendForm({ ...sendForm, headerText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Body Text</Label>
                <Input
                  placeholder="Message body"
                  value={sendForm.bodyText}
                  onChange={(e) => setSendForm({ ...sendForm, bodyText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  placeholder="e.g., Start"
                  value={sendForm.ctaText}
                  onChange={(e) => setSendForm({ ...sendForm, ctaText: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  if (selectedFlow) {
                    sendFlowMutation.mutate({ flowId: selectedFlow._id, data: sendForm });
                  }
                }}
                disabled={!sendForm.phoneNumber || sendFlowMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Flow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAttachDialogOpen} onOpenChange={setIsAttachDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Attach {attachType === 'agent' ? 'AI Agent' : 'Template'} to: {selectedFlow?.name}
              </DialogTitle>
              <DialogDescription>
                Select {attachType === 'agent' ? 'an AI agent' : 'a template'} to link with this flow
              </DialogDescription>
            </DialogHeader>
            <Tabs value={attachType} onValueChange={(v) => setAttachType(v as 'agent' | 'template')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="agent">AI Agents</TabsTrigger>
                <TabsTrigger value="template">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="agent" className="space-y-2 mt-4">
                {activeAgents.length > 0 ? (
                  activeAgents.map(agent => (
                    <div 
                      key={agent.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        if (selectedFlow) {
                          attachAgentMutation.mutate({ flowId: selectedFlow._id, agentId: agent.id });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <span>{agent.name}</span>
                      </div>
                      <Link2 className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No active AI agents available</p>
                )}
              </TabsContent>
              <TabsContent value="template" className="space-y-2 mt-4">
                {approvedTemplates.length > 0 ? (
                  approvedTemplates.map(template => (
                    <div 
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        if (selectedFlow) {
                          attachTemplateMutation.mutate({ flowId: selectedFlow._id, templateId: template.id });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>{template.name}</span>
                      </div>
                      <Link2 className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No approved templates available</p>
                )}
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAttachDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create WhatsApp Flow</DialogTitle>
              <DialogDescription>
                Create a new flow that will appear in your Meta Business Suite
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Flow Name *</Label>
                <Input
                  placeholder="e.g., Lead Capture Form"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categories * (select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {FLOW_CATEGORIES.map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat.value}
                        checked={createForm.categories.includes(cat.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCreateForm({
                              ...createForm,
                              categories: [...createForm.categories, cat.value]
                            });
                          } else {
                            setCreateForm({
                              ...createForm,
                              categories: createForm.categories.filter(c => c !== cat.value)
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={cat.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {cat.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endpoint URI (optional)</Label>
                <Input
                  placeholder="https://your-server.com/webhook/flows"
                  value={createForm.endpointUri}
                  onChange={(e) => setCreateForm({ ...createForm, endpointUri: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Required for dynamic flows (Flow JSON v3.0+). Leave empty for static flows.
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Note:</p>
                <p className="text-gray-600">
                  After creating, you'll need to add screens and components in Meta's Flow Builder, 
                  then publish the flow to make it available for sending.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  createFlowMutation.mutate({
                    name: createForm.name,
                    categories: createForm.categories,
                    endpointUri: createForm.endpointUri || undefined
                  });
                }}
                disabled={!createForm.name || createForm.categories.length === 0 || createFlowMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Flow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
