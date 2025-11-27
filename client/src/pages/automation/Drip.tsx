import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, ArrowRight, MessageSquare } from "lucide-react";

export default function Drip() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold tracking-tight">Drip Campaigns</h2>
             <p className="text-muted-foreground">Create multi-day sequences for onboarding or nurturing.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <Card className="bg-muted/20 border-dashed border-2">
           <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">New Customer Onboarding Sequence</h3>
              <p className="text-muted-foreground max-w-md">
                This sequence triggers when a new tag "Customer" is added to a contact.
              </p>
              
              <div className="w-full max-w-3xl mt-8 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-[20px] top-8 bottom-8 w-0.5 bg-border"></div>

                 {/* Day 1 */}
                 <div className="relative flex gap-6 mb-8 text-left">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shrink-0">
                      1
                    </div>
                    <Card className="flex-1">
                       <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                             <span>Day 1: Welcome Message</span>
                             <Badge>Active</Badge>
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="py-3 text-sm text-muted-foreground">
                          "Welcome to the family! Here is your getting started guide..."
                       </CardContent>
                    </Card>
                 </div>

                 {/* Day 3 */}
                 <div className="relative flex gap-6 mb-8 text-left">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shrink-0">
                      3
                    </div>
                    <Card className="flex-1">
                       <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                             <span>Day 3: Product Tips</span>
                             <Badge>Active</Badge>
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="py-3 text-sm text-muted-foreground">
                          "Did you know you can do X with our product? Check this out..."
                       </CardContent>
                    </Card>
                 </div>
                 
                 {/* Day 7 */}
                 <div className="relative flex gap-6 text-left">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shrink-0">
                      7
                    </div>
                    <Card className="flex-1">
                       <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                             <span>Day 7: Review Request</span>
                             <Badge variant="secondary">Draft</Badge>
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="py-3 text-sm text-muted-foreground">
                          "How are you liking it so far? We would love your feedback..."
                       </CardContent>
                    </Card>
                 </div>
              </div>
              
              <Button variant="outline" className="mt-4">
                 <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
           </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
