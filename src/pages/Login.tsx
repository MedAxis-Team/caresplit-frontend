import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authStore } from "@/lib/authStore";
import authImage from "@/assets/auth-nurse.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        toast({ title: "Please enter your email", variant: "destructive" });
        return;
      }
      setLoading(true);
      const result = authStore.login(email, password);
      if (!result.ok) {
        toast({ title: "Login failed", description: result.error, variant: "destructive" });
        setLoading(false);
        return;
      }
      login({ ...result.user, role: result.user.role as "provider" | "patient" });
      setLoading(false);
      navigate(result.user.role === "provider" ? "/provider/dashboard" : "/dashboard");
    };

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
            <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-8">Login to manage your medical bills</p>

            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div>
                <Label className="font-semibold">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="your.email@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <Label className="font-semibold">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Enter your password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="text-right mt-1">
                  <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>
              </div>

              <Button className="w-full rounded-full mt-4" size="lg" type="submit" disabled={loading || authLoading}>
                {loading || authLoading ? "Logging in..." : "Log In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default Login;
