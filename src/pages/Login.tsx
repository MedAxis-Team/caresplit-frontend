import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authImage from "@/assets/auth-nurse.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please enter email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col p-8 lg:p-16">
        <Link to="/" className="text-muted-foreground hover:text-foreground mb-8 w-fit">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <CareSplitLogo size="sm" />
        <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Login to manage your medical bills</p>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
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

          <Button className="w-full rounded-full mt-4" size="lg" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block relative">
        <div className="absolute inset-4 rounded-2xl overflow-hidden border-4 border-navy shadow-card-hover">
          <img src={authImage} alt="Healthcare professional" className="h-full w-full object-cover" loading="lazy" width={640} height={800} />
        </div>
      </div>
    </div>
  );
};

export default Login;
