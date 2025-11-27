import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link2, Trash2, Bot, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Form {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
}

interface Mapping {
  id: string;
  formId?: string;
  senderId?: string;
  agentId: string;
  agent?: { id: string; name: string };
  form?: { id: string; name: string };
  createdAt: string;
}

export default function MapAgent() {
  const queryClient = useQueryClient();
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const { data: forms = [] } = useQuery<Form[]>({
    queryKey: ['facebook-forms'],
    queryFn: api.facebook.getForms,
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: api.agents.getAll,
  });

  const { data: mappings = [], isLoading } = useQuery<Mapping[]>({
    queryKey: ['mappings'],
    queryFn: api.mapping.getAll,
  });

  const createMutation = useMutation({
    mutationFn: api.mapping.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      toast.success('Mapping created successfully');
      setSelectedFormId('');
      setSelectedAgentId('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.mapping.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      toast.success('Mapping deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCreateMapping = () => {
    if (!selectedFormId || !selectedAgentId) {
      toast.error('Please select both a form and an agent');
      return;
    }
    createMutation.mutate({ formId: selectedFormId, agentId: selectedAgentId });
  };

  const mappedFormIds = mappings.map((m) => m.formId).filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent-Form Mapping</h1>
        <p className="text-muted-foreground">
          Assign AI agents to Facebook forms for automated responses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Mapping
            </CardTitle>
            <CardDescription>
              Select a Facebook form and assign an AI agent to handle leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook Form</Label>
              <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a form" />
                </SelectTrigger>
                <SelectContent>
                  {forms.length === 0 ? (
                    <SelectItem value="_none" disabled>
                      No forms available - sync forms first
                    </SelectItem>
                  ) : (
                    forms.map((form) => (
                      <SelectItem
                        key={form.id}
                        value={form.id}
                        disabled={mappedFormIds.includes(form.id)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {form.name}
                          {mappedFormIds.includes(form.id) && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              Mapped
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.length === 0 ? (
                    <SelectItem value="_none" disabled>
                      No agents available - create an agent first
                    </SelectItem>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          {agent.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateMapping}
              className="w-full"
              disabled={!selectedFormId || !selectedAgentId}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Create Mapping
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Active Mappings ({mappings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading mappings...</div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-8">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No mappings created yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create a mapping to assign agents to forms
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {mapping.form?.name || mapping.formId || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">
                            {mapping.agent?.name || mapping.agentId || 'Unknown'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
