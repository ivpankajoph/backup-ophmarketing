import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Calendar, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Lead {
  id: string;
  formId: string;
  fieldData: Record<string, string>;
  fbCreatedTime: string;
  createdAt: string;
}

interface Form {
  id: string;
  name: string;
}

export default function Leads() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string>('all');

  const { data: forms = [] } = useQuery<Form[]>({
    queryKey: ['facebook-forms'],
    queryFn: api.facebook.getForms,
  });

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['facebook-leads', selectedFormId],
    queryFn: () => api.facebook.getLeads(selectedFormId === 'all' ? undefined : selectedFormId),
  });

  const syncLeadsMutation = useMutation({
    mutationFn: api.facebook.syncLeads,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['facebook-leads'] });
      toast.success(data.message || 'Leads synced successfully');
      setSyncing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync leads');
      setSyncing(false);
    },
  });

  const handleSync = () => {
    setSyncing(true);
    syncLeadsMutation.mutate();
  };

  const getFormName = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    return form?.name || formId;
  };

  const getFieldValue = (fieldData: Record<string, string>, keys: string[]) => {
    for (const key of keys) {
      const value = fieldData[key] || fieldData[key.toLowerCase()] || fieldData[key.toUpperCase()];
      if (value) return value;
    }
    return '-';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facebook Leads</h1>
          <p className="text-muted-foreground">View and manage leads from your Facebook forms</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedFormId} onValueChange={setSelectedFormId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Leads'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Leads ({leads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No leads found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Sync Leads" to fetch leads from Facebook
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {getFieldValue(lead.fieldData, ['full_name', 'name', 'first_name'])}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {getFieldValue(lead.fieldData, ['email', 'email_address'])}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {getFieldValue(lead.fieldData, ['phone', 'phone_number', 'mobile'])}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getFormName(lead.formId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {lead.fbCreatedTime
                          ? new Date(lead.fbCreatedTime).toLocaleDateString()
                          : new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
