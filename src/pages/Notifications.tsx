
import { Bell, CheckCircle2, AlertCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
};

const Notifications = () => {
  const { user: authUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    fetch(`/api/notifications?userId=${authUser._id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [authUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Stay updated on your payment activity and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full w-fit">
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Bell className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No notifications yet.</p>
            <p className="text-xs text-muted-foreground">You'll receive updates about your payments and plan changes.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const Icon = iconMap[n.icon] || Bell;
            return (
              <div key={i} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-colors hover:shadow-card ${!n.read ? "bg-secondary/50 border-primary/20" : "bg-card border-border"}`}>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-xs sm:text-sm">{n.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{n.desc || n.message}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{n.time || n.createdAt}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
              </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="rounded-full text-sm">
            Mark All as Read
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;

