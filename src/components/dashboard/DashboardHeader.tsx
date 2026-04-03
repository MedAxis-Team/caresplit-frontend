
import { Bell, HelpCircle, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import avatarImg from "@/assets/avatar-jane.jpg";

interface Props {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const DashboardHeader = ({ onToggleSidebar, sidebarCollapsed }: Props) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const initials = authUser?.name
    ? authUser.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const fetchUnreadCount = useCallback(() => {
    if (!authUser?._id) return;
    fetch(`/api/notifications?userId=${authUser._id}`)
      .then((res) => res.json())
      .then((data: any[]) => setUnreadCount(data.filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [authUser]);

  // Re-fetch notification count on route change (e.g. after marking as read on Notifications page)
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount, location.pathname]);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-background sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button onClick={onToggleSidebar} className="p-1 rounded-lg hover:bg-muted">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10 w-48 md:w-64 rounded-full bg-muted border-0" />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative text-muted-foreground hover:text-foreground p-1" onClick={() => navigate("/dashboard/notifications")}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </button>
        <button className="text-muted-foreground hover:text-foreground p-1 hidden sm:block">
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-tight">{authUser?.name || "User"}</p>
            <p className="text-[11px] text-muted-foreground">Premium Member</p>
          </div>
          <Avatar className="w-9 h-9">
            <AvatarImage src={avatarImg} alt={authUser?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
