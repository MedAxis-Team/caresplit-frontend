import { Button } from "@/components/ui/button";
import { Building2, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const bills = [
  {
    id: 1,
    hospital: "Memorial General Hospital",
    type: "Emergency Room",
    amount: 3500,
    ref: "BILL-4921",
    date: "Sep 14, 2026",
    status: "Action Required",
    statusColor: "text-destructive",
    charges: [
      { name: "Emergency Room Visit (Level 4)", amount: 1500 },
      { name: "CT Scan (Head/Brain)", amount: 1200 },
      { name: "Laboratory Services", amount: 450 },
      { name: "Medications", amount: 350 },
    ],
    action: "split",
  },
  {
    id: 2,
    hospital: "Westside Cardiology Clinic",
    type: "Specialist Visit",
    amount: 1250,
    ref: "BILL-3844",
    date: "Aug 02, 2023",
    status: "Plan Active",
    statusColor: "text-green-success",
    charges: [
      { name: "Echocardiogram", amount: 800 },
      { name: "Consultation Fee", amount: 450 },
    ],
    action: "manage",
  },
  {
    id: 3,
    hospital: "City Orthopedics Center",
    type: "Physical Therapy",
    amount: 850,
    ref: "BILL-2910",
    date: "Jun 15, 2023",
    status: "Paid in Full",
    statusColor: "text-muted-foreground",
    charges: [
      { name: "Initial Assessment", amount: 250 },
      { name: "Physical Therapy Sessions (x4)", amount: 600 },
    ],
    action: "none",
  },
];

const Bills = () => (
  <div className="max-w-5xl">
    <h1 className="text-2xl font-bold text-foreground mb-1">Medical Bills</h1>
    <p className="text-muted-foreground mb-6">Review your outstanding statements and balances.</p>

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {bills.map((bill) => (
          <div key={bill.id} className={`bg-card rounded-2xl shadow-card overflow-hidden border-t-4 ${bill.action === "split" ? "border-t-destructive" : bill.action === "manage" ? "border-t-orange-warning" : "border-t-border"}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{bill.hospital}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3" /> {bill.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">${bill.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  <p className={`text-xs font-medium ${bill.statusColor}`}>{bill.status}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Bill Reference</span><span className="text-foreground">{bill.ref}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service Date</span><span className="text-foreground">{bill.date}</span></div>
                <div className="mt-3">
                  <p className="font-semibold text-foreground mb-2">Itemized Charges</p>
                  {bill.charges.map((c) => (
                    <div key={c.name} className="flex justify-between py-0.5">
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className="text-foreground">${c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-foreground">${bill.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {bill.action === "split" && (
                  <Link to="/dashboard/payment-plans" className="flex-1">
                    <Button className="w-full rounded-full">Split Bill with CareSplit</Button>
                  </Link>
                )}
                {bill.action === "manage" && (
                  <Link to="/dashboard/manage-plan" className="flex-1">
                    <Button className="w-full rounded-full" variant="outline">Manage Payment Plan</Button>
                  </Link>
                )}
                <Button variant="outline" className="rounded-full gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right sidebar info */}
      <div className="space-y-6">
        <div className="bg-card rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">How CareSplit Works</h3>
          <div className="space-y-4">
            {[
              { n: 1, title: "Review Your Bill", desc: "Make sure the hospital charges are correct." },
              { n: 2, title: "Choose a Plan", desc: "Select a 3, 6, or 12 month installment plan that fits your budget." },
              { n: 3, title: "Setup Payments", desc: "Add your card or bank account for automatic deductions." },
            ].map((s) => (
              <div key={s.n} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{s.n}</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-full">Learn More</Button>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-3">Quick Help</h3>
          <div className="space-y-2">
            {["How do I dispute a charge?", "Can I combine multiple bills?", "Tax document access"].map((q) => (
              <button key={q} className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm text-foreground">
                {q} <span className="text-muted-foreground">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Bills;
