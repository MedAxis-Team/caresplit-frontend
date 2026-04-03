import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, DollarSign, CreditCard, LineChart, Bell, Receipt, Settings, HelpCircle, LogOut, ChevronLeft } from "lucide-react";
import CareSplitLogo from "@/components/CareSplitLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: DollarSign, label: "Bills", path: "/dashboard/bills" },
  { icon: CreditCard, label: "Payment Plans", path: "/dashboard/payment-plans" },
  { icon: LineChart, label: "Manage Plan", path: "/dashboard/manage-plan" },
  { icon: Receipt, label: "Transaction", path: "/dashboard/transactions" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar = ({ collapsed, onToggle }: Props) => {
  const location = useLocation();

  return (
    <aside
      className={`
        ${collapsed ? "-translate-x-full" : "translate-x-0"}
        w-64 transition-all duration-300 bg-navy flex flex-col
        fixed z-40 top-0 left-0 h-screen overflow-y-auto
      `}
    >
      <div className="p-4">
        <Link to="/"><CareSplitLogo variant="white" size="sm" /></Link>
      </div>

      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-6 py-2.5 text-sidebar-foreground hover:text-primary-foreground text-sm transition-colors border-b border-white/5 mb-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Close</span>
      </button>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary text-primary"
                  : "text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground">
          <HelpCircle className="h-5 w-5 flex-shrink-0" /> Help / Support
        </a>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground">
          <LogOut className="h-5 w-5 flex-shrink-0" /> Log out
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
