
import { CheckCircle2, XCircle, Receipt, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const Transactions = () => {
  const { user: authUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    const url = authUser.role === "provider"
      ? `/api/providers/${authUser._id}/transactions`
      : `/api/transactions?userId=${authUser._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [authUser]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transaction History</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track all your payment activity in one place.</p>
        </div>
        <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full w-fit">
          {transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {/* Header - hidden on mobile, show card layout instead */}
        <div className="hidden sm:grid grid-cols-4 gap-4 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
          <span>Description</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Receipt className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No transactions found.</p>
            <p className="text-xs text-muted-foreground">Your payments will appear here once you make a payment.</p>
          </div>
        ) : (
          transactions.map((tx, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 p-4 border-b border-border last:border-0 items-start sm:items-center hover:bg-muted/50 transition-colors">
              <div>
                <span className="text-foreground font-medium text-sm">{tx.desc || tx.description}</span>
                <span className="text-xs text-muted-foreground sm:hidden block mt-0.5">{tx.date || tx.createdAt}</span>
              </div>
              <span className="text-muted-foreground text-sm hidden sm:block">{tx.date || tx.createdAt}</span>
              <span className="text-foreground font-semibold text-sm">{formatNaira(Number(tx.amount))}</span>
              <span className={`flex items-center gap-1 text-xs font-medium w-fit ${tx.status === "Success" || tx.status === "completed" ? "text-green-600" : "text-destructive"}`}>
                {tx.status === "Success" || tx.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {tx.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
