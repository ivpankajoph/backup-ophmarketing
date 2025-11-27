import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageTemplates() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold tracking-tight">Manage Templates</h2>
        <Card>
          <CardHeader>
             <CardTitle>Edit & Delete</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Manage your existing templates. Note that editing an approved template will require re-approval.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
