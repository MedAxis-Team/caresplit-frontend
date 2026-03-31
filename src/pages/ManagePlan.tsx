import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PauseCircle, Edit3, Shield, Calendar, CreditCard, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const ManagePlan = () => {
  const { user: authUser } = useAuth();
  const [bill, setBill] = useState(0);
  const [paid, setPaid] = useState(0);
  const [planMonths, setPlanMonths] = useState(3);

  useEffect(() => {
    if (!authUser) return;
    Promise.all([
      fetch(`/api/bills?patientId=${authUser._id}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/transactions?userId=${authUser._id}`).then((r) => r.json()).catch(() => []),
    ]).then(([bills, txs]) => {
      const totalOutstanding = bills.reduce((s: number, b: any) => s + (b.status === "Paid in Full" ? 0 : Number(b.amount || 0)), 0);
      const paidSoFar = txs.reduce((s: number, t: any) => s + (t.status === "Success" || t.status === "completed" ? Number(t.amount || 0) : 0), 0);
      const active = bills.find((b: any) => b.activePlan)?.activePlan;
      setBill(totalOutstanding);
      setPaid(paidSoFar);
      if (active?.months) setPlanMonths(active.months);
    });
  }, [authUser]);

  const remaining = Math.max(0, bill - paid);
  const progress = bill > 0 ? Math.round((paid / bill) * 100) : 0;
  const monthlyPayment = planMonths > 0 ? bill / planMonths : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your payment progress and adjust your plan as needed.</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Current Plan: {planMonths <= 3 ? "Standard" : "Extended Care"}</h2>
              <p className="text-sm text-muted-foreground">0% APR · {planMonths} months · {formatNaira(monthlyPayment)}/mo</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full w-fit">{progress}% Complete</span>
        </div>

        <Progress value={progress} className="h-2.5 mb-4" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <CreditCard className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Monthly</p>
            <p className="text-sm font-bold text-foreground">{formatNaira(monthlyPayment)}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <TrendingUp className="h-4 w-4 text-green-success mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-sm font-bold text-green-600">{formatNaira(paid)}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Calendar className="h-4 w-4 text-orange-warning mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-sm font-bold text-foreground">{formatNaira(remaining)}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Shield className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Total Bill</p>
            <p className="text-sm font-bold text-foreground">{formatNaira(bill)}</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <PauseCircle className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="font-semibold text-foreground">Pause Payment</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Take a 30–60 day break if you're facing financial hardship. No penalties applied.</p>
          <Button variant="outline" className="rounded-full w-full">Request Pause</Button>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Adjust Plan</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Change your monthly amount and recalculate your repayment duration.</p>
          <Button variant="outline" className="rounded-full w-full">Modify Plan</Button>
        </div>
      </div>
    </div>
  );
};

export default ManagePlan;
