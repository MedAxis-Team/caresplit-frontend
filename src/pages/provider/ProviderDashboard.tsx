
import { TrendingUp, TrendingDown, DollarSign, LineChart, Users, AlertTriangle, CheckCircle2, XCircle, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const iconMap: Record<string, any> = {
  DollarSign,
  LineChart,
  Users,
  TrendingUp,
};

const colorMap: Record<string, string> = {
  "bg-blue-100 text-blue-600": "bg-blue-100",
  "bg-green-100 text-green-600": "bg-green-100",
  "bg-purple-100 text-purple-600": "bg-purple-100",
};

const ProviderDashboard = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/providers/${authUser._id}/stats`).then((r) => r.json()).catch(() => []),
      fetch(`/api/providers/${authUser._id}/actionItems`).then((r) => r.json()).catch(() => []),
      fetch(`/api/providers/${authUser._id}/transactions`).then((r) => r.json()).catch(() => []),
    ]).then(([statsData, actionData, txData]) => {
      setStats(statsData);
      setActionItems(actionData);
      setTransactions(txData);
    }).finally(() => setLoading(false));
  }, [authUser]);

  const providerName = authUser?.name || "Doctor";

  return (
    <div className="space-y-6">
      {/* Welcome banner with hospital illustration */}
      <div className="gradient-hero rounded-2xl p-5 sm:p-8 text-primary-foreground relative overflow-hidden min-h-[140px] sm:min-h-[160px] flex items-center">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome to Caresplit Service Provider Dashboard !</h1>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full text-xs sm:text-sm mt-2"
            onClick={() => navigate("/provider/dashboard/patients")}
          >
            Enroll New Patient
          </Button>
        </div>
        {/* Hospital illustration — decorative */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
            🏥
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground py-12">Loading stats...</div>
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">No data yet. Enroll patients and add bills to see stats.</div>
        ) : (
          stats.map((s: any) => {
            const Icon = iconMap[s.icon] || DollarSign;
            return (
              <div key={s.label} className="bg-card rounded-2xl shadow-card p-4 sm:p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${s.up ? "text-green-600 bg-green-50" : "text-destructive bg-red-50"}`}>
                    {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {s.change}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{s.value}</p>
                {s.subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{s.subtitle}</p>}
              </div>
            );
          })
        )}
      </div>

      {/* Revenue Overview (line chart placeholder) */}
      <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Revenue Overview</h3>
            <p className="text-xs text-muted-foreground">Monthly collected vs projected revenue</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Collected</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary/30 inline-block rounded border border-dashed border-primary/50" /> Projected</span>
          </div>
        </div>

        {/* SVG Line chart */}
        <div className="relative w-full overflow-hidden">
          <svg viewBox="0 0 700 200" className="w-full h-48 sm:h-64" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((y) => (
              <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="currentColor" className="text-border" strokeWidth="0.5" />
            ))}
            {/* Area fill */}
            <path
              d="M0,180 C50,170 100,150 150,140 C200,130 250,110 300,90 C350,75 400,60 450,50 C500,40 550,35 600,30 C650,28 700,25 700,25 L700,200 L0,200 Z"
              fill="url(#areaGradient)"
            />
            {/* Line */}
            <path
              d="M0,180 C50,170 100,150 150,140 C200,130 250,110 300,90 C350,75 400,60 450,50 C500,40 550,35 600,30 C650,28 700,25 700,25"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
            />
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
              </linearGradient>
            </defs>
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between px-1 sm:px-4 text-[10px] sm:text-xs text-muted-foreground mt-1">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-48 sm:h-64 flex flex-col justify-between py-2 text-[9px] sm:text-[10px] text-muted-foreground">
            <span>₦100k</span><span>₦75k</span><span>₦50k</span><span>₦25k</span><span>₦0k</span>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-base sm:text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Action Required
          </h3>
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {actionItems.length} Alert{actionItems.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading action items...</div>
          ) : actionItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No action items. Everything looks good!</div>
          ) : (
            actionItems.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.dot}`} />
                    <span className="font-semibold text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-5">{item.desc}</p>
                <span className="text-xs font-medium text-foreground ml-5 mt-1.5 inline-block bg-muted border border-border rounded-md px-2.5 py-1">
                  {item.amount}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/provider/dashboard/notifications" className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
            View All Action Items <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Transactions + Care Plan Policies side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-base sm:text-lg">Recent Transactions</h3>
              <p className="text-xs text-muted-foreground">Latest payments received across all plans</p>
            </div>
            <Button variant="outline" size="sm" className="w-fit rounded-full" asChild>
              <Link to="/provider/dashboard/payments">View All History</Link>
            </Button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
            <table className="w-full text-sm min-w-[550px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Patient</th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Care Plan</th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Amount</th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Date</th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">Loading...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No transactions yet. Payments will appear here once patients make payments.</td></tr>
                ) : (
                  transactions.slice(0, 6).map((tx: any, i: number) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 font-medium text-foreground">{tx.patient || tx.desc}</td>
                      <td className="py-3 text-muted-foreground">{tx.plan || tx.type || "-"}</td>
                      <td className="py-3 font-semibold text-foreground">{formatNaira(Number(tx.amount))}</td>
                      <td className="py-3 text-muted-foreground text-xs">{tx.date || tx.createdAt || "-"}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          tx.status === "Success" || tx.status === "completed"
                            ? "text-green-700 bg-green-50"
                            : tx.status === "Processing"
                            ? "text-orange-700 bg-orange-50"
                            : "text-destructive bg-red-50"
                        }`}>
                          {tx.status === "Success" || tx.status === "completed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : tx.status === "Processing" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-muted-foreground hover:text-foreground">
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Care Plan Policies card */}
        <div className="gradient-hero rounded-2xl p-5 sm:p-6 text-primary-foreground flex flex-col justify-between min-h-[200px]">
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">Care Plan Policies</h3>
            <p className="text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
              Ensure that every approval follows your hospital's financial guidelines and approval policies. This helps maintain financial accountability, transparency, and proper management of patient payment plans.
            </p>
          </div>
          <Button variant="secondary" size="sm" className="rounded-full mt-4 w-fit">
            View Hospital Guidelines
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
