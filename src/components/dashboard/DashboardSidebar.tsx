import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, DollarSign, CreditCard, LineChart, Bell, Receipt, Settings, HelpCircle, LogOut, ArrowLeft } from "lucide-react";
import CareSplitLogo from "@/components/CareSplitLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: DollarSign, label: "Bills", path: "/dashboard/bills" },
  { icon: CreditCard, label: "Payment Plans", path: "/dashboard/payment-plans" },
  { icon: LineChart, label: "Manage Plan", path: "/dashboard/manage-plan" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Receipt, label: "Transaction", path: "/dashboard/transactions" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar = ({ collapsed, onToggle }: Props) => {
  const location = useLocation();

  return (
    <aside className={`${collapsed ? "w-0 -ml-64" : "w-64"} transition-all duration-300 bg-navy flex flex-col min-h-screen fixed lg:relative z-40`}>
      <div className="p-4">
        <CareSplitLogo variant="white" size="sm" />
      </div>

      <button onClick={onToggle} className="flex items-center gap-2 px-4 py-2 text-sm text-sidebar-foreground hover:text-primary-foreground">
        <ArrowLeft className="h-4 w-4" /> Close
      </button>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary text-primary"
                  : "text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground">
          <HelpCircle className="h-5 w-5" /> Help / Support
        </a>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-navy-light hover:text-primary-foreground">
          <LogOut className="h-5 w-5" /> Log out
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
