import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PauseCircle, TrendingDown, CheckCircle2, AlertTriangle, Shield, Clock, Calendar, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

type View = "main" | "adjust";

const ManagePlan = () => {
  const { user: authUser } = useAuth();
  const [bill, setBill] = useState(0);
  const [paid, setPaid] = useState(0);
  const [planMonths, setPlanMonths] = useState(6);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [pauseDays, setPauseDays] = useState(30);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [selectedPauseDays, setSelectedPauseDays] = useState(30);

  const [view, setView] = useState<View>("main");
  const [selectedAdjustPlan, setSelectedAdjustPlan] = useState<number | null>(null);
  const [activeBillId, setActiveBillId] = useState<number | null>(null);

  useEffect(() => {
    if (!authUser) return;
    Promise.all([
      fetch(`/api/bills?patientId=${authUser._id}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/transactions?userId=${authUser._id}`).then((r) => r.json()).catch(() => []),
    ]).then(([bills, txs]) => {
      const totalOutstanding = bills.reduce((s: number, b: any) => s + (b.status === "Paid in Full" ? 0 : Number(b.amount || 0)), 0);
      const paidSoFar = txs.reduce((s: number, t: any) => s + (t.status === "Success" || t.status === "completed" ? Number(t.amount || 0) : 0), 0);
      const activeBill = bills.find((b: any) => b.activePlan);
      const active = activeBill?.activePlan;
      setBill(totalOutstanding);
      setPaid(paidSoFar);
      if (active?.months) setPlanMonths(active.months);
      if (active?.monthly) setMonthlyPayment(active.monthly);
      else if (active?.months && totalOutstanding) setMonthlyPayment(totalOutstanding / active.months);
      if (activeBill?.id) setActiveBillId(activeBill.id);
      // Check if bill is paused
      if (activeBill?.status === "Paused") {
        setIsPaused(true);
        setPauseDays(activeBill.pauseDays || 30);
      }
    });
  }, [authUser]);

  const remaining = Math.max(0, bill - paid);
  const paymentsRemaining = monthlyPayment > 0 ? Math.ceil(remaining / monthlyPayment) : 0;

  const pauseEndDate = new Date();
  pauseEndDate.setDate(pauseEndDate.getDate() + pauseDays);
  const pauseEndStr = pauseEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const previewDate = new Date();
  previewDate.setDate(previewDate.getDate() + selectedPauseDays);
  const previewDateStr = previewDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const adjustPlans = [
    { months: 9, recommended: true },
    { months: 12, recommended: false },
    { months: 18, recommended: false },
  ];

  const getNewMonthly = (months: number) => (bill > 0 ? bill / months : 0);
  const getSavings = (months: number) => (monthlyPayment > 0 ? monthlyPayment - bill / months : 0);
  const getNewEndDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleConfirmPause = async () => {
    setPauseDays(selectedPauseDays);
    setIsPaused(true);
    setShowPauseDialog(false);
    // Persist to API so bills page reflects the pause
    if (activeBillId) {
      await fetch(`/api/bills/${activeBillId}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: selectedPauseDays }),
      }).catch(() => {});
    }
  };

  // ======== ADJUST VIEW ========
  if (view === "adjust") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Adjust Payment Plan</h1>
          <p className="text-sm text-muted-foreground mt-1">We understand financial situations change. Explore your hardship options below.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Flexible Payment Options</h3>
              </div>
              <p className="text-sm text-muted-foreground">Select a lower monthly payment that works with your current income. Your total balance remains the same, but we'll extend your payment timeline.</p>
            </div>

            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Current Plan</h3>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-lg font-bold text-foreground">{planMonths} months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                  <p className="text-lg font-bold text-foreground">{formatNaira(monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                  <p className="text-lg font-bold text-foreground">{formatNaira(remaining)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{paymentsRemaining} payments remaining · Next payment: {new Date(Date.now() + 12 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-foreground text-sm">What Happens Next?</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-1">•</span> Your adjustment request will be reviewed within 24 hours</li>
                <li className="flex items-start gap-2"><span className="mt-1">•</span> The hospital will be notified of the change</li>
                <li className="flex items-start gap-2"><span className="mt-1">•</span> You'll receive a confirmation notification</li>
                <li className="flex items-start gap-2"><span className="mt-1">•</span> Your new payment schedule begins immediately after approval</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-4">How CareSplit Works</h3>
              <div className="space-y-4">
                {[
                  { num: 1, title: "Review Your Bill", desc: "Make sure the hospital charges are correct." },
                  { num: 2, title: "Choose a Plan", desc: "Select a 3, 6, or 12 month installment plan that fits your budget." },
                  { num: 3, title: "Setup Payments", desc: "Add your card or bank account for automatic deductions." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{step.num}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 rounded-full bg-primary text-primary-foreground">Learn More</Button>
            </div>
          </div>

          {/* Right column - Plan options */}
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Choose Your New Payment Plan</h3>
              <p className="text-sm text-muted-foreground">Select a plan that better fits your budget. The hospital will be notified of the adjustment.</p>
            </div>

            {adjustPlans.map((plan) => {
              const newMonthly = getNewMonthly(plan.months);
              const savings = getSavings(plan.months);
              const isSelected = selectedAdjustPlan === plan.months;
              return (
                <div
                  key={plan.months}
                  className={`rounded-2xl border-2 p-5 cursor-pointer transition-all ${isSelected ? "border-primary bg-purple-50/50" : "border-border bg-card hover:border-primary/40"}`}
                  onClick={() => setSelectedAdjustPlan(plan.months)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{plan.months} Month Plan</h4>
                      {plan.recommended && <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">Recommended</span>}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary" : "border-muted-foreground/30"}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center gap-1 text-green-600 text-xs mb-3">
                      <ChevronDown className="h-3 w-3" />
                      <span>{formatNaira(savings)}/month less</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">New Monthly Payment</p>
                      <p className="text-2xl font-bold text-foreground">{formatNaira(newMonthly)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-foreground">{formatNaira(bill)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>New end date: {getNewEndDate(plan.months)}</span>
                  </div>
                </div>
              );
            })}

            <Button className="w-full rounded-full bg-primary text-primary-foreground py-3" disabled={!selectedAdjustPlan} onClick={async () => {
              if (activeBillId && selectedAdjustPlan) {
                await fetch(`/api/bills/${activeBillId}/adjust`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ months: selectedAdjustPlan }),
                }).catch(() => {});
                // Update local state
                const newMonthly = bill > 0 ? Math.round(bill / selectedAdjustPlan) : 0;
                setPlanMonths(selectedAdjustPlan);
                setMonthlyPayment(newMonthly);
              }
              setView("main");
              setSelectedAdjustPlan(null);
            }}>Submit Payment Adjustment</Button>
            <Button variant="outline" className="w-full rounded-full py-3" onClick={() => { setView("main"); setSelectedAdjustPlan(null); }}>Cancel</Button>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"><Shield className="h-6 w-6 text-primary" /></div>
            <div>
              <h3 className="font-semibold text-foreground">Need additional help?</h3>
              <p className="text-sm text-muted-foreground">If you're facing severe financial hardship, our Care Advocates can help negotiate directly with the hospital.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full whitespace-nowrap border-primary text-primary">Contact Support</Button>
        </div>
      </div>
    );
  }

  // ======== MAIN VIEW ========
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Manage Payment Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">We understand financial situations change. Explore your hardship options below.</p>
      </div>

      {isPaused && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-700">Payments Paused</h3>
              <p className="text-sm text-amber-600">Your payments are paused for {pauseDays} days. The hospital has been notified. Next payment due on {pauseEndStr}.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-lg whitespace-nowrap border-amber-300 text-amber-700 hover:bg-amber-100" onClick={async () => {
            setIsPaused(false);
            if (activeBillId) {
              await fetch(`/api/bills/${activeBillId}/resume`, { method: "POST" }).catch(() => {});
            }
          }}>Undo Pause</Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-card rounded-2xl border p-6 flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
            <PauseCircle className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-2">Request Payment Pause</h3>
          <p className="text-sm text-muted-foreground mb-4">Temporarily pause your payments for 30 to 60 days without penalty.</p>
          <div className="space-y-2.5 mb-6 flex-1">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">Hospital will be notified</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">No late fees incurred</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">Plan extended by paused duration</span></div>
          </div>
          <Button className="w-full rounded-full bg-primary text-primary-foreground" onClick={() => setShowPauseDialog(true)}>Pause Payment</Button>
        </div>

        <div className="bg-card rounded-2xl border p-6 flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <TrendingDown className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-2">Flexible Payment Adjustment</h3>
          <p className="text-sm text-muted-foreground mb-4">Reduce your monthly payment amount temporarily and extend your plan.</p>
          <div className="space-y-2.5 mb-6 flex-1">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">Lower monthly burden</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">Extend plan up to 24 months</span></div>
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" /><span className="text-sm text-muted-foreground">May increase total interest paid</span></div>
          </div>
          <Button variant="outline" className="w-full rounded-full border-primary/30 text-primary hover:bg-purple-50" onClick={() => setView("adjust")}>Adjust Payment</Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"><Shield className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="font-semibold text-foreground">Need additional help?</h3>
            <p className="text-sm text-muted-foreground">If you're facing severe financial hardship, our Care Advocates can help negotiate directly with the hospital.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full whitespace-nowrap border-primary text-primary">Contact Support</Button>
      </div>

      {showPauseDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowPauseDialog(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-xl font-bold text-foreground mb-1">Confirm Payment Pause</h2>
            <p className="text-sm text-muted-foreground mb-6">Select how long you need to pause your payments.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className={`rounded-xl border-2 p-4 text-center transition-all ${selectedPauseDays === 30 ? "border-primary bg-purple-50" : "border-border hover:border-primary/40"}`} onClick={() => setSelectedPauseDays(30)}>
                <p className="text-3xl font-bold text-foreground">30</p>
                <p className="text-sm text-muted-foreground">Days</p>
              </button>
              <button className={`rounded-xl border-2 p-4 text-center transition-all ${selectedPauseDays === 60 ? "border-primary bg-purple-50" : "border-border hover:border-primary/40"}`} onClick={() => setSelectedPauseDays(60)}>
                <p className="text-3xl font-bold text-foreground">60</p>
                <p className="text-sm text-muted-foreground">Days</p>
              </button>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-foreground text-sm">What happens next?</p>
              </div>
              <p className="text-sm text-muted-foreground">Your next payment of {formatNaira(monthlyPayment)} will be delayed until <strong>{previewDateStr}</strong>. The hospital billing department will be notified of this change automatically.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowPauseDialog(false)}>Cancel</Button>
              <Button className="flex-1 rounded-full bg-primary text-primary-foreground" onClick={handleConfirmPause}>Confirm Pause</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlan;
