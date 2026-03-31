import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import AuthChoice from "./pages/AuthChoice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import PaymentPlans from "./pages/PaymentPlans";
import ManagePlan from "./pages/ManagePlan";
import Notifications from "./pages/Notifications";
import Transactions from "./pages/Transactions";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProviderLogin from "./pages/provider/ProviderLogin";
import ProviderRegister from "./pages/provider/ProviderRegister";
import ProviderLayout from "./components/provider/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderPatients from "./pages/provider/ProviderPatients";
import ProviderCarePlans from "./pages/provider/ProviderCarePlans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth-choice" element={<AuthChoice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Patient Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bills" element={<Bills />} />
              <Route path="payment-plans" element={<PaymentPlans />} />
              <Route path="manage-plan" element={<ManagePlan />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            {/* Provider Auth */}
            <Route path="/provider/login" element={<ProviderLogin />} />
            <Route path="/provider/register" element={<ProviderRegister />} />

            {/* Provider Dashboard */}
            <Route path="/provider/dashboard" element={<ProviderLayout />}>
              <Route index element={<ProviderDashboard />} />
              <Route path="patients" element={<ProviderPatients />} />
              <Route path="care-plans" element={<ProviderCarePlans />} />
              <Route path="payments" element={<Transactions />} />
              <Route path="manage-plans" element={<ManagePlan />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
