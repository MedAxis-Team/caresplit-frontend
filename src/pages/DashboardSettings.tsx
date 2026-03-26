import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const DashboardSettings = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

    <div className="space-y-8">
      <section className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Account Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Full Name</Label><Input defaultValue="Jane Jenkins" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue="jane@example.com" className="mt-1.5" /></div>
          <div><Label>Phone</Label><Input defaultValue="+1 555-0123" className="mt-1.5" /></div>
        </div>
        <Button className="mt-4 rounded-full">Save Changes</Button>
      </section>

      <section className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {["Payment reminders", "Successful payments", "Failed payments", "Plan updates"].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{label}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Security</h2>
        <div className="space-y-3">
          <div><Label>Current Password</Label><Input type="password" className="mt-1.5 max-w-sm" /></div>
          <div><Label>New Password</Label><Input type="password" className="mt-1.5 max-w-sm" /></div>
        </div>
        <Button className="mt-4 rounded-full">Update Password</Button>
      </section>
    </div>
  </div>
);

export default DashboardSettings;
