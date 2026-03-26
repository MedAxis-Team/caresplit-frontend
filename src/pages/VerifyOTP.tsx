import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import authImage from "@/assets/auth-nurse.jpg";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = (location.state as any)?.email || "your@email.com";
  const redirectTo = (location.state as any)?.redirectTo || "/dashboard";

  const handleVerify = () => {
    if (otp.length < 6) {
      toast({ title: "Please enter the full 6-digit code", variant: "destructive" });
      return;
    }
    if (otp === "000000") {
      toast({ title: "Invalid verification code", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
      setTimeout(() => navigate(redirectTo), 1000);
    }, 800);
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
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={`w-14 h-14 text-xl border-2 rounded-xl ${
                      verified
                        ? "border-green-500 text-green-600"
                        : "border-border"
                    }`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {verified && (
            <p className="flex items-center gap-2 text-green-600 text-sm font-medium mb-4">
              <CheckCircle2 className="h-4 w-4" /> Email verified successfully!
            </p>
          )}

          <Button
            className="w-full rounded-full mt-4"
            size="lg"
            onClick={handleVerify}
            disabled={loading || verified}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Didn't receive the code?{" "}
            <button
              className="text-primary font-semibold hover:underline"
              onClick={() => toast({ title: "Code resent!" })}
            >
              Resend it
            </button>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            (Hint: enter '000000' to test error state)
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
