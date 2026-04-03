import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import authImage from "@/assets/auth-nurse.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, role: 'patient' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Registration failed");
      }
      const user = await res.json();
      login({ ...user, role: user.role as "patient" | "provider" });
      navigate("/verify-otp", { state: { email: form.email, redirectTo: "/dashboard" } });
    } catch {
      toast({ title: "Registration failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left: Image — fills the entire left half, no border */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={authImage}
          alt="Healthcare professional"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* Right: Form — scrollable */}
      <div className="w-full md:w-1/2 flex items-start md:items-center justify-center p-6 md:p-12 lg:p-16 bg-background min-h-screen overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <Link to="/auth-choice" className="text-muted-foreground hover:text-foreground mb-8 w-fit inline-block">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <CareSplitLogo size="sm" />
          <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Create an account</h1>
          <p className="text-muted-foreground mb-8">Join CareSplit to manage your medical bills</p>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <Label className="font-semibold">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter your full name" className="pl-10" value={form.name} onChange={update("name")} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="your.email@example.com" className="pl-10" value={form.email} onChange={update("email")} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Phone Number</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="+234 800 000 0000" className="pl-10" value={form.phone} onChange={update("phone")} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="pl-10 pr-10" value={form.password} onChange={update("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password" className="pl-10 pr-10" value={form.confirm} onChange={update("confirm")} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full rounded-full mt-2" size="lg" type="submit" disabled={loading || authLoading}>
              {loading || authLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;