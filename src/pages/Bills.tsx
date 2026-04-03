import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Download, Sparkles, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const Bills = () => {
  const { user: authUser } = useAuth();

  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBill, setEditBill] = useState<any>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBills = async () => {
    if (!authUser?._id) {
      setBills([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/bills?patientId=${authUser._id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await res.json();
      setBills(data);
    } catch (error) {
      console.error("Failed to load bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, [authUser]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Medical Bills
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage your healthcare bills in one place.
        </p>
      </div>

      {/* Search and Filter */}
      {bills.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by hospital, type, or reference..."
              className="pl-10 rounded-full bg-muted border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Plan Active">Plan Active</option>
            <option value="Paused">Paused</option>
            <option value="Paid in Full">Paid in Full</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading bills...
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No bills found.
            </div>
          ) : (() => {
            const filtered = bills.filter((b) => {
              const q = searchQuery.toLowerCase();
              const matchSearch = !q || (b.hospital || "").toLowerCase().includes(q) || (b.type || "").toLowerCase().includes(q) || (b.ref || "").toLowerCase().includes(q) || (b.description || "").toLowerCase().includes(q);
              const matchStatus = statusFilter === "all" || b.status === statusFilter;
              return matchSearch && matchStatus;
            });
            if (filtered.length === 0) {
              return (
                <div className="text-center py-16 text-muted-foreground">
                  No bills match your search.
                </div>
              );
            }
            return filtered.map((bill) => (
              <div
                key={bill.id}
                className={`bg-card rounded-2xl shadow-card overflow-hidden border-t-4 ${
                  bill.action === "split"
                    ? "border-t-destructive"
                    : bill.action === "manage"
                    ? "border-t-orange-warning"
                    : "border-t-border"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {bill.hospital}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> {bill.type}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">
                        {formatNaira(bill.amount)}
                      </p>
                      <p className={`text-xs font-medium ${bill.statusColor}`}>
                        {bill.status}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Bill Reference
                      </span>
                      <span className="text-foreground">{bill.ref}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Date</span>
                      <span className="text-foreground">{bill.date}</span>
                    </div>

                    <div className="mt-3">
                      <p className="font-semibold text-foreground mb-2">
                        Itemized Charges
                      </p>

                      {bill.charges?.map((c: any) => (
                        <div
                          key={c.name}
                          className="flex justify-between py-0.5"
                        >
                          <span className="text-muted-foreground">
                            {c.name}
                          </span>
                          <span className="text-foreground">
                            {formatNaira(c.amount)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-foreground">
                        {formatNaira(bill.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditBill(bill);
                        setEditAmount(String(bill.amount ?? ""));
                        setEditDesc(bill.description || "");
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    {bill.action === "split" && (
                      <Link to="/dashboard/payment-plans" className="flex-1">
                        <Button className="w-full rounded-full">
                          Split Bill with CareSplit
                        </Button>
                      </Link>
                    )}

                    {bill.action === "manage" && (
                      <Link to="/dashboard/manage-plan" className="flex-1">
                        <Button className="w-full rounded-full" variant="outline">
                          Manage Payment Plan
                        </Button>
                      </Link>
                    )}

                    <Button variant="outline" className="rounded-full gap-2">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-4">
              How CareSplit Works
            </h3>

            <div className="space-y-4">
              {[
                {
                  n: 1,
                  title: "Review Your Bill",
                  desc: "Make sure the hospital charges are correct.",
                },
                {
                  n: 2,
                  title: "Choose a Plan",
                  desc: "Select a 3, 6, or 12 month installment plan that fits your budget.",
                },
                {
                  n: 3,
                  title: "Setup Payments",
                  desc: "Add your card or bank account for automatic deductions.",
                },
              ].map((s) => (
                <div key={s.n} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 rounded-full">
              Learn More
            </Button>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Quick Help</h3>
            <div className="space-y-2">
              {[
                "How do I dispute a charge?",
                "Can I combine multiple bills?",
                "Tax document access",
              ].map((q) => (
                <button
                  key={q}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm text-foreground"
                >
                  {q}
                  <span className="text-muted-foreground">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bill</DialogTitle>
          </DialogHeader>

          {editBill && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);

                try {
                  const res = await fetch(`/api/bills/${editBill.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      amount: Number(editAmount),
                      description: editDesc,
                    }),
                  });

                  if (!res.ok) {
                    throw new Error("Failed to update bill");
                  }

                  setShowEditModal(false);
                  setEditBill(null);
                  setEditAmount("");
                  setEditDesc("");

                  await loadBills();
                } catch (error) {
                  console.error("Failed to update bill:", error);
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bills;
