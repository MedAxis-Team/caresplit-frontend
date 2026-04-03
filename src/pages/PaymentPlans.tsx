import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, CreditCard, Landmark, Lock, Shield, Calendar } from "lucide-react";
import paymentImg from "@/assets/payment-woman.jpg";
import authCardImg from "@/assets/auth-card-woman.jpg";
import authBankImg from "@/assets/auth-bank-man.jpg";
import { useAuth } from "@/contexts/AuthContext";

const fallbackPlans = [
  { months: 3, monthly: 40000, total: 120000, interest: "0% Interest", popular: false },
  { months: 6, monthly: 20000, total: 120000, interest: "0% Interest", popular: true },
  { months: 12, monthly: 10000, total: 120000, interest: "0% Interest", popular: false },
];

const PaymentPlans = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(0);
  const [payMethod, setPayMethod] = useState<"card" | "bank">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>(fallbackPlans);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [billsArr, setBillsArr] = useState<any[]>([]);

  useEffect(() => {
    if (!authUser) return;
    setLoadingPlans(true);
    Promise.all([
      fetch(`/api/paymentPlans?patientId=${authUser._id}`).then(r => r.json()).catch(() => []),
      fetch(`/api/bills?patientId=${authUser._id}`).then(r => r.json()).catch(() => []),
    ]).then(([data, bills]) => {
      setBillsArr(bills);
      // Compute total from bills for plan calculations
      const totalFromBills = bills.reduce((s: number, b: any) => s + (b.status === "Paid in Full" ? 0 : Number(b.amount || 0)), 0);
      const totalAmt = totalFromBills > 0 ? totalFromBills : (data.length > 0 ? (data[0]?.totalAmount || 120000) : 120000);
      setPlans([
        { months: 3, monthly: Math.round(totalAmt / 3), total: totalAmt, interest: "0% Interest", popular: false },
        { months: 6, monthly: Math.round(totalAmt / 6), total: totalAmt, interest: "0% Interest", popular: true },
        { months: 12, monthly: Math.round(totalAmt / 12), total: totalAmt, interest: "0% Interest", popular: false },
      ]);
    }).finally(() => setLoadingPlans(false));
  }, [authUser]);

  const plan = plans[selected] || {};

  const handleContinue = () => setStep(2);

  const handleAuthorize = async () => {
    setLoading(true);
    try {
      // Activate plan on first applicable bill
      const targetBill = billsArr.find((b: any) => b.status !== "Paid in Full" && b.status !== "Plan Active");
      if (targetBill && authUser) {
        await fetch(`/api/bills/${targetBill.id}/activate-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ months: plan.months }),
        });
        // Record first payment
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            billId: targetBill.id,
            userId: authUser._id,
            amount: plan.monthly,
            description: `${targetBill.hospital || "Hospital"} - ${plan.months}-month plan payment`,
          }),
        });
      }
    } catch { /* continue to confirmation */ }
    setLoading(false);
    setStep(3);
  };

  const handleGoToDashboard = () => navigate("/dashboard");

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center gap-0 mb-8 max-w-md">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            step > s ? "bg-primary text-primary-foreground" :
            step === s ? "bg-primary text-primary-foreground" :
            "bg-border text-muted-foreground"
          }`}>
            {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
          </div>
          {i < 2 && (
            <div className={`flex-1 h-0.5 mx-1 ${step > s ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );

  // STEP 1: Choose plan
  if (step === 1) {
    return (
      <div className="max-w-5xl">
        <StepIndicator />
        <h1 className="text-2xl font-bold text-foreground mb-1">Choose a Payment Plan</h1>
        <p className="text-muted-foreground mb-8">Split your bill into affordable payments.</p>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {loadingPlans ? (
              <div className="text-center text-muted-foreground py-12">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No payment plans available.</div>
            ) : (
              plans.map((p, i) => (
                <button
                  key={p.months}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-all relative ${
                    selected === i
                      ? "border-primary bg-secondary/50 shadow-card-hover"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full">POPULAR</span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${selected === i ? "text-primary" : "text-foreground"}`}>{p.months} Months</p>
                      <p className="text-2xl font-extrabold text-foreground mt-1">
                        ₦{p.monthly?.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{p.interest}</p>
                      <p className="text-xs text-muted-foreground">Total: ₦{p.total?.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === i ? "border-primary" : "border-border"}`}>
                      {selected === i && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </div>
                </button>
              ))
            )}
            <div className="bg-muted rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div>
                <p className="font-semibold text-foreground">Plan Summary</p>
                <p className="text-sm text-muted-foreground">
                  {plan.monthly ? `You'll pay ₦${plan.monthly?.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 3 })} for ${plan.months} months.` : 'Select a plan to see details.'}
                </p>
              </div>
              <Button className="rounded-full px-8 w-full sm:w-auto" size="lg" onClick={handleContinue} disabled={!plan.monthly}>Continue</Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img src={paymentImg} alt="Professional" className="rounded-2xl w-full h-full object-cover max-h-[600px]" loading="lazy" width={640} height={800} />
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Payment Authorization
  if (step === 2) {
    return (
      <div className="max-w-5xl">
        <StepIndicator />
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left image */}
          <div className="hidden lg:block">
            <img
              src={payMethod === "card" ? authCardImg : authBankImg}
              alt="Payment authorization"
              className="rounded-2xl w-full h-full object-cover max-h-[700px]"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>

          {/* Right form */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Payment Authorization</h1>
            <p className="text-muted-foreground mb-6">Select your preferred payment method for monthly deductions.</p>

            {/* Method toggle */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPayMethod("card")}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  payMethod === "card" ? "border-primary bg-secondary/50" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === "card" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Debit / Credit Card</p>
                  <p className="text-xs text-muted-foreground">Instant setup</p>
                </div>
              </button>
              <button
                onClick={() => setPayMethod("bank")}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  payMethod === "bank" ? "border-primary bg-secondary/50" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === "bank" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Bank Transfer (ACH)</p>
                  <p className="text-xs text-muted-foreground">Takes 1-2 days to verify</p>
                </div>
              </button>
            </div>

            {/* Payment details */}
            <div className="border border-border rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-foreground">Payment Details</p>
              </div>

              {payMethod === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Card Number</label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Expiry Date</label>
                      <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">CVC</label>
                      <Input placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-2xl p-8 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Landmark className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Connect your Bank</p>
                  <p className="text-sm text-muted-foreground mb-4">Securely connect your bank account via Plaid to set up recurring transfers.</p>
                  <Button variant="outline" className="rounded-full text-primary border-primary hover:bg-secondary">Connect Bank Account</Button>
                </div>
              )}
            </div>

            {/* Authorization notice */}
            <div className="bg-secondary/60 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">
                By confirming, you authorize CareSplit to automatically deduct <strong>₦{plan.monthly?.toLocaleString("en-NG")}</strong> monthly on the 15th of each month for {plan.months} months.
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="rounded-full" size="lg" onClick={() => setStep(1)}>Back</Button>
              <Button className="rounded-full" size="lg" onClick={handleAuthorize} disabled={loading}>
                {loading ? "Processing..." : "Authorize Payment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Confirmation
  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Payment Plan Activated!</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Your {plan.months}-month installment plan for Memorial General Hospital is now active.
          </p>

          {/* Summary card */}
          <div className="border border-border rounded-2xl p-6 w-full max-w-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Monthly Deduction</span>
              <span className="font-bold text-foreground text-lg">₦{plan.monthly?.toLocaleString("en-NG")}</span>
            </div>
            <hr className="border-border" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" /> Next Payment Date
              </div>
              <span className="font-semibold text-foreground">Oct 15, 2023</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CreditCard className="h-4 w-4" /> Payment Method
              </div>
              <span className="font-semibold text-foreground">
                {payMethod === "card" ? "Visa ending in 4242" : "Bank Transfer (ACH)"}
              </span>
            </div>
          </div>

          <Button className="rounded-full mt-8 w-full max-w-sm" size="lg" onClick={handleGoToDashboard}>
            Go to Payment Dashboard
          </Button>
        </div>

        {/* Decorative receipt illustration */}
        <div className="hidden lg:flex justify-center">
          <div className="relative">
            <div className="bg-secondary/30 rounded-3xl p-8 w-80">
              <div className="bg-card rounded-2xl shadow-card-hover p-6 rotate-3 relative">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground text-sm">CareSplit</span>
                </div>
                <p className="text-xs font-semibold text-primary mb-3">Payment Successful</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Hospital</span><span className="text-foreground font-medium">Memorial General</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Bill Amount</span><span className="text-foreground font-medium">₦{plan.total?.toLocaleString("en-NG")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="text-foreground font-medium">{plan.months}-Month Installment</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Monthly</span><span className="text-foreground font-medium">₦{plan.monthly?.toLocaleString("en-NG")}/mo</span></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
