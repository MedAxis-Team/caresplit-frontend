export type Bill = {
  id: string;
  hospital: string;
  type?: string;
  amount: number;
  ref?: string;
  date?: string;
  status?: string;
  charges?: { name: string; amount: number }[];
};

export type Transaction = {
  id: string;
  desc: string;
  date: string;
  amount: number;
  status: "Success" | "Failed";
};

export type Activity = { id: string; desc: string; date: string };

export type Notification = { id: string; title: string; desc: string; time: string; read?: boolean };

function key(userId: string, name: string) {
  return `caresplit_${userId}_${name}`;
}

export const localStore = {
  getBills(userId: string): Bill[] {
    const raw = localStorage.getItem(key(userId, "bills"));
    return raw ? JSON.parse(raw) : [];
  },

  saveBills(userId: string, bills: Bill[]) {
    localStorage.setItem(key(userId, "bills"), JSON.stringify(bills));
  },

  addBill(userId: string, b: Bill) {
    const bills = localStore.getBills(userId);
    bills.unshift(b);
    localStore.saveBills(userId, bills);
    try { window.dispatchEvent(new CustomEvent('caresplit:update', { detail: { userId, type: 'bills' } })); } catch(e){}
  },

  setCurrentBill(userId: string, billId: string) {
    localStorage.setItem(key(userId, "current_bill"), billId);
  },

  getCurrentBillId(userId: string) {
    return localStorage.getItem(key(userId, "current_bill"));
  },

  getTransactions(userId: string): Transaction[] {
    const raw = localStorage.getItem(key(userId, "transactions"));
    return raw ? JSON.parse(raw) : [];
  },

  addTransaction(userId: string, tx: Transaction) {
    const txs = localStore.getTransactions(userId);
    txs.unshift(tx);
    localStorage.setItem(key(userId, "transactions"), JSON.stringify(txs));
    try { window.dispatchEvent(new CustomEvent('caresplit:update', { detail: { userId, type: 'transactions' } })); } catch(e){}
  },

  getActivities(userId: string): Activity[] {
    const raw = localStorage.getItem(key(userId, "activities"));
    return raw ? JSON.parse(raw) : [];
  },

  addActivity(userId: string, a: Activity) {
    const acts = localStore.getActivities(userId);
    acts.unshift(a);
    localStorage.setItem(key(userId, "activities"), JSON.stringify(acts));
    try { window.dispatchEvent(new CustomEvent('caresplit:update', { detail: { userId, type: 'activities' } })); } catch(e){}
  },

  getNotifications(userId: string): Notification[] {
    const raw = localStorage.getItem(key(userId, "notifications"));
    return raw ? JSON.parse(raw) : [];
  },

  addNotification(userId: string, n: Notification) {
    const notes = localStore.getNotifications(userId);
    notes.unshift(n);
    localStorage.setItem(key(userId, "notifications"), JSON.stringify(notes));
    try { window.dispatchEvent(new CustomEvent('caresplit:update', { detail: { userId, type: 'notifications' } })); } catch(e){}
  },

  markAllNotificationsRead(userId: string) {
    const notes = localStore.getNotifications(userId).map((n: Notification) => ({ ...n, read: true }));
    localStorage.setItem(key(userId, "notifications"), JSON.stringify(notes));
    try { window.dispatchEvent(new CustomEvent('caresplit:update', { detail: { userId, type: 'notifications' } })); } catch(e){}
  },
};

export default localStore;
