// In-browser auth store — no network required. Works in all environments (dev, prod, offline).
const USERS_KEY = "caresplit_auth_users";

export interface StoredUser {
  _id: string;
  patientId?: string;
  name: string;
  email: string;
  phone?: string;
  role: "patient" | "provider";
  hospital?: string;
  address?: string;
  passwordHash: string;
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash — not cryptographic, just prevents plaintext storage
function hashPassword(pw: string): string {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return String(h);
}

export const authStore = {
  register(params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: "patient" | "provider";
    hospital?: string;
    address?: string;
  }): { ok: true; user: Omit<StoredUser, "passwordHash"> } | { ok: false; error: string } {
    const users = getUsers();
    const email = params.email.trim().toLowerCase();
    if (users.find((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const _id = `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const patientId = params.role === "patient" ? `PAT-${10000 + users.length + 1}` : undefined;
    const newUser: StoredUser = {
      _id,
      patientId,
      name: params.name.trim(),
      email,
      phone: params.phone || "",
      role: params.role,
      hospital: params.hospital,
      address: params.address,
      passwordHash: hashPassword(params.password),
    };
    users.push(newUser);
    saveUsers(users);
    const { passwordHash: _, ...user } = newUser;
    return { ok: true, user };
  },

  login(
    email: string,
    password: string
  ): { ok: true; user: Omit<StoredUser, "passwordHash"> } | { ok: false; error: string } {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { ok: false, error: "No account found with this email." };
    }
    if (found.passwordHash !== hashPassword(password)) {
      return { ok: false, error: "Incorrect password." };
    }
    const { passwordHash: _, ...user } = found;
    return { ok: true, user };
  },
};
