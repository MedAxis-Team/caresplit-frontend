
import { Bell, CheckCircle2, AlertCircle, CreditCard, Info, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Info,
};

const iconColorMap: Record<string, { bg: string; text: string }> = {
  Bell: { bg: "bg-orange-100", text: "text-orange-500" },
  AlertCircle: { bg: "bg-orange-100", text: "text-orange-500" },
  CheckCircle2: { bg: "bg-green-100", text: "text-green-500" },
  CreditCard: { bg: "bg-green-100", text: "text-green-500" },
  Info: { bg: "bg-purple-100", text: "text-primary" },
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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Persist to API so dashboard header bell syncs
    if (authUser?._id) {
      fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser._id }),
      }).catch(() => {});
    }
  };

  const handleClear = () => {
    setNotifications([]);
    if (authUser?._id) {
      fetch(`/api/notifications?userId=${authUser._id}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Stay updated on your payments and account activity.</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-sm font-medium text-foreground hover:underline whitespace-nowrap">
                Mark all as read
              </button>
            )}
            <button onClick={handleClear} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 whitespace-nowrap">
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="flex justify-center">
              <svg className="h-16 w-16 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-lg">No new notifications</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You're all caught up! We'll notify you when there's an update on your payments or account.
            </p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const Icon = iconMap[n.icon] || Bell;
            const colors = iconColorMap[n.icon] || { bg: "bg-muted", text: "text-muted-foreground" };
            return (
              <div
                key={i}
                className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-colors ${
                  !n.read ? "bg-white border-primary/20 shadow-sm" : "bg-card border-border"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.desc || n.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time || n.createdAt}</span>
                  {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;

