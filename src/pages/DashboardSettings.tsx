import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, Shield, CreditCard, Bell as BellIcon, HelpCircle } from "lucide-react";

type SettingsTab = "account" | "security" | "payment-methods" | "notifications" | "help";

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "account", label: "Account Information", icon: User },
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

const DashboardSettings = () => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  const firstName = authUser?.name?.split(" ")[0] || "Jane";
  const lastName = authUser?.name?.split(" ").slice(1).join(" ") || "Doe";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-purple-100 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="font-semibold text-foreground mb-5">Profile Details</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-primary text-xl font-bold">
                    {initials}
                  </div>
                  <Button variant="outline" className="rounded-lg">Change Photo</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">First Name</Label>
                    <Input defaultValue={firstName} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Name</Label>
                    <Input defaultValue={lastName} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email Address</Label>
                    <Input defaultValue={authUser?.email || "jane.doe@example.com"} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone Number</Label>
                    <Input defaultValue={authUser?.phone || "(555) 123-4567"} className="mt-1.5" />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <Button variant="destructive" className="rounded-lg">Delete Account</Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-600">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and data.</p>
                </div>
                <Button variant="outline" className="rounded-lg border-red-300 text-red-600 hover:bg-red-100">Delete Account</Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="font-semibold text-foreground mb-5">Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label className="text-xs text-muted-foreground">Current Password</Label>
                  <Input type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">New Password</Label>
                  <Input type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Confirm New Password</Label>
                  <Input type="password" className="mt-1.5" />
                </div>
                <Button className="rounded-lg bg-primary text-primary-foreground mt-2">Update Password</Button>
              </div>
            </div>
          )}

          {activeTab === "payment-methods" && (
            <div className="bg-card rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground">Saved Payment Methods</h2>
                <Button variant="outline" className="rounded-lg">Add New</Button>
              </div>
              <div className="space-y-3">
                {/* Visa card */}
                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-purple-50/50">
                  <div className="w-12 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-purple-100 px-3 py-1 rounded-full">Default</span>
                </div>
                {/* Bank account */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
                  <div className="w-12 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">BANK</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Chase Checking</p>
                    <p className="text-xs text-muted-foreground">Ending in 9901</p>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Set Default</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="font-semibold text-foreground mb-5">Notification Preferences</h2>
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
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "help" && (
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="font-semibold text-foreground mb-4">Help & Support</h2>
              <p className="text-sm text-muted-foreground mb-4">Need assistance? Our support team is here to help.</p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-lg">FAQ & Knowledge Base</Button>
                <Button variant="outline" className="w-full justify-start rounded-lg">Contact Support</Button>
                <Button variant="outline" className="w-full justify-start rounded-lg">Report a Problem</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
