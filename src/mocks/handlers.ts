// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_URL = '/api';

// In-memory mock data (mirrors db.json structure)
const db: Record<string, any[]> = {
  users: [
    { id: 1, _id: "demo-user-id", patientId: "PAT-10001", role: "patient", name: "Jane Doe", email: "jane@example.com", phone: "+2348012345678" },
    { id: 2, _id: "demo-provider-1", role: "provider", name: "Dr. Smith Hospital", email: "drsmith@example.com", phone: "+2348098765432" },
  ],
  bills: [
    {
      id: 1, patientId: "demo-user-id", providerId: "demo-provider-1",
      hospital: "Dr. Smith Hospital", type: "Surgery",
      amount: 120000, description: "Surgery", ref: "BIL-001",
      date: "2026-03-10", status: "Plan Active", statusColor: "text-primary",
      action: "manage",
      charges: [
        { name: "Surgery", amount: 80000 },
        { name: "Anesthesia", amount: 25000 },
        { name: "Hospital Stay", amount: 15000 },
      ],
      activePlan: { months: 6, monthly: 21000 },
    },
    {
      id: 2, patientId: "demo-user-id", providerId: "demo-provider-1",
      hospital: "Lagos Medical Center", type: "Lab Work",
      amount: 45000, description: "Lab Diagnostics", ref: "BIL-002",
      date: "2026-03-20", status: "Unpaid", statusColor: "text-destructive",
      action: "split",
      charges: [
        { name: "Blood Work", amount: 20000 },
        { name: "Imaging", amount: 25000 },
      ],
    },
  ],
  paymentPlans: [
    { id: 1, billId: 1, patientId: "demo-user-id", providerId: "demo-provider-1", totalAmount: 120000, installments: 6, frequency: "monthly", startDate: "2026-03-15", status: "active" },
  ],
  payments: [
    { id: 1, planId: 1, amount: 20000, paidAt: "2026-03-16", status: "completed" },
  ],
  transactions: [
    { id: 1, userId: "demo-user-id", amount: 20000, type: "debit", description: "Payment for Surgery", status: "completed", createdAt: "2026-03-16", date: "Mar 16, 2026" },
    { id: 2, userId: "demo-user-id", amount: 15000, type: "debit", description: "Lab Diagnostics Deposit", status: "completed", createdAt: "2026-03-18", date: "Mar 18, 2026" },
    { id: 3, userId: "demo-user-id", amount: 21000, type: "debit", description: "Surgery Plan - Month 2", status: "Success", createdAt: "2026-04-15", date: "Apr 15, 2026" },
  ],
  notifications: [
    { id: 1, userId: "demo-user-id", title: "Payment Successful", icon: "CheckCircle2", message: "Your payment of ₦20,000 was successful.", read: false, createdAt: "2026-03-16", time: "2 hours ago" },
    { id: 2, userId: "demo-user-id", title: "Payment Reminder", icon: "Bell", message: "Your next payment of ₦21,000 is due on Apr 15.", read: false, createdAt: "2026-04-10", time: "1 day ago" },
    { id: 3, userId: "demo-user-id", title: "New Bill Added", icon: "AlertCircle", message: "A new bill of ₦45,000 from Lagos Medical Center has been added.", read: true, createdAt: "2026-03-20", time: "Mar 20" },
    { id: 4, userId: "demo-provider-1", title: "New Patient Enrolled", icon: "CheckCircle2", message: "Jane Doe has enrolled in a 6-month plan.", read: false, createdAt: "2026-03-15", time: "Mar 15" },
  ],
  activities: [
    { id: 1, userId: "demo-user-id", desc: "Payment received", date: "Mar 16, 2026", amount: 20000, color: "text-green-success" },
    { id: 2, userId: "demo-user-id", desc: "Payment plan activated", date: "6-month plan started", amount: null, color: "text-primary" },
    { id: 3, userId: "demo-user-id", desc: "Payment received", date: "Mar 18, 2026", amount: 15000, color: "text-green-success" },
  ],
  // Provider-specific data
  providerStats: [
    { label: "Total Revenue Collected", value: "$842,500.00", icon: "DollarSign", color: "bg-blue-100 text-blue-600", change: "+12.5%", up: true },
    { label: "Active Payment Plans", value: "1,248", icon: "LineChart", color: "bg-green-100 text-green-600", change: "+5.2%", up: true },
    { label: "Outstanding Payments", value: "$145,200.00", icon: "TrendingUp", color: "bg-blue-100 text-blue-600", change: "-2.4%", up: false, subtitle: "Decreased from last month" },
    { label: "Total Patients Enrolled", value: "3,492", icon: "Users", color: "bg-purple-100 text-purple-600", change: "+18%", up: true },
  ],
  providerActionItems: [
    { name: "Michael Chang", dot: "bg-destructive", time: "2 hrs ago", desc: "Missed 2nd installment payment", amount: "$450.00" },
    { name: "Sarah Jenkins", dot: "bg-orange-500", time: "5 hrs ago", desc: "Hardship pause request submitted", amount: "Plan: $1,200" },
    { name: "David Miller", dot: "bg-destructive", time: "1 day ago", desc: "Card expired before next payment", amount: "Due in 3 days" },
    { name: "Emily Clark", dot: "bg-orange-500", time: "2 days ago", desc: "Requested early payoff settlement", amount: "$2,100.00" },
  ],
  providerTransactions: [
    { patient: "Robert Fox", plan: "Orthopedic Surgery", amount: 350, date: "Today, 10:24 AM", status: "Success" },
    { patient: "Wade Warren", plan: "Emergency Visit", amount: 120, date: "Today, 09:15 AM", status: "Success" },
    { patient: "Jane Cooper", plan: "Maternity Care", amount: 500, date: "Yesterday", status: "Processing" },
    { patient: "Esther Howard", plan: "Physical Therapy", amount: 85, date: "Yesterday", status: "Failed" },
  ],
  providerPatients: [
    { id: "P-10024", _id: "pat-robert", name: "Robert Fox", initials: "RF", email: "robert@example.com", phone: "(555) 019-2834", treatment: "Orthopedic Surgery", balance: 4200, status: "Active", color: "text-green-600" },
    { id: "P-10025", _id: "pat-wade", name: "Wade Warren", initials: "WW", email: "wade@example.com", phone: "(555) 019-2835", treatment: "Emergency Visit", balance: 1500, status: "Active", color: "text-green-600" },
    { id: "P-10026", _id: "pat-jane-c", name: "Jane Cooper", initials: "JC", email: "jane.c@example.com", phone: "(555) 019-2836", treatment: "Maternity Care", balance: 8400, status: "Active", color: "text-green-600" },
    { id: "P-10027", _id: "pat-esther", name: "Esther Howard", initials: "EH", email: "esther@example.com", phone: "(555) 019-2837", treatment: "Physical Therapy", balance: 850, status: "At Risk", color: "text-destructive" },
    { id: "P-10028", _id: "pat-michael", name: "Michael Chang", initials: "MC", email: "michael@example.com", phone: "(555) 019-2838", treatment: "Cardiology", balance: 2100, status: "At Risk", color: "text-destructive" },
    { id: "P-10029", _id: "pat-sarah", name: "Sarah Jenkins", initials: "SJ", email: "sarah@example.com", phone: "(555) 019-2839", treatment: "Oncology", balance: 5500, status: "Paused", color: "text-orange-500" },
    { id: "P-10030", _id: "pat-david", name: "David Miller", initials: "DM", email: "david@example.com", phone: "(555) 019-2840", treatment: "Neurology", balance: 3200, status: "Active", color: "text-green-600" },
  ],
};

export const handlers = [
  // Register (signup)
  http.post(`${API_URL}/register`, async ({ request }) => {
    const body = await request.json() as any;
    // Check if user already exists by email
    const existing = db.users.find((u: any) => u.email === body.email);
    if (existing) {
      return HttpResponse.json(existing);
    }
    // For first patient signup, reuse demo user so mock bills/transactions/notifications work
    const demoPatient = db.users.find((u: any) => u._id === "demo-user-id");
    if (body.role === "patient" && demoPatient) {
      demoPatient.name = body.name;
      demoPatient.email = body.email;
      demoPatient.phone = body.phone || demoPatient.phone;
      demoPatient.patientId = demoPatient.patientId || "PAT-10001";
      // Also update providerPatients entry to keep in sync
      const pp = db.providerPatients.find((p: any) => p._id === "demo-user-id");
      if (pp) {
        pp.name = body.name;
        pp.initials = body.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        pp.email = body.email;
        pp.phone = body.phone || pp.phone;
      }
      return HttpResponse.json(demoPatient, { status: 201 });
    }
    // For first provider signup, reuse demo provider so mock stats/patients/transactions work
    const demoProvider = db.users.find((u: any) => u._id === "demo-provider-1");
    if (body.role === "provider" && demoProvider) {
      demoProvider.name = body.name || demoProvider.name;
      demoProvider.email = body.email;
      demoProvider.phone = body.phone || demoProvider.phone;
      return HttpResponse.json(demoProvider, { status: 201 });
    }
    // Create brand new user
    const nextId = db.users.length + 1;
    const patientId = body.role === "patient" ? `PAT-${10000 + nextId}` : undefined;
    const _id = `user-${Date.now()}`;
    const newUser: any = {
      id: nextId,
      _id,
      patientId,
      role: body.role || "patient",
      name: body.name,
      email: body.email,
      phone: body.phone || "",
    };
    db.users.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Users
  http.get(`${API_URL}/users`, () => {
    return HttpResponse.json(db.users);
  }),

  // Search patients by patientId or name
  http.get(`${API_URL}/patients/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase().trim();
    if (!q) return HttpResponse.json([]);
    // Search in users (patients only) and providerPatients
    const fromUsers = db.users
      .filter((u: any) => u.role === "patient" && (
        (u.patientId || "").toLowerCase().includes(q) ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      ))
      .map((u: any) => ({
        _id: u._id,
        patientId: u.patientId,
        name: u.name,
        email: u.email,
        phone: u.phone,
        initials: u.name ? u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?",
      }));
    return HttpResponse.json(fromUsers);
  }),

  // Bills
  http.get(`${API_URL}/bills`, ({ request }) => {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const filtered = patientId ? db.bills.filter(b => b.patientId === patientId) : db.bills;
    return HttpResponse.json(filtered);
  }),
  http.patch(`${API_URL}/bills/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const bill = db.bills.find(b => b.id === Number(params.id));
    if (bill) {
      Object.assign(bill, body);
      return HttpResponse.json(bill);
    }
    return new HttpResponse(null, { status: 404 });
  }),
  http.post(`${API_URL}/bills`, async ({ request }) => {
    const body = await request.json() as any;
    const newBill = { id: db.bills.length + 1, ...body };
    db.bills.push(newBill);
    return HttpResponse.json(newBill, { status: 201 });
  }),

  // Payment Plans
  http.get(`${API_URL}/paymentPlans`, ({ request }) => {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const filtered = patientId ? db.paymentPlans.filter(p => p.patientId === patientId) : db.paymentPlans;
    return HttpResponse.json(filtered);
  }),

  // Transactions
  http.get(`${API_URL}/transactions`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const filtered = userId ? db.transactions.filter(t => t.userId === userId) : db.transactions;
    return HttpResponse.json(filtered);
  }),

  // Notifications
  http.get(`${API_URL}/notifications`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const filtered = userId ? db.notifications.filter(n => n.userId === userId) : db.notifications;
    return HttpResponse.json(filtered);
  }),

  // Activities
  http.get(`${API_URL}/activities`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const filtered = userId ? db.activities.filter(a => a.userId === userId) : db.activities;
    return HttpResponse.json(filtered);
  }),

  // Provider-specific endpoints
  http.get(`${API_URL}/providers/:id/stats`, () => {
    return HttpResponse.json(db.providerStats);
  }),
  http.get(`${API_URL}/providers/:id/actionItems`, () => {
    return HttpResponse.json(db.providerActionItems);
  }),
  http.get(`${API_URL}/providers/:id/transactions`, () => {
    return HttpResponse.json(db.providerTransactions);
  }),
  http.get(`${API_URL}/providers/:id/patients`, () => {
    return HttpResponse.json(db.providerPatients);
  }),

  // Enroll patient under provider
  http.post(`${API_URL}/providers/:id/patients`, async ({ request }) => {
    const body = await request.json() as any;
    // Check if already enrolled
    const exists = db.providerPatients.find((p: any) => p._id === body._id);
    if (exists) {
      return HttpResponse.json(exists);
    }
    const newPatient: any = {
      id: body.patientId || `PAT-${10000 + db.providerPatients.length + 1}`,
      _id: body._id,
      name: body.name,
      initials: body.name ? body.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?",
      email: body.email || "",
      phone: body.phone || "",
      treatment: "Pending Assessment",
      balance: 0,
      status: "Pending",
      color: "text-orange-500",
    };
    db.providerPatients.push(newPatient);
    return HttpResponse.json(newPatient, { status: 201 });
  }),

  // Mark notifications as read
  http.patch(`${API_URL}/notifications/read`, async ({ request }) => {
    const body = await request.json() as any;
    const userId = body.userId;
    if (userId) {
      db.notifications.forEach((n: any) => {
        if (n.userId === userId) n.read = true;
      });
    }
    return HttpResponse.json({ success: true });
  }),
];
