import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CheckCircle2, Calendar, TrendingDown, CreditCard, BarChart3, Receipt, Phone, ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardCard from "@/assets/dashboard-card.png";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
  <div className="space-y-6">
    {/* Hero Banner */}
    <div className="relative gradient-hero rounded-2xl p-8 text-primary-foreground overflow-hidden min-h-[180px] flex items-center">
      <div className="relative z-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Hello, Jane</h1>
        <p className="text-primary-foreground/80 max-w-md text-sm mb-4">
          Your health finances are looking healthy. You've saved $120 this month by using our split payment plans. Keep going
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={() => navigate("/dashboard/bills")}>View All Bills</Button>
          <Button size="sm" className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate("/dashboard/payment-plans")}>Make Payment</Button>
        </div>
      </div>
      <img src={dashboardCard} alt="" className="absolute right-8 top-1/2 -translate-y-1/2 h-32 opacity-80 hidden lg:block" />
    </div>

    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 xl:col-span-3 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={DollarSign} label="TOTAL BILL" value="$2,450" sub="-8%" />
          <StatCard icon={CheckCircle2} label="ACTIVE PLAN" value="Standard" sub="Auto-renew active" highlighted />
          <StatCard icon={Calendar} label="NEXT DUE" value="Oct 15" sub="9 days left" />
        </div>

        {/* Payment Milestone */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Payment Milestone Progress</h3>
            <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">65% Completed</span>
          </div>
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-3xl font-extrabold text-foreground">$1,592</p>
              <p className="text-xs text-muted-foreground">Paid to date</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-muted-foreground">$858</p>
              <p className="text-xs text-muted-foreground">Remaining balance</p>
            </div>
          </div>
          <Progress value={65} className="h-2 mb-4" />
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-primary" /> Medical Fees <span className="text-muted-foreground">$1,240 · 78%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-purple-glow" /> Platform Interest <span className="text-muted-foreground">$352 · 22%</span>
            </div>
          </div>
        </div>

        {/* Transaction Breakdown */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Transaction Breakdown</h3>
            <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">View Detailed Statement <ArrowUpRight className="h-3 w-3" /></a>
          </div>
          <div className="space-y-4">
            {[
              { icon: Receipt, title: "General Consultation", sub: "St. Mary's General Hospital · Sep 28, 2023", amount: "$150.00" },
              { icon: BarChart3, title: "Lab Diagnostics", sub: "Pathology Core Labs · Sep 15, 2023", amount: "$420.00" },
              { icon: Sparkles, title: "Prescription Medication", sub: "CVS Pharmacy · Sep 10, 2023", amount: "$85.20" },
            ].map((tx) => (
              <div key={tx.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <tx.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{tx.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{tx.amount}</p>
                  <p className="text-xs text-green-success font-medium">Verified</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Payment Plans */}
        <div className="bg-card rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Payment Plans</h3>
            <a href="#" className="text-xs text-primary hover:underline">Compare</a>
          </div>
          <div className="border-2 border-primary rounded-xl p-4 mb-3 relative">
            <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Standard Plan</p>
                <p className="text-xs text-muted-foreground">0% APR · 4 MONTHS</p>
              </div>
            </div>
            <p className="text-xl font-bold text-primary mt-2">$612.50 <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Extended Care</p>
                <p className="text-xs text-muted-foreground">2.5% APR · 12 MONTHS</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold text-foreground">$215.30 <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <Button variant="outline" size="sm" className="rounded-full text-xs">Select</Button>
            </div>
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
            <a href="#" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="space-y-4">
            {[
              { desc: "Payment received", date: "Oct 01, 2023", amount: "$350.00", color: "text-green-success" },
              { desc: "Payment plan updated", date: "Extended to 12 months", amount: "", color: "text-primary" },
              { desc: "Payment received", date: "Sep 01, 2023", amount: "$350.00", color: "text-green-success" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${a.color}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.desc}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                {a.amount && <p className="text-sm font-semibold text-foreground">{a.amount}</p>}
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
    <p className={`text-xs mt-1 ${highlighted ? "text-primary" : sub.startsWith("-") ? "text-green-success" : "text-orange-warning"}`}>{sub}</p>
  </div>
);

export default Dashboard;
