import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft, User, Mail, Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authImage from "@/assets/auth-nurse.jpg";

const socialProviders = [
  { name: "Facebook", color: "bg-[hsl(220,46%,48%)]", letter: "f", textColor: "text-white" },
  { name: "Google", color: "bg-white", letter: "G", textColor: "text-foreground", border: true },
  { name: "LinkedIn", color: "bg-[hsl(210,80%,42%)]", letter: "in", textColor: "text-white" },
  { name: "Apple", color: "bg-foreground", letter: "🍎", textColor: "text-primary-foreground" },
];

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

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
      const user = await res.json();
      login({ ...user, role: user.role as "patient" | "provider" });
      navigate("/verify-otp", { state: { email: form.email, redirectTo: "/dashboard" } });
    } catch {
      toast({ title: "Registration failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left: Image */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-card">
        <img
          src={authImage}
          alt="Healthcare professional"
          className="w-full h-full object-cover max-h-screen"
          style={{ minHeight: '100vh' }}
          loading="lazy"
        />
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-background min-h-screen">
        <div className="w-full max-w-md">
          <Link to="/" className="text-muted-foreground hover:text-foreground mb-8 w-fit inline-block">
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
                <Input type="password" placeholder="Create a strong password" className="pl-10" value={form.password} onChange={update("password")} />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="Re-enter your password" className="pl-10" value={form.confirm} onChange={update("confirm")} />
              </div>
            </div>

            <Button className="w-full rounded-full mt-2" size="lg" type="submit" disabled={loading || authLoading}>
              {loading || authLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-muted-foreground font-semibold">OR</div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-4 text-xs text-muted-foreground">Sign Up with</span>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              {socialProviders.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={`w-14 h-14 rounded-xl ${p.color} ${p.textColor} ${p.border ? "border border-border" : ""} flex items-center justify-center hover:opacity-90 transition-opacity text-lg font-bold shadow-sm`}
                  aria-label={`Sign up with ${p.name}`}
                  onClick={() => { toast({ title: `${p.name} sign up coming soon` }); }}
                >
                  {p.letter}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
