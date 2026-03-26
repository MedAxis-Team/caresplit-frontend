import { CheckCircle2, XCircle } from "lucide-react";

const transactions = [
  { desc: "Monthly Payment - Standard Plan", date: "Oct 01, 2023", amount: "$350.00", status: "Success" },
  { desc: "Monthly Payment - Standard Plan", date: "Sep 01, 2023", amount: "$350.00", status: "Success" },
  { desc: "Monthly Payment - Standard Plan", date: "Aug 01, 2023", amount: "$350.00", status: "Failed" },
  { desc: "Plan Activation Fee", date: "Jul 15, 2023", amount: "$0.00", status: "Success" },
  { desc: "Monthly Payment - Standard Plan", date: "Jul 01, 2023", amount: "$350.00", status: "Success" },
];

const Transactions = () => (
  <div className="max-w-3xl">
    <h1 className="text-2xl font-bold text-foreground mb-6">Transaction History</h1>
    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
        <span>Description</span><span>Date</span><span>Amount</span><span>Status</span>
      </div>
      {transactions.map((tx, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-0 items-center text-sm">
          <span className="text-foreground font-medium">{tx.desc}</span>
          <span className="text-muted-foreground">{tx.date}</span>
          <span className="text-foreground font-semibold">{tx.amount}</span>
          <span className={`flex items-center gap-1 text-xs font-medium ${tx.status === "Success" ? "text-green-success" : "text-destructive"}`}>
            {tx.status === "Success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {tx.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Transactions;
