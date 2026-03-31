import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import authImage from "@/assets/auth-nurse.jpg";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const email = (location.state as any)?.email || "";
  const redirectTo = (location.state as any)?.redirectTo || "/dashboard";

  // Redirect if accessed directly without email
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = () => {
    if (otp.length < 6) {
      toast({ title: "Please enter the full 6-digit code", variant: "destructive" });
      return;
    }
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (otp === "000000") {
        setError(true);
        setLoading(false);
        toast({ title: "Invalid verification code", description: "Please check your code or resend a new one.", variant: "destructive" });
        return;
      }
      setVerified(true);
      setLoading(false);
      toast({ title: "Email verified successfully!" });
      setTimeout(() => navigate(redirectTo), 1200);
    }, 800);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setError(false);
    setOtp("");
    toast({ title: "Verification code resent!", description: `A new code has been sent to ${email}` });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left image panel */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-4 rounded-2xl overflow-hidden">
          <img src={authImage} alt="Healthcare" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col p-8 lg:p-16">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <a href="#" className="text-sm text-primary hover:underline">Need help? Contact Support</a>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify your email</h1>
          <p className="text-muted-foreground mb-8">
            We've sent a 6-digit verification code to <strong>{email}</strong>.
          </p>

          <div className="mb-6">
            <InputOTP maxLength={6} value={otp} onChange={(val) => { setOtp(val); setError(false); }}>
              <InputOTPGroup className="gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={`w-14 h-14 text-xl border-2 rounded-xl ${
                      verified
                        ? "border-green-500 text-green-600"
                        : error
                        ? "border-destructive text-destructive"
                        : "border-border"
                    }`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {verified && (
            <p className="flex items-center gap-2 text-green-600 text-sm font-medium mb-4">
              <CheckCircle2 className="h-4 w-4" /> Email verified successfully! Redirecting...
            </p>
          )}

          {error && !verified && (
            <div className="flex items-start gap-2 text-destructive text-sm font-medium mb-4 bg-destructive/10 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>Invalid verification code. Please try again.</p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-primary font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </div>
          )}

          <Button
            className="w-full rounded-full mt-4"
            size="lg"
            onClick={handleVerify}
            disabled={loading || verified}
          >
            {loading ? "Verifying..." : verified ? "Verified!" : "Verify Code"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Didn't receive the code?{" "}
            <button
              className="text-primary font-semibold hover:underline disabled:opacity-50"
              onClick={handleResend}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend it"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
