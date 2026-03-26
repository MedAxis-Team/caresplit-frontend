import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PauseCircle, Edit3 } from "lucide-react";

const ManagePlan = () => (
  <div className="max-w-3xl">
    <h1 className="text-2xl font-bold text-foreground mb-6">Manage Plan</h1>

    <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
      <h2 className="font-semibold text-foreground mb-2">Current Plan: Standard</h2>
      <p className="text-sm text-muted-foreground mb-4">0% APR · 4 months · $612.50/mo</p>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">Progress</span>
        <span className="text-primary font-medium">65% complete</span>
      </div>
      <Progress value={65} className="h-2 mb-4" />
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Paid: $1,592</span>
        <span className="text-muted-foreground">Remaining: $858</span>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <PauseCircle className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-foreground">Pause Payment</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Take a 30–60 day break if you're facing financial hardship.</p>
        <Button variant="outline" className="rounded-full w-full">Pause Payment</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Edit3 className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-foreground">Adjust Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Change your monthly amount and recalculate duration.</p>
        <Button variant="outline" className="rounded-full w-full">Adjust Plan</Button>
      </div>
    </div>
  </div>
);

export default ManagePlan;
