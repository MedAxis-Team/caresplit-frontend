import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, CreditCard, LineChart, Bell, Settings, LogOut, Menu, ChevronLeft, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import CareSplitLogo from "@/components/CareSplitLogo";
import avatarImg from "@/assets/avatar-jane.jpg";

const baseNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/provider/dashboard" },
  { icon: Users, label: "Patients", path: "/provider/dashboard/patients" },
  { icon: FileText, label: "Care Plans", path: "/provider/dashboard/care-plans" },
  { icon: CreditCard, label: "Payment", path: "/provider/dashboard/payments" },
  { icon: LineChart, label: "Manage Plans", path: "/provider/dashboard/manage-plans" },
  { icon: Bell, label: "Notifications", path: "/provider/dashboard/notifications" },
  { icon: Settings, label: "Settings", path: "/provider/dashboard/settings" },
];

const ProviderLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const providerName = authUser?.name || "Provider";
  const initials = providerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const [unreadCount, setUnreadCount] = useState(0);
  const [managePlansCount] = useState(3);

  useEffect(() => {
    if (!authUser?._id) return;
    fetch(`/api/notifications?userId=${authUser._id}`)
      .then((res) => res.json())
      .then((data: any[]) => setUnreadCount(data.filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [authUser]);

  const navItems = baseNavItems.map((item) => ({
    ...item,
    badge:
      item.label === "Notifications" && unreadCount > 0
        ? unreadCount
        : item.label === "Manage Plans" && managePlansCount > 0
        ? managePlansCount
        : undefined,
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile backdrop */}
      {!collapsed && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setCollapsed(true)} />
      )}

      {/* Dark Navy Sidebar */}
      <aside
        className={`
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
          w-64 transition-all duration-300 bg-navy flex flex-col
          fixed z-40 top-0 left-0 h-screen overflow-y-auto
        `}
      >
        <div className="p-4">
          <CareSplitLogo variant="white" size="sm" />
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-sidebar-foreground hover:text-primary-foreground text-sm transition-colors border-b border-white/5 mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Close</span>
        </button>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) setCollapsed(true); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-primary"
                    : "text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6 border-t border-white/5 pt-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" /> Provider Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "" : "lg:ml-64"}`}>
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {collapsed && (
              <button onClick={() => setCollapsed(false)} className="p-1 rounded-lg hover:bg-muted">
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 w-48 md:w-64 rounded-full bg-muted border-0" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="relative text-muted-foreground hover:text-foreground p-1"
              onClick={() => navigate("/provider/dashboard/notifications")}
            >
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
                <p className="text-sm font-semibold text-foreground leading-tight">{providerName}</p>
                <p className="text-[11px] text-muted-foreground">Hospital Provider</p>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatarImg} alt={providerName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
