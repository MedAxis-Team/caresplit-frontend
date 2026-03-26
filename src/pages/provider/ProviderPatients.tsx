import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

const patients = [
  { initials: "RF", name: "Robert Fox", id: "P-10024", treatment: "Orthopedic Surgery", balance: "$4,200", status: "Active", color: "text-green-600" },
  { initials: "WW", name: "Wade Warren", id: "P-10025", treatment: "Emergency Visit", balance: "$1,500", status: "Active", color: "text-green-600" },
  { initials: "JC", name: "Jane Cooper", id: "P-10026", treatment: "Maternity Care", balance: "$8,400", status: "Active", color: "text-green-600" },
  { initials: "EH", name: "Esther Howard", id: "P-10027", treatment: "Physical Therapy", balance: "$850", status: "At Risk", color: "text-destructive" },
  { initials: "MC", name: "Michael Chang", id: "P-10028", treatment: "Cardiology", balance: "$2,100", status: "At Risk", color: "text-destructive" },
  { initials: "SJ", name: "Sarah Jenkins", id: "P-10029", treatment: "Oncology", balance: "$5,500", status: "Paused", color: "text-orange-500" },
  { initials: "DM", name: "David Miller", id: "P-10030", treatment: "Neurology", balance: "$3,200", status: "Active", color: "text-green-600" },
];

const ProviderPatients = () => {
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.treatment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Directory</h1>
          <p className="text-sm text-muted-foreground">Manage enrolled patients and monitor payment plan status.</p>
        </div>
        <Button>Enroll New Patient</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID, or treatment..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter Status
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Patient ID</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Treatment</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Total Balance</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Plan Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {p.initials}
                        </div>
                        <span className="font-medium text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.id}</td>
                    <td className="py-3 text-muted-foreground">{p.treatment}</td>
                    <td className="py-3 font-semibold text-foreground">{p.balance}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${p.color} flex items-center gap-1`}>
                        <span className={`w-2 h-2 rounded-full ${p.status === "Active" ? "bg-green-500" : p.status === "At Risk" ? "bg-destructive" : "bg-orange-500"}`} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Showing 1 to {filtered.length} of 3,492 patients</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Prev</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderPatients;
