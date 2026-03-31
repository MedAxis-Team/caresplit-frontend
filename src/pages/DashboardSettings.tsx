import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { User, Bell as BellIcon, Shield } from "lucide-react";

const DashboardSettings = () => {
  const { user: authUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">Account Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue={authUser?.name || "Jane Jenkins"} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input defaultValue={authUser?.email || "jane@example.com"} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input defaultValue={authUser?.phone || "+234 800 000 0000"} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs">Role</Label>
              <Input defaultValue={authUser?.role === "provider" ? "Healthcare Provider" : "Patient"} className="mt-1.5" disabled />
            </div>
          </div>
          <Button className="mt-4 rounded-full">Save Changes</Button>
        </section>

        <section className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <BellIcon className="h-4 w-4 text-orange-500" />
            </div>
            <h2 className="font-semibold text-foreground">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Payment reminders", desc: "Get notified before due dates" },
              { label: "Successful payments", desc: "Confirmation when payments go through" },
              { label: "Failed payments", desc: "Alert if a payment fails" },
              { label: "Plan updates", desc: "Changes to your payment plan" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <h2 className="font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Current Password</Label>
              <Input type="password" className="mt-1.5 max-w-sm" />
            </div>
            <div>
              <Label className="text-xs">New Password</Label>
              <Input type="password" className="mt-1.5 max-w-sm" />
            </div>
            <div>
              <Label className="text-xs">Confirm New Password</Label>
              <Input type="password" className="mt-1.5 max-w-sm" />
            </div>
          </div>
          <Button className="mt-4 rounded-full">Update Password</Button>
        </section>
      </div>
    </div>
  );
};

export default DashboardSettings;
