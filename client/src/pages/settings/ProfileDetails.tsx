import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth, getAuthHeaders } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Shield, ShieldCheck, UserCog, Crown, Mail, AtSign, Loader2 } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { 
    label: "Super Admin", 
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <Crown className="h-3 w-3" />
  },
  sub_admin: { 
    label: "Sub Admin", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <ShieldCheck className="h-3 w-3" />
  },
  manager: { 
    label: "Manager", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <UserCog className="h-3 w-3" />
  },
  user: { 
    label: "User", 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <User className="h-3 w-3" />
  },
  admin: {
    label: "Admin",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <Shield className="h-3 w-3" />
  }
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileDetails() {
  const { user, checkAuth } = useAuth();
  const [timezone, setTimezone] = useState("utc");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => {
      checkAuth();
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const roleConfig = ROLE_CONFIG[user?.role || "user"] || ROLE_CONFIG.user;

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profile Details</h2>
            <p className="text-muted-foreground">View and update your account information.</p>
          </div>
          <Badge className={`${roleConfig.color} flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium`}>
            {roleConfig.icon}
            {roleConfig.label}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your login and role details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge variant="outline" className={`${roleConfig.color} flex items-center gap-1 w-fit`}>
                    {roleConfig.icon}
                    {roleConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <AtSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                </div>

                {user.pageAccess && user.pageAccess.length > 0 && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-2">Page Access</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.pageAccess.map(page => (
                        <Badge key={page} variant="secondary" className="text-xs capitalize">
                          {page.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="ist">IST (GMT+5:30)</SelectItem>
                    <SelectItem value="est">EST (GMT-5)</SelectItem>
                    <SelectItem value="pst">PST (GMT-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => updateProfileMutation.mutate(formData)}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
