import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authStore } from "@/lib/authStore";
import providerBg from "@/assets/provider-auth-bg.jpg";

const ProviderLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please enter email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = authStore.login(email, password);
    if (!result.ok) {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
      setLoading(false);
      return;
    }
    login({ ...result.user, role: "provider" });
    toast({ title: "Welcome back!" });
    setLoading(false);
    navigate("/provider/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left image panel */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 rounded-r-3xl overflow-hidden">
          <img src={providerBg} alt="Hospital corridor" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/20" />
          <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs">📋</div>
              <span className="font-semibold">CareSplit <span className="text-primary">Provider</span></span>
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Empower your patients with flexible care financing.
            </h2>
            <p className="text-sm text-primary-foreground/80">
              Join the network of healthcare providers increasing treatment acceptance and improving revenue cycle management.
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col p-8 lg:p-16">
        <div className="flex items-center justify-between mb-12">
          <Link to="/auth-choice" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" /> Back
          </Link>
          <a href="#" className="text-sm text-primary hover:underline">Need help? Contact Support</a>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Log in to manage your hospital's CareSplit account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="font-semibold">Work Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="admin@hospital.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <Label className="font-semibold">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full rounded-full mt-4" size="lg" type="submit" disabled={loading || authLoading}>
              {loading || authLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have a provider account?{" "}
              <Link to="/provider/register" className="text-primary font-semibold hover:underline">
                Register your hospital
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;
