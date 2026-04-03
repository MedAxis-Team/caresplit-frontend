import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  CheckCircle2,
  Calendar,
  CreditCard,
  Receipt,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardCard from "@/assets/dashboard-card.png";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [bill, setBill] = useState(0);
  const [paid, setPaid] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [nextDue, setNextDue] = useState<string | null>(null);
  const [billsArr, setBillsArr] = useState<any[]>([]);

  useEffect(() => {
    if (!authUser) return;
    const fetchData = async () => {
      try {
        const [billsRes, txsRes, actsRes] = await Promise.all([
          fetch(`/api/bills?patientId=${authUser._id}`),
          fetch(`/api/transactions?userId=${authUser._id}`),
          fetch(`/api/activities?userId=${authUser._id}`),
        ]);
        const bills = await billsRes.json();
        const txs = await txsRes.json();
        const acts = await actsRes.json();

        const totalOutstanding = bills.reduce((s: number, b: any) => s + (b.status === "Paid in Full" ? 0 : Number(b.amount || 0)), 0);
        const paidSoFar = txs.reduce((s: number, t: any) => s + (t.status === "Success" || t.status === "completed" ? Number(t.amount || 0) : 0), 0);
        const next = (bills.find((b: any) => b.date && b.status !== "Paid in Full") || null)?.date || null;

        setBill(totalOutstanding);
        setPaid(paidSoFar);
        setTransactions(txs);
        setActivities(acts);
        setNextDue(next);
        setBillsArr(bills);
      } catch (err) {
        // fallback to empty states
        setBill(0);
        setPaid(0);
        setTransactions([]);
        setActivities([]);
        setNextDue(null);
        setBillsArr([]);
      }
    };
    fetchData();
  }, [authUser]);

  // helpers
  const formatCurrency = (n: number) => formatNaira(n);

  const activePlan = billsArr.find((b: any) => b.status === "Plan Active" && b.activePlan)?.activePlan || null;
  const firstName = authUser?.name ? authUser.name.split(" ")[0] : "Jane";
  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(activePlan?.months || 3);

  useEffect(() => {
    // keep dashboard selection in sync with any persisted active plan
    if (activePlan && activePlan.months) setSelectedPlanMonths(activePlan.months);
  }, [activePlan]);

  // fallback sample transactions removed — show empty state when no real data
  const txList = transactions;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative gradient-hero rounded-2xl p-5 sm:p-8 text-primary-foreground overflow-hidden min-h-[160px] sm:min-h-[180px] flex items-center">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Hello, {firstName}</h1>
          <p className="text-primary-foreground/80 max-w-md text-xs sm:text-sm mb-4">
            {bill === 0
              ? "Your health finances are looking healthy. Add a bill to get started."
              : `You're on track. You've paid ${formatCurrency(paid)} out of ${formatCurrency(bill)}.`}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="secondary" size="sm" className="rounded-full text-xs sm:text-sm" onClick={() => navigate("/dashboard/bills")}>View All Bills</Button>
            <Button size="sm" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur text-xs sm:text-sm" onClick={() => navigate("/dashboard/payment-plans")}>Make Payment</Button>
          </div>
        </div>

        <img src={dashboardCard} alt="" className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-24 sm:h-32 opacity-60 sm:opacity-80 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <StatCard icon={DollarSign} label="TOTAL BILL" value={formatCurrency(bill)} sub={bill ? "" : "No bills yet"} />
            <StatCard icon={CheckCircle2} label="ACTIVE PLAN" value={activePlan ? `${activePlan.months} Months` : (bill === 0 ? "None" : "Standard") } sub={activePlan ? `${activePlan.months}-month plan active` : (bill === 0 ? "No active plan" : "Auto-renew active")} highlighted />
            <StatCard icon={Calendar} label="NEXT DUE" value={nextDue || "-"} sub={nextDue ? "Upcoming" : "No due date"} />
          </div>

          {/* Payment Milestone */}
          <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Payment Milestone Progress</h3>
              <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">{bill ? `${Math.round((paid / bill) * 100)}% Completed` : "0% Completed"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{formatCurrency(paid)}</p>
                <p className="text-xs text-muted-foreground">Paid to date</p>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-muted-foreground">{formatCurrency(Math.max(0, bill - paid))}</p>
                <p className="text-xs text-muted-foreground">Remaining balance</p>
              </div>
            </div>
            <Progress value={bill ? (paid / bill) * 100 : 0} className="h-2 mb-4" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-primary flex-shrink-0" /> Medical Fees <span className="text-muted-foreground">{formatCurrency(bill)} · 100%</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-purple-glow flex-shrink-0" /> Platform Interest <span className="text-muted-foreground">{formatCurrency(0)} · 0%</span>
              </div>
            </div>
          </div>

          {/* Transaction Breakdown */}
          <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Transaction Breakdown</h3>
              <button onClick={() => navigate('/dashboard/transactions')} className="text-sm text-primary flex items-center gap-1 hover:underline">View Detailed Statement <ArrowUpRight className="h-3 w-3" /></button>
            </div>
            <div className="space-y-4">
              {txList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No transactions yet. Your payments will appear here.</div>
              ) : txList.slice(0, 8).map((tx: any, idx: number) => {
                  const IconComp = tx.icon || Receipt;
                  return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <IconComp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.title || tx.desc || tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.sub || tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(Number(tx.amount || 0))}</p>
                      <p className="text-xs text-green-success font-medium">Verified</p>
                    </div>
                  </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Payment Plans */}
          <div className="bg-card rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Payment Plans</h3>
              <a href="#" className="text-xs text-primary hover:underline" onClick={(e) => { e.preventDefault(); navigate(`/dashboard/payment-plans?selected=${selectedPlanMonths}`); }}>Compare</a>
            </div>
            {/* Standard / Active Plan */}
            <div className={`border-2 ${selectedPlanMonths === 3 ? 'border-primary' : 'border-border'} rounded-xl p-4 mb-3 relative cursor-pointer transition-all duration-200`} onClick={() => setSelectedPlanMonths(3)}>
              {selectedPlanMonths === 3 && <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>}
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Standard Plan</p>
                  <p className="text-xs text-muted-foreground">0% APR · 3 MONTHS</p>
                </div>
              </div>
              <p className="text-xl font-bold text-primary mt-2">{formatCurrency(bill ? (bill / 3) : 0)} <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            {/* Extended Plan */}
            <div className={`border-2 ${selectedPlanMonths === 12 ? 'border-primary' : 'border-border'} rounded-xl p-4 relative cursor-pointer transition-all duration-200`} onClick={() => setSelectedPlanMonths(12)}>
              {selectedPlanMonths === 12 && <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>}
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Extended Care</p>
                  <p className="text-xs text-muted-foreground">0% APR · 12 MONTHS</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold text-foreground">{formatCurrency(bill ? (bill / 12) : 0)} <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/payment-plans?selected=12`); }}>Select</Button>
              </div>
            </div>

            <div className="mt-3">
              <Button size="sm" className="w-full rounded-full bg-primary text-white" onClick={() => {
                navigate('/dashboard/payment-plans');
              }}>Make Payment</Button>
            </div>
          </div>

          {/* Financial Counseling */}
          <div className="gradient-hero rounded-2xl p-5 text-primary-foreground">
            <h3 className="font-bold text-lg mb-2">Need Financial Counseling?</h3>
            <p className="text-xs text-primary-foreground/80 mb-4">Talk to our experts to restructure your medical debt at no cost. We'll help you review your bills, organize your payments, and create a plan that makes your healthcare expenses more manageable.</p>
            <Button variant="secondary" size="sm" className="w-full rounded-full">
              <Phone className="h-4 w-4 mr-2" /> Schedule Call
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Recent Activity</h3>
              <button onClick={() => navigate('/dashboard/notifications')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground text-sm">No recent activity.</p>
              ) : (activities.slice(0, 3)).map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${a.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.desc}</p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                  {a.amount && <p className="text-sm font-semibold text-foreground">{formatCurrency(a.amount)}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, highlighted }: { icon: any; label: string; value: string; sub: string; highlighted?: boolean }) => (
  <div className={`bg-card rounded-2xl shadow-card p-5 ${highlighted ? "border-2 border-primary" : ""}`}>
    <div className="flex items-center justify-between mb-3">
      <p className={`text-xs font-semibold uppercase tracking-wider ${highlighted ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <p className="text-2xl font-extrabold text-foreground">{value}</p>
    <p className={`text-xs mt-1 ${highlighted ? "text-primary" : sub?.startsWith("-") ? "text-green-success" : "text-orange-warning"}`}>{sub}</p>
  </div>
);

export default Dashboard;
