import { TrendingUp, TrendingDown, DollarSign, LineChart, Users, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Revenue Collected", value: "$842,500.00", change: "+12.5%", up: true, icon: DollarSign, color: "bg-primary/10 text-primary" },
  { label: "Active Payment Plans", value: "1,248", change: "+5.2%", up: true, icon: LineChart, color: "bg-green-100 text-green-600" },
  { label: "Outstanding Payments", value: "$145,200.00", change: "-2.4%", up: false, icon: TrendingDown, color: "bg-orange-100 text-orange-600" },
  { label: "Total Patients Enrolled", value: "3,492", change: "+18%", up: true, icon: Users, color: "bg-blue-100 text-blue-600" },
];

const actionItems = [
  { name: "Michael Chang", time: "2 hrs ago", desc: "2nd installment overdue", amount: "$450.00", dot: "bg-destructive" },
  { name: "Sarah Jenkins", time: "5 hrs ago", desc: "Hardship pause request submitted", amount: "Plan: $1,200", dot: "bg-orange-warning" },
  { name: "David Miller", time: "1 day ago", desc: "Card expired before next payment", amount: "Due in 3 days", dot: "bg-destructive" },
  { name: "Emily Clark", time: "2 days ago", desc: "Requested early payoff settlement", amount: "$2,100.00", dot: "bg-primary" },
];

const transactions = [
  { patient: "Robert Fox", plan: "Orthopedic Surgery", amount: "$350.00", date: "Today, 10:24 AM", status: "Success" },
  { patient: "Wade Warren", plan: "Emergency Visit", amount: "$120.00", date: "Today, 09:15 AM", status: "Success" },
  { patient: "Jane Cooper", plan: "Maternity Care", amount: "$500.00", date: "Yesterday", status: "Processing" },
  { patient: "Esther Howard", plan: "Physical Therapy", amount: "$85.00", date: "Yesterday", status: "Failed" },
];

const ProviderDashboard = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-1 ${s.up ? "text-green-600" : "text-destructive"}`}>
                <TrendingUp className="h-3 w-3" /> {s.change}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart placeholder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly collected vs projected revenue</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => (
              <div key={m} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full bg-primary/20 rounded-t-md"
                  style={{ height: `${[30, 40, 50, 55, 65, 75, 90][i]}%` }}
                >
                  <div
                    className="w-full bg-primary rounded-t-md"
                    style={{ height: `${[80, 75, 85, 90, 88, 92, 95][i]}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Action Required
            </CardTitle>
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
              3 Alerts
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionItems.map((item, i) => (
            <div key={i} className="border border-border rounded-xl p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="font-semibold text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground ml-4">{item.desc}</p>
              <span className="text-xs font-medium text-foreground ml-4 mt-1 inline-block border border-border rounded px-2 py-0.5">
                {item.amount}
              </span>
            </div>
          ))}
          <Link to="/provider/dashboard/notifications" className="text-sm text-primary font-semibold hover:underline block text-center">
            View All Action Items →
          </Link>
        </CardContent>
      </Card>
    </div>

    {/* Recent Transactions */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Latest payments received across all plans</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/provider/dashboard/payments">View All History</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Care Plan</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium text-foreground">{tx.patient}</td>
                  <td className="py-3 text-muted-foreground">{tx.plan}</td>
                  <td className="py-3 font-semibold text-foreground">{tx.amount}</td>
                  <td className="py-3 text-muted-foreground">{tx.date}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      tx.status === "Success" ? "text-green-600" :
                      tx.status === "Processing" ? "text-orange-500" : "text-destructive"
                    }`}>
                      {tx.status === "Success" ? <CheckCircle2 className="h-3 w-3" /> :
                       tx.status === "Processing" ? <Clock className="h-3 w-3" /> :
                       <XCircle className="h-3 w-3" />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ProviderDashboard;
