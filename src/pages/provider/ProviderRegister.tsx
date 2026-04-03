import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, User, Phone, Mail, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authStore } from "@/lib/authStore";
import providerBg from "@/assets/provider-auth-bg.jpg";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    hospital: "", contact: "", phone: "", email: "", address: "", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hospital || !form.email || !form.password || !form.confirm) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = authStore.register({
      name: form.contact || form.hospital,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: "provider",
      hospital: form.hospital,
      address: form.address,
    });
    if (!result.ok) {
      toast({ title: result.error, variant: "destructive" });
      setLoading(false);
      return;
    }
    login({ ...result.user, hospital: form.hospital, address: form.address, role: "provider" });
    setLoading(false);
    navigate("/verify-otp", { state: { email: form.email, redirectTo: "/provider/dashboard" } });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 rounded-r-3xl overflow-hidden">
          <img src={providerBg} alt="Hospital corridor" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/20" />
          <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs">📋</div>
              <span className="font-semibold">CareSplit <span className="text-primary">Provider</span></span>
            </div>
            <h2 className="text-3xl font-bold mb-3">Empower your patients with flexible care financing.</h2>
            <p className="text-sm text-primary-foreground/80">
              Join the network of healthcare providers increasing treatment acceptance and improving revenue cycle management.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-8 lg:p-16 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/provider/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" /> Back
          </Link>
          <a href="#" className="text-sm text-primary hover:underline">Need help? Contact Support</a>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">Register your Hospital</h1>
          <p className="text-muted-foreground mb-8">Join CareSplit to offer flexible payment plans to your patients.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-semibold">Hospital / Clinic Name</Label>
              <div className="relative mt-1.5">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Memorial General Hospital" className="pl-10" value={form.hospital} onChange={update("hospital")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Contact Person Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Dr. Sarah Mitchell" className="pl-10" value={form.contact} onChange={update("contact")} />
                </div>
              </div>
              <div>
                <Label className="font-semibold">Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="(555) 000-0000" className="pl-10" value={form.phone} onChange={update("phone")} />
                </div>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Work Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="admin@hospital.com" className="pl-10" value={form.email} onChange={update("email")} />
              </div>
            </div>

            <div>
              <Label className="font-semibold">Hospital Address</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="123 Health Ave, Medical District" className="pl-10" value={form.address} onChange={update("address")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Create password"
                    className="pl-10 pr-10"
                    value={form.password}
                    onChange={update("password")}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Confirm Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-10 pr-10"
                    value={form.confirm}
                    onChange={update("confirm")}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button className="w-full rounded-full mt-2" size="lg" type="submit" disabled={loading || authLoading}>
              {loading || authLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/provider/login" className="text-primary font-semibold hover:underline">Log in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegister;
