import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, UserPlus, FileText, AlertCircle, MoreVertical, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatNaira } from "@/lib/currency";

const initialsColors = [
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

const getInitialsColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return initialsColors[Math.abs(hash) % initialsColors.length];
};

const ProviderPatients = () => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Bill modal
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [billForm, setBillForm] = useState({ amount: "", description: "", type: "", hospital: "" });
  const [billLoading, setBillLoading] = useState(false);

  // Enroll modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [searchPatientId, setSearchPatientId] = useState("");
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // View patient modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePatient, setProfilePatient] = useState<any>(null);
  const [patientBills, setPatientBills] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchPatients = () => {
    if (!authUser) return;
    setLoading(true);
    fetch(`/api/providers/${authUser._id}/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, [authUser]);

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase()) ||
    p.treatment?.toLowerCase().includes(search.toLowerCase())
  );

  // Search patient by ID for enrollment
  const handleSearchPatient = async () => {
    if (!searchPatientId.trim()) return;
    setEnrollLoading(true);
    setSearchError("");
    setFoundPatient(null);
    try {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(searchPatientId.trim())}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setFoundPatient(data[0]);
      } else {
        setSearchError("No patient found with this ID. Make sure the patient has registered on CareSplit.");
      }
    } catch {
      setSearchError("Search failed. Please try again.");
    }
    setEnrollLoading(false);
  };

  // Enroll found patient
  const handleEnrollPatient = async () => {
    if (!foundPatient || !authUser) return;
    setEnrollLoading(true);
    try {
      await fetch(`/api/providers/${authUser._id}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: foundPatient._id,
          patientId: foundPatient.patientId,
          name: foundPatient.name,
          email: foundPatient.email,
          phone: foundPatient.phone,
        }),
      });
      fetchPatients();
      setShowEnrollModal(false);
      setSearchPatientId("");
      setFoundPatient(null);
      toast({ title: `${foundPatient.name} enrolled successfully!` });
    } catch {
      toast({ title: "Enrollment failed", variant: "destructive" });
    }
    setEnrollLoading(false);
  };

  // Add bill for patient
  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !authUser) return;
    setBillLoading(true);
    try {
      await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          providerId: authUser._id,
          hospital: billForm.hospital || authUser.name || "Provider Hospital",
          type: billForm.type || "Medical Service",
          amount: Number(billForm.amount),
          description: billForm.description,
          ref: `BIL-${String(Date.now()).slice(-4)}`,
          date: new Date().toISOString().split("T")[0],
          status: "Unpaid",
          statusColor: "text-destructive",
          action: "split",
          charges: [{ name: billForm.description, amount: Number(billForm.amount) }],
        }),
      });
      // Also add notification for patient
      toast({ title: `Bill of ${formatNaira(Number(billForm.amount))} added for ${selectedPatient.name}` });
      setShowBillModal(false);
      setBillForm({ amount: "", description: "", type: "", hospital: "" });
      fetchPatients();
    } catch {
      toast({ title: "Failed to add bill", variant: "destructive" });
    }
    setBillLoading(false);
  };

  // View patient profile + bills
  const handleViewProfile = async (patient: any) => {
    setProfilePatient(patient);
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const res = await fetch(`/api/bills?patientId=${patient._id}`);
      const data = await res.json();
      setPatientBills(data);
    } catch {
      setPatientBills([]);
    }
    setProfileLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Patient Directory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage enrolled patients and monitor payment plan status.</p>
        </div>
        <Button onClick={() => { setShowEnrollModal(true); setSearchPatientId(""); setFoundPatient(null); setSearchError(""); }} className="w-fit gap-2">
          <UserPlus className="h-4 w-4" /> Enroll New Patient
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, Patient ID, or treatment..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" className="gap-2 w-fit">
              <Filter className="h-4 w-4" /> Filter Status
            </Button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Patient ID</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Treatment</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Total Balance</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Plan Status</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">Loading patients...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No patients found.</td></tr>
                ) : (
                  filtered.map((p) => {
                    const color = getInitialsColor(p.name || "");
                    return (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="py-3">
                          <button onClick={() => handleViewProfile(p)} className="flex items-center gap-3 hover:underline text-left">
                            <div className={`w-9 h-9 rounded-full ${color} text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                              {p.initials}
                            </div>
                            <span className="font-medium text-foreground">{p.name}</span>
                          </button>
                        </td>
                        <td className="py-3 text-muted-foreground">{p.id}</td>
                        <td className="py-3 text-muted-foreground">{p.treatment}</td>
                        <td className="py-3 font-semibold text-foreground">{formatNaira(Number(p.balance))}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${p.color}`}>
                            {p.status === "Active" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            ) : p.status === "At Risk" ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                            ) : (
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                p.status === "Paused" ? "bg-orange-500" : "bg-muted-foreground"
                              }`} />
                            )}
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="relative">
                            <button
                              onClick={() => { setSelectedPatient(p); setShowBillModal(true); setBillForm({ amount: "", description: "", type: "", hospital: "" }); }}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 text-sm text-muted-foreground">
            <span>Showing 1 to {filtered.length} of {patients.length} patients</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Prev</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enroll New Patient Modal */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Enroll New Patient
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Search for a registered patient using their Patient ID, name, or email. The patient must have a CareSplit account.
          </p>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Patient ID (e.g. PAT-10001) or name"
                className="pl-10"
                value={searchPatientId}
                onChange={(e) => { setSearchPatientId(e.target.value); setSearchError(""); setFoundPatient(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchPatient(); }}
              />
            </div>
            <Button onClick={handleSearchPatient} disabled={enrollLoading || !searchPatientId.trim()}>
              {enrollLoading && !foundPatient ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchError && (
            <div className="flex items-center gap-2 text-destructive text-sm mt-2 bg-destructive/10 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {searchError}
            </div>
          )}

          {foundPatient && (
            <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                  {foundPatient.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{foundPatient.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {foundPatient.patientId} · {foundPatient.email}</p>
                </div>
              </div>
              <Button className="w-full" onClick={handleEnrollPatient} disabled={enrollLoading}>
                {enrollLoading ? "Enrolling..." : `Enroll ${foundPatient.name}`}
              </Button>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowEnrollModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bill Modal */}
      <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bill for {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="bg-muted/50 rounded-lg p-3 mb-2">
              <p className="text-xs text-muted-foreground">Patient ID: <span className="font-mono font-semibold text-foreground">{selectedPatient.id}</span></p>
              <p className="text-xs text-muted-foreground">Name: <span className="font-semibold text-foreground">{selectedPatient.name}</span></p>
            </div>
          )}
          <form onSubmit={handleAddBill}>
            <div className="space-y-4">
              <div>
                <Label>Hospital / Clinic Name</Label>
                <Input placeholder={authUser?.name || "Hospital name"} value={billForm.hospital} onChange={(e) => setBillForm((f) => ({ ...f, hospital: e.target.value }))} />
              </div>
              <div>
                <Label>Treatment Type</Label>
                <Input placeholder="e.g. Surgery, Lab Work, Consultation" required value={billForm.type} onChange={(e) => setBillForm((f) => ({ ...f, type: e.target.value }))} />
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="Brief description of the bill" required value={billForm.description} onChange={(e) => setBillForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <Label>Amount (₦)</Label>
                <Input type="number" min="0" placeholder="0.00" required value={billForm.amount} onChange={(e) => setBillForm((f) => ({ ...f, amount: e.target.value }))} />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowBillModal(false)}>Cancel</Button>
              <Button type="submit" disabled={billLoading}>{billLoading ? "Saving..." : "Add Bill"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Patient Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>
          {profilePatient && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary text-lg font-bold flex items-center justify-center">
                  {profilePatient.initials}
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{profilePatient.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{profilePatient.id}</p>
                  {profilePatient.email && <p className="text-xs text-muted-foreground">{profilePatient.email}</p>}
                  {profilePatient.phone && <p className="text-xs text-muted-foreground">{profilePatient.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Treatment</p>
                  <p className="font-semibold text-foreground text-sm">{profilePatient.treatment}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-semibold text-foreground text-sm">{formatNaira(Number(profilePatient.balance))}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={`font-semibold text-sm ${profilePatient.color}`}>{profilePatient.status}</p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-2">Bills</h3>
              {profileLoading ? (
                <p className="text-muted-foreground text-sm py-4 text-center">Loading bills...</p>
              ) : patientBills.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No bills found for this patient.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {patientBills.map((bill: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{bill.description || bill.type}</p>
                        <p className="text-xs text-muted-foreground">{bill.hospital} · {bill.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatNaira(Number(bill.amount))}</p>
                        <p className={`text-xs font-medium ${bill.statusColor || "text-muted-foreground"}`}>{bill.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileModal(false)}>Close</Button>
            <Button onClick={() => { setShowProfileModal(false); setSelectedPatient(profilePatient); setShowBillModal(true); setBillForm({ amount: "", description: "", type: "", hospital: "" }); }}>Add Bill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderPatients;
