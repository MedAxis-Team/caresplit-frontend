import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProviderCarePlans = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    email: "",
    phone: "",
    treatment: "",
    totalAmount: 0,
    installmentMonths: 3,
  });

  const monthly = form.totalAmount > 0 ? form.totalAmount / form.installmentMonths : 0;
  const totalRecovery = form.totalAmount;

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {[
        { num: 1, label: "PATIENT INFO" },
        { num: 2, label: "PLAN DETAILS" },
        { num: 3, label: "REVIEW & SEND" },
      ].map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s.num
                  ? "bg-green-500 text-white"
                  : step === s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border-2 border-border"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
                step >= s.num ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`w-12 sm:w-20 lg:w-28 h-0.5 mx-2 mt-[-20px] ${
                step > s.num ? "bg-green-500" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Care Plan Sent!</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
          The payment plan proposal has been successfully sent to{" "}
          <strong>{form.patientName}</strong> via email and SMS. They can review and accept it
          from their device.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStep(1);
              setForm({ patientName: "", patientId: "", email: "", phone: "", treatment: "", totalAmount: 0, installmentMonths: 3 });
            }}
          >
            Create Another Plan
          </Button>
          <Button onClick={() => navigate("/provider/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Create Care Plan</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Design a structured payment plan and send it to the patient for approval.
      </p>

      <StepIndicator />

      <Card>
        <CardContent className="p-5 sm:p-8">
          {/* Step 1: Patient Info */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Patient Information</h2>
              <div className="h-1 w-32 bg-primary/20 rounded mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label className="text-sm font-semibold">Patient Name</Label>
                  <Input
                    placeholder="Robert Fox"
                    value={form.patientName}
                    onChange={(e) => handleChange("patientName", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Patient ID / MRN</Label>
                  <Input
                    placeholder="P-10024"
                    value={form.patientId}
                    onChange={(e) => handleChange("patientId", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="robert.fox@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone Number (SMS)</Label>
                  <Input
                    placeholder="(555) 019-2834"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setStep(2)} disabled={!form.patientName}>
                  Continue &gt;
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Plan Details */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-6">Care Plan Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold">Treatment / Procedure Description</Label>
                    <Input
                      placeholder="Orthopedic Surgery - Knee Replacement"
                      value={form.treatment}
                      onChange={(e) => handleChange("treatment", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Total Patient Responsibility</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ₦
                      </span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0.00"
                        value={form.totalAmount || ""}
                        onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Installment Duration</Label>
                      <span className="text-xs text-primary font-medium">
                        {form.installmentMonths} Months
                      </span>
                    </div>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {[3, 6, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => handleChange("installmentMonths", m)}
                          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                            form.installmentMonths === m
                              ? "bg-foreground text-background"
                              : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {m} Mo
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly calculation panel */}
                <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-between border border-border">
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold text-primary">
                      ₦
                      {monthly.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-end text-sm">
                      <span className="text-green-600 font-semibold">0% APR</span>
                    </div>
                    <div className="flex items-center justify-end text-sm">
                      <span className="text-muted-foreground">₦0.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Total Recovery</span>
                      <span>
                        ₦
                        {totalRecovery.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!form.treatment || form.totalAmount <= 0}
                >
                  Review Plan &gt;
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-6">Review & Send Proposal</h2>

              <div className="bg-muted/30 rounded-xl p-5 sm:p-8 border border-border">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">CareSplit Proposal</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepared for <strong>{form.patientName}</strong>
                  </p>
                </div>

                <div className="border border-border rounded-xl p-4 sm:p-5 space-y-3 mb-6 bg-background">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Treatment</span>
                    <span className="text-sm font-semibold text-foreground text-right max-w-[60%]">
                      {form.treatment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Bill</span>
                    <span className="text-lg font-bold text-foreground">
                      ₦{form.totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-semibold">Proposed Terms</span>
                    <span className="text-sm text-primary font-semibold">
                      ₦{monthly.toLocaleString("en-NG", { minimumFractionDigits: 2 })}/mo for{" "}
                      {form.installmentMonths} mos
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <Send className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    By clicking &quot;Send Proposal&quot;, {form.patientName} will receive a
                    secure link via email and SMS to review and accept this payment plan on their
                    device.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Edit Details
                </button>
                <Button
                  onClick={async () => {
                    setSending(true);
                    try {
                      // Search for the patient by name/id to get their _id
                      const searchRes = await fetch(`/api/patients/search?q=${encodeURIComponent(form.patientName.trim())}`);
                      const patients = await searchRes.json();
                      const patientId = patients?.[0]?._id || "demo-user-id";

                      // Create a bill for the patient via the API
                      await fetch("/api/bills", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          patientId,
                          providerId: authUser?._id || "demo-provider-1",
                          hospital: authUser?.name || "Provider Hospital",
                          type: form.treatment,
                          description: form.treatment,
                          amount: form.totalAmount,
                          ref: `BIL-${String(Date.now()).slice(-4)}`,
                          date: new Date().toISOString().split("T")[0],
                          status: "Unpaid",
                          statusColor: "text-destructive",
                          action: "split",
                          charges: [{ name: form.treatment, amount: form.totalAmount }],
                        }),
                      });

                      toast({ title: `Care plan sent to ${form.patientName}!` });
                      setStep(4);
                    } catch {
                      toast({ title: "Failed to send care plan", variant: "destructive" });
                    }
                    setSending(false);
                  }}
                  className="gap-2"
                  disabled={sending}
                >
                  <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Proposal"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderCarePlans;
