import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, FileText, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Form {
  id: string;
  name: string;
  status: string;
  leadsCount: number;
  fbCreatedTime: string;
  createdAt: string;
}

export default function LeadForms() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: forms = [], isLoading } = useQuery<Form[]>({
    queryKey: ['facebook-forms'],
    queryFn: api.facebook.getForms,
  });

  const syncFormsMutation = useMutation({
    mutationFn: api.facebook.syncForms,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['facebook-forms'] });
      toast.success(data.message || 'Forms synced successfully');
      setSyncing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync forms');
      setSyncing(false);
    },
  });

  const handleSync = () => {
    setSyncing(true);
    syncFormsMutation.mutate();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facebook Lead Forms</h1>
          <p className="text-muted-foreground">Manage and sync your Facebook Lead Ad forms</p>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Forms'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lead Forms ({forms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading forms...</div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No forms found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Sync Forms" to fetch forms from Facebook
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Form ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leads Count</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell className="font-mono text-sm">{form.id}</TableCell>
                    <TableCell>
                      <Badge variant={form.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {form.leadsCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {form.fbCreatedTime ? new Date(form.fbCreatedTime).toLocaleDateString() : '-'}
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
