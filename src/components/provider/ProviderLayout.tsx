import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, CreditCard, LineChart, Bell, Settings, LogOut, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/provider/dashboard" },
  { icon: Users, label: "Patients", path: "/provider/dashboard/patients" },
  { icon: FileText, label: "Care Plans", path: "/provider/dashboard/care-plans" },
  { icon: CreditCard, label: "Payments", path: "/provider/dashboard/payments" },
  { icon: LineChart, label: "Manage Plans", path: "/provider/dashboard/manage-plans", badge: 3 },
  { icon: Bell, label: "Notifications", path: "/provider/dashboard/notifications", badge: 5 },
  { icon: Settings, label: "Settings", path: "/provider/dashboard/settings" },
];

const ProviderLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-0 -ml-64" : "w-64"} transition-all duration-300 bg-card border-r border-border flex flex-col min-h-screen fixed lg:relative z-40`}>
        <div className="p-4 border-b border-border">
          <Link to="/provider/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs">📋</div>
            <span className="font-bold text-foreground">CareSplit <span className="text-primary">Pro</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-5 w-5" /> Provider Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="lg:hidden text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold text-foreground">
              {navItems.find((n) => location.pathname === n.path)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient, ID, or bill..." className="pl-10 w-64" />
            </div>
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-card" />
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">DS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:block">Dr. Sarah</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
