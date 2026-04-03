import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(typeof window !== "undefined" && window.innerWidth < 1024);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(true)} />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "" : "lg:ml-64"}`}>
        <DashboardHeader onToggleSidebar={() => setCollapsed(false)} sidebarCollapsed={collapsed} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
