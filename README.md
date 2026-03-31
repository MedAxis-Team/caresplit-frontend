## Sample API Endpoints

Below are example RESTful API endpoints for integrating the CareSplit frontend with your backend. These endpoints follow standard REST conventions and are mapped to the data schema above.

### Authentication
```
POST   /api/auth/signup         // Register new patient or provider
POST   /api/auth/login         // Login and receive JWT/token
POST   /api/auth/logout        // Logout (optional, for token invalidation)
GET    /api/auth/me            // Get current user profile
```

### Patients
```
GET    /api/patients/:id               // Get patient profile (with bills, plans, notifications, etc.)
PATCH  /api/patients/:id               // Update patient profile
GET    /api/patients/:id/bills         // List all bills for patient
GET    /api/patients/:id/payment-plans // List all payment plans for patient
GET    /api/patients/:id/transactions  // List all transactions for patient
GET    /api/patients/:id/notifications // List all notifications for patient
GET    /api/patients/:id/activities    // List all activities for patient
```

### Providers (Hospitals)
```
GET    /api/providers/:id              // Get provider profile (with patients, bills, etc.)
PATCH  /api/providers/:id              // Update provider profile
GET    /api/providers/:id/patients     // List all patients for provider
GET    /api/providers/:id/bills        // List all bills issued by provider
GET    /api/providers/:id/notifications// List all notifications for provider
GET    /api/providers/:id/activities   // List all activities for provider
```

### Bills
```
POST   /api/bills                      // Provider creates a new bill for a patient
GET    /api/bills/:id                  // Get bill details
PATCH  /api/bills/:id                  // Update bill (e.g., mark as paid)
DELETE /api/bills/:id                  // Delete bill (admin/provider only)
```

### Payment Plans
```
POST   /api/payment-plans              // Patient creates a payment plan for a bill
GET    /api/payment-plans/:id          // Get payment plan details
PATCH  /api/payment-plans/:id          // Update payment plan (e.g., mark as completed)
```

### Payments
```
POST   /api/payments                   // Patient makes a payment (for bill or plan)
GET    /api/payments/:id               // Get payment details
```

### Notifications
```
GET    /api/notifications?userId=...   // List notifications for user
PATCH  /api/notifications/:id          // Mark notification as read
```

### Activities
```
GET    /api/activities?userId=...      // List activities for user
```

### Transactions
```
GET    /api/transactions?patientId=... // List transactions for patient
GET    /api/transactions?providerId=.. // List transactions for provider
```

---

## Backend Integration Guidance

- Use JWT or session tokens for authentication; include user role in the token payload.
- All endpoints should validate user permissions (e.g., only providers can create bills, only patients can create payment plans/payments).
- Use pagination for lists (bills, notifications, activities, transactions) if data grows large.
- Return empty arrays for empty states (e.g., no bills, no notifications).
- Use webhooks, websockets, or polling for real-time updates if possible (e.g., notifications, payment status).
- All date fields should be ISO 8601 strings (e.g., 2026-03-30T12:00:00Z).
- Use consistent error responses (e.g., { error: string, details?: any }).
- For extensibility, allow custom notification/activity types and payment methods.
- Document all endpoints with OpenAPI/Swagger if possible for easy frontend-backend collaboration.

If you need more detailed endpoint specs, request/response samples, or OpenAPI documentation, let your backend developer know!
# CareSplit Data Schema & API Documentation

## Overview
This document describes the full data schema for both Patient and Provider (Hospital) workflows in the CareSplit app. It is designed for backend API integration and covers all major entities, relationships, and expected behaviors.

---

## User Model
```typescript
export interface User {
	id: string;
	email: string;
	name: string;
	role: 'patient' | 'provider';
	createdAt: string; // ISO date
	updatedAt: string; // ISO date
}
```

## Patient Model
```typescript
export interface Patient extends User {
	role: 'patient';
	phone?: string;
	providerId?: string;
	bills: Bill[];
	notifications: Notification[];
	activities: Activity[];
	paymentPlans: PaymentPlan[];
	transactions: Transaction[];
}
```

## Provider (Hospital) Model
```typescript
export interface Provider extends User {
	role: 'provider';
	organizationName?: string;
	patients: PatientSummary[];
	bills: Bill[];
	notifications: Notification[];
	activities: Activity[];
}
```

## PatientSummary (for Provider Dashboard)
```typescript
export interface PatientSummary {
	id: string;
	name: string;
	email: string;
	outstandingBalance: number;
	nextDueDate?: string;
}
```

## Bill
```typescript
export interface Bill {
	id: string;
	patientId: string;
	providerId: string;
	amount: number;
	description: string;
	issuedAt: string;
	dueDate: string;
	status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
	paymentPlanId?: string;
	payments: Payment[];
	activities: Activity[];
}
```

## PaymentPlan
```typescript
export interface PaymentPlan {
	id: string;
	billId: string;
	patientId: string;
	providerId: string;
	termMonths: 3 | 6 | 12;
	startDate: string;
	endDate: string;
	monthlyAmount: number;
	totalAmount: number;
	status: 'active' | 'completed' | 'defaulted' | 'cancelled';
	payments: Payment[];
	nextDueDate: string;
	remainingBalance: number;
}
```

## Payment
```typescript
export interface Payment {
	id: string;
	billId: string;
	paymentPlanId?: string;
	patientId: string;
	providerId: string;
	amount: number;
	paidAt: string;
	method: 'card' | 'bank_transfer' | 'cash' | 'other';
	status: 'pending' | 'completed' | 'failed';
	transactionId?: string;
}
```

## Notification
```typescript
export interface Notification {
	id: string;
	userId: string;
	type: 'bill_created' | 'payment_due' | 'payment_received' | 'plan_created' | 'plan_completed' | 'bill_overdue' | 'general';
	message: string;
	createdAt: string;
	read: boolean;
	relatedBillId?: string;
	relatedPaymentId?: string;
}
```

## Activity
```typescript
export interface Activity {
	id: string;
	userId: string;
	action: 'login' | 'logout' | 'bill_viewed' | 'bill_paid' | 'payment_plan_created' | 'payment_made' | 'profile_updated' | 'notification_read' | 'bill_added' | 'other';
	description: string;
	createdAt: string;
	relatedBillId?: string;
	relatedPaymentId?: string;
}
```

## Transaction
```typescript
export interface Transaction {
	id: string;
	patientId: string;
	providerId: string;
	paymentId: string;
	amount: number;
	date: string;
	status: 'completed' | 'pending' | 'failed';
	method: 'card' | 'bank_transfer' | 'cash' | 'other';
	description?: string;
}
```

---

## Notes for Backend Developer
- All date fields are ISO strings (e.g., 2026-03-30T12:00:00Z).
- All IDs are unique strings (UUID or database-generated).
- Relationships are explicit (e.g., patientId, providerId, billId, etc.).
- Use empty arrays for empty states (e.g., no bills, no notifications).
- Notification and activity types can be extended as needed.
- All fields are required unless marked optional (?).

This schema supports all real-time updates, empty states, and synchronization required for the CareSplit app. If you need further details or sample API endpoints, please request them.
# Welcome to your caresplit project

TODO: Document your project here
