// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_URL = '/api';

// In-memory mock data — Patient data starts EMPTY for clean onboarding flow
const db: Record<string, any[]> = {
  users: [
    { id: 1, _id: "demo-user-id", patientId: "PAT-10001", role: "patient", name: "Jane Doe", email: "jane@example.com", phone: "+2348012345678" },
    { id: 2, _id: "demo-provider-1", role: "provider", name: "Dr. Smith Hospital", email: "drsmith@example.com", phone: "+2348098765432" },
  ],
  // Patient data starts empty — bills arrive when provider creates them
  bills: [],
  paymentPlans: [],
  payments: [],
  transactions: [],
  notifications: [],
  activities: [],
  // Provider-specific data — starts EMPTY for empty state
  providerPatients: [],
  providerTransactions: [],
  providerActionItems: [],
};

// Helper: compute provider stats dynamically from enrolled patients & bills
function computeProviderStats() {
  const totalPatients = db.providerPatients.length;
  const enrolledIds = db.providerPatients.map((p: any) => p._id);
  const providerBills = db.bills.filter((b: any) => enrolledIds.includes(b.patientId));
  const activePlans = providerBills.filter((b: any) => b.activePlan).length;
  const totalCollected = db.providerTransactions
    .filter((t: any) => t.status === "Success" || t.status === "completed")
    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
  const totalOutstanding = providerBills
    .filter((b: any) => b.status !== "Paid in Full")
    .reduce((sum: number, b: any) => sum + Number(b.amount || 0), 0);

  return [
    { label: "Total Revenue Collected", value: `₦${totalCollected.toLocaleString("en-NG")}`, icon: "DollarSign", color: "bg-blue-100 text-blue-600", change: totalCollected > 0 ? "+12.5%" : "0%", up: totalCollected > 0 },
    { label: "Active Payment Plans", value: String(activePlans), icon: "LineChart", color: "bg-green-100 text-green-600", change: activePlans > 0 ? "+5.2%" : "0%", up: activePlans > 0 },
    { label: "Outstanding Payments", value: `₦${totalOutstanding.toLocaleString("en-NG")}`, icon: "TrendingUp", color: "bg-blue-100 text-blue-600", change: totalOutstanding > 0 ? "-2.4%" : "0%", up: false, subtitle: totalOutstanding > 0 ? "Decreased from last month" : "" },
    { label: "Total Patients Enrolled", value: String(totalPatients), icon: "Users", color: "bg-purple-100 text-purple-600", change: totalPatients > 0 ? "+18%" : "0%", up: totalPatients > 0 },
  ];
}

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

    // Auto-create notification for the patient
    const billPatient = db.users.find((u: any) => u._id === body.patientId);
    if (billPatient) {
      const amt = Number(body.amount || 0);
      db.notifications.push({
        id: db.notifications.length + 1,
        userId: body.patientId,
        title: "New Bill Added",
        icon: "AlertCircle",
        message: `A new bill of ₦${amt.toLocaleString("en-NG")} from ${body.hospital || "your provider"} has been added.`,
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
        time: "Just now",
      });
    }

    // Auto-create provider transaction entry
    db.providerTransactions.push({
      patient: billPatient?.name || body.patientName || "Unknown",
      plan: body.type || body.description || "Medical Service",
      amount: Number(body.amount || 0),
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Success",
    });

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
    return HttpResponse.json(computeProviderStats());
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
    // Find existing bills for this patient to compute balance
    const patientBills = db.bills.filter((b: any) => b.patientId === body._id);
    const balance = patientBills.reduce((s: number, b: any) => s + (b.status === "Paid in Full" ? 0 : Number(b.amount || 0)), 0);
    const hasActivePlan = patientBills.some((b: any) => b.activePlan);

    const newPatient: any = {
      id: body.patientId || `PAT-${10000 + db.providerPatients.length + 1}`,
      _id: body._id,
      name: body.name,
      initials: body.name ? body.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?",
      email: body.email || "",
      phone: body.phone || "",
      treatment: patientBills.length > 0 ? patientBills[0].type || "Medical Service" : "Pending Assessment",
      balance,
      status: hasActivePlan ? "Active" : balance > 0 ? "Pending" : "Active",
      color: hasActivePlan ? "text-green-600" : balance > 0 ? "text-orange-500" : "text-green-600",
    };
    db.providerPatients.push(newPatient);

    // Add notification for provider
    db.notifications.push({
      id: db.notifications.length + 1,
      userId: String(body.providerId || "demo-provider-1"),
      title: "New Patient Enrolled",
      icon: "CheckCircle2",
      message: `${body.name} has been enrolled successfully.`,
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      time: "Just now",
    });

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

  // Clear notifications for user
  http.delete(`${API_URL}/notifications`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (userId) {
      db.notifications = db.notifications.filter((n: any) => n.userId !== userId);
    }
    return HttpResponse.json({ success: true });
  }),

  // Pause a bill
  http.post(`${API_URL}/bills/:id/pause`, async ({ params, request }) => {
    const body = await request.json() as any;
    const bill = db.bills.find(b => b.id === Number(params.id));
    if (!bill) return new HttpResponse(null, { status: 404 });
    bill.status = "Paused";
    bill.statusColor = "text-orange-warning";
    bill.pauseDays = body.days || 30;
    bill.pausedAt = new Date().toISOString();

    // Add notification
    db.notifications.push({
      id: db.notifications.length + 1,
      userId: bill.patientId,
      title: "Payment Paused",
      icon: "AlertCircle",
      message: `Your payment plan for ${bill.hospital} has been paused for ${body.days || 30} days.`,
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      time: "Just now",
    });

    // Add activity
    db.activities.push({
      id: db.activities.length + 1,
      userId: bill.patientId,
      desc: `Payment paused for ${body.days || 30} days`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: null,
      color: "text-orange-warning",
    });

    return HttpResponse.json(bill);
  }),

  // Resume (undo pause) a bill
  http.post(`${API_URL}/bills/:id/resume`, async ({ params }) => {
    const bill = db.bills.find(b => b.id === Number(params.id));
    if (!bill) return new HttpResponse(null, { status: 404 });
    bill.status = bill.activePlan ? "Plan Active" : "Unpaid";
    bill.statusColor = bill.activePlan ? "text-primary" : "text-destructive";
    delete bill.pauseDays;
    delete bill.pausedAt;
    return HttpResponse.json(bill);
  }),

  // Adjust a bill's plan
  http.post(`${API_URL}/bills/:id/adjust`, async ({ params, request }) => {
    const body = await request.json() as any;
    const bill = db.bills.find(b => b.id === Number(params.id));
    if (!bill) return new HttpResponse(null, { status: 404 });
    const newMonths = body.months;
    const newMonthly = Math.round(bill.amount / newMonths);
    bill.activePlan = { months: newMonths, monthly: newMonthly };
    bill.status = "Plan Active";
    bill.statusColor = "text-primary";
    bill.action = "manage";

    // Update payment plan
    const existingPlan = db.paymentPlans.find(p => p.billId === bill.id);
    if (existingPlan) {
      existingPlan.installments = newMonths;
    }

    // Add notification
    db.notifications.push({
      id: db.notifications.length + 1,
      userId: bill.patientId,
      title: "Payment Plan Adjusted",
      icon: "CheckCircle2",
      message: `Your plan for ${bill.hospital} has been adjusted to ${newMonths} months at ₦${newMonthly.toLocaleString("en-NG")}/month.`,
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      time: "Just now",
    });

    db.activities.push({
      id: db.activities.length + 1,
      userId: bill.patientId,
      desc: `Plan adjusted to ${newMonths} months`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: null,
      color: "text-primary",
    });

    return HttpResponse.json(bill);
  }),

  // Create a payment (records transaction + updates bill)
  http.post(`${API_URL}/payments`, async ({ request }) => {
    const body = await request.json() as any;
    const payment = {
      id: db.payments.length + 1,
      planId: body.planId || null,
      billId: body.billId || null,
      amount: Number(body.amount),
      paidAt: new Date().toISOString(),
      status: "completed",
    };
    db.payments.push(payment);

    // Record transaction
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    db.transactions.push({
      id: db.transactions.length + 1,
      userId: body.userId,
      amount: Number(body.amount),
      type: "debit",
      description: body.description || "Payment",
      status: "completed",
      createdAt: new Date().toISOString().split("T")[0],
      date: dateStr,
    });

    // Add notification
    db.notifications.push({
      id: db.notifications.length + 1,
      userId: body.userId,
      title: "Payment Successful",
      icon: "CheckCircle2",
      message: `We received your payment of ₦${Number(body.amount).toLocaleString("en-NG")}. Thank you!`,
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      time: "Just now",
    });

    // Add activity
    db.activities.push({
      id: db.activities.length + 1,
      userId: body.userId,
      desc: "Payment received",
      date: dateStr,
      amount: Number(body.amount),
      color: "text-green-success",
    });

    return HttpResponse.json(payment, { status: 201 });
  }),

  // Activate a payment plan for a bill (from PaymentPlans page step completion)
  http.post(`${API_URL}/bills/:id/activate-plan`, async ({ params, request }) => {
    const body = await request.json() as any;
    const bill = db.bills.find(b => b.id === Number(params.id));
    if (!bill) return new HttpResponse(null, { status: 404 });
    const months = body.months;
    const monthly = Math.round(bill.amount / months);
    bill.activePlan = { months, monthly };
    bill.status = "Plan Active";
    bill.statusColor = "text-primary";
    bill.action = "manage";

    // Create or update payment plan record
    const existingPlan = db.paymentPlans.find(p => p.billId === bill.id);
    if (existingPlan) {
      existingPlan.installments = months;
      existingPlan.totalAmount = bill.amount;
    } else {
      db.paymentPlans.push({
        id: db.paymentPlans.length + 1,
        billId: bill.id,
        patientId: bill.patientId,
        providerId: bill.providerId,
        totalAmount: bill.amount,
        installments: months,
        frequency: "monthly",
        startDate: new Date().toISOString().split("T")[0],
        status: "active",
      });
    }

    // Notification
    db.notifications.push({
      id: db.notifications.length + 1,
      userId: bill.patientId,
      title: "Payment Plan Activated",
      icon: "CheckCircle2",
      message: `Your ${months}-month plan for ${bill.hospital} is now active. Monthly payment: ₦${monthly.toLocaleString("en-NG")}.`,
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      time: "Just now",
    });

    db.activities.push({
      id: db.activities.length + 1,
      userId: bill.patientId,
      desc: `${months}-month payment plan activated`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: null,
      color: "text-primary",
    });

    return HttpResponse.json(bill);
  }),
];
