import { Bell, CheckCircle2, AlertCircle, CreditCard } from "lucide-react";

const notifications = [
  { icon: Bell, title: "Payment reminder", desc: "Your next payment of $612.50 is due in 3 days.", time: "2 hours ago", read: false },
  { icon: CheckCircle2, title: "Payment successful", desc: "Your payment of $350.00 has been processed.", time: "Oct 01, 2023", read: true },
  { icon: AlertCircle, title: "Payment failed", desc: "We couldn't process your payment. Please update your card.", time: "Sep 28, 2023", read: false },
  { icon: CreditCard, title: "Plan activated", desc: "Your Standard Plan has been activated.", time: "Sep 15, 2023", read: true },
];

const Notifications = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-bold text-foreground mb-6">Notifications</h1>
    <div className="space-y-3">
      {notifications.map((n, i) => (
        <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${!n.read ? "bg-secondary/50 border-primary/20" : "bg-card border-border"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
            <n.icon className={`h-5 w-5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.desc}</p>
            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
          </div>
          {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2" />}
        </div>
      ))}
    </div>
  </div>
);

export default Notifications;
