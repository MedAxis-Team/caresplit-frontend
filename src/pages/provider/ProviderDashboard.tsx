
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, LineChart, Users, AlertTriangle, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
    ]).then(([s, a, t]) => {
      setStats(s);
      setActionItems(a);
      setTransactions(t);
    }).finally(() => setLoading(false));
  }, [authUser]);

  const statIcons = [DollarSign, LineChart, TrendingUp, Users];
  const statColors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-xl sm:text-2xl font-bold mb-3">
            Welcome to Caresplit Service Provider Dashboard !
          </h1>
          <Button
            variant="outline"
            className="border-white/40 text-white bg-white/10 hover:bg-white/20"
            onClick={() => navigate("/provider/dashboard/patients")}
          >
            Enroll New Patient
          </Button>
        </div>
        {/* Hospital illustration */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
          <div className="relative">
            <div className="w-28 h-20 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-4xl">🏥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground py-12">Loading stats...</div>
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">No stats found.</div>
        ) : (
          stats.map((s: any, i: number) => {
            const Icon = statIcons[i] || DollarSign;
            const color = statColors[i] || statColors[0];
            return (
              <Card key={s.label} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        s.up ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {s.change}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">{s.label}</p>
                  <p className="text-base sm:text-2xl font-bold text-foreground">{s.value}</p>
                  {s.subtitle && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Revenue Overview</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monthly collected vs projected revenue
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] sm:text-xs text-muted-foreground w-10">
              <span>$100k</span>
              <span>$75k</span>
              <span>$50k</span>
              <span>$25k</span>
              <span>$0k</span>
            </div>
            {/* Chart area */}
            <div className="ml-12 h-full pb-6">
              <svg viewBox="0 0 700 200" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {[0, 50, 100, 150].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="700"
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    strokeDasharray="4"
                  />
                ))}
                <path
                  d="M 0 180 Q 70 160 116 140 T 233 100 T 350 70 T 466 50 T 583 35 T 700 20 L 700 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0 180 Q 70 160 116 140 T 233 100 T 350 70 T 466 50 T 583 35 T 700 20"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                />
                <path
                  d="M 583 35 L 700 20"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6"
                  opacity="0.5"
                />
              </svg>
              <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Action Required
            </CardTitle>
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {actionItems.length} Alerts
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : actionItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No pending actions.</div>
          ) : (
            actionItems.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    <span className="inline-block mt-1.5 text-xs font-medium bg-background border border-border rounded-md px-2 py-0.5">
                      {item.amount}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">{item.time}</span>
              </div>
            ))
          )}
          <Link
            to="/provider/dashboard/notifications"
            className="text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-1 pt-2"
          >
            View All Action Items <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>

      {/* Recent Transactions + Care Plan Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Latest payments received across all plans
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-fit">
                <Link to="/provider/dashboard/payments">View All History</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm min-w-[500px]">
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
                    <tr>
                      <td colSpan={6} className="text-center text-muted-foreground py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted-foreground py-8">
                        No transactions.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 font-medium text-foreground text-sm">{tx.patient}</td>
                        <td className="py-3 text-muted-foreground text-sm">{tx.plan}</td>
                        <td className="py-3 font-semibold text-foreground text-sm">
                          ${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-muted-foreground text-sm">{tx.date}</td>
                        <td className="py-3">
                          <span
                            className={`flex items-center gap-1 text-xs font-medium ${
                              tx.status === "Success"
                                ? "text-green-600"
                                : tx.status === "Processing"
                                ? "text-orange-500"
                                : "text-destructive"
                            }`}
                          >
                            {tx.status === "Success" ? (
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
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Care Plan Policies */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[240px]">
            <div>
              <h3 className="text-lg font-bold mb-3">Care Plan Policies</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Ensure that every approval follows your hospital's financial guidelines and
                approval policies. This helps maintain financial accountability, transparency, and
                proper management of patient payment plans.
              </p>
            </div>
            <Button variant="secondary" className="mt-6 w-full">
              View Hospital Guidelines
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
