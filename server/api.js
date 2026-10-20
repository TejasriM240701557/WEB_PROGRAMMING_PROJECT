import crypto from 'node:crypto';

// Predefined Single Company Identity — Apex Technologies Pvt Ltd
export const SINGLE_COMPANY = {
  id: 'apex-technologies-corp',
  name: 'Apex Technologies Pvt Ltd',
  legalName: 'Apex Technologies Private Limited',
  cin: 'U72900KA2021PTC148901',
  gstin: '29AABCA1234F1Z5',
  pan: 'AABCA1234F',
  industry: 'Enterprise B2B Fintech & Cloud Infrastructure',
  currency: 'INR',
  currencySymbol: '₹',
  fiscalYear: '2025-2026',
  incorporatedDate: '2021-08-15',
  registeredAddress: 'Level 14, Prestige Tech Park, Marathahalli-Sarjapur Outer Ring Road, Bengaluru, Karnataka 560103, India',
  reportingTier: 'Corporate Enterprise Core',
  minimumReservePolicy: 4500000, // ₹45.0 Lakhs
  minimumReserveMonths: 3.5,
};

// Cryptographic Password Hashing Helpers
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyPassword(inputPassword, salt, expectedHash) {
  try {
    const hash = hashPassword(inputPassword, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

// Role Permissions Matrix
export const ROLE_PERMISSIONS = {
  admin: {
    roleName: 'Administrator',
    description: 'Full administrative access: user management, security audit logs, governance, and financial operations',
    canViewDashboard: true,
    canManageTransactions: true,
    canManageBudgets: true,
    canManageInvestments: true,
    canViewFinancialReports: true,
    canManagePayroll: true,
    canViewSensitiveSalaries: true,
    canManageForecasts: true,
    canUseAIAdvisor: true,
    canManageUsers: true,
    canViewAuditLogs: true,
    canModifyCompanySettings: true,
    isReadOnly: false,
  },
  finance_manager: {
    roleName: 'Finance Manager',
    description: 'Manages transactions, budgets, investments, P&L reports, and cash forecasts. Individual employee compensation records are restricted.',
    canViewDashboard: true,
    canManageTransactions: true,
    canManageBudgets: true,
    canManageInvestments: true,
    canViewFinancialReports: true,
    canManagePayroll: false,
    canViewSensitiveSalaries: false, // RESTRICTED: individual salaries are hidden/locked
    canManageForecasts: true,
    canUseAIAdvisor: true,
    canManageUsers: false,
    canViewAuditLogs: true,
    canModifyCompanySettings: false,
    isReadOnly: false,
  },
  hr_payroll_manager: {
    roleName: 'HR / Payroll Manager',
    description: 'Authoritative access to employee compensation roster, salary structures, overheads, and the hiring affordability simulator.',
    canViewDashboard: true,
    canManageTransactions: false,
    canManageBudgets: false,
    canManageInvestments: false,
    canViewFinancialReports: false,
    canManagePayroll: true,
    canViewSensitiveSalaries: true,
    canManageForecasts: false,
    canUseAIAdvisor: true,
    canManageUsers: false,
    canViewAuditLogs: false,
    canModifyCompanySettings: false,
    isReadOnly: false,
  },
  executive_viewer: {
    roleName: 'Executive / Board Viewer',
    description: 'Read-only access to authorized executive dashboards, high-level P&L statements, and forecasts without mutation privileges.',
    canViewDashboard: true,
    canManageTransactions: false,
    canManageBudgets: false,
    canManageInvestments: false,
    canViewFinancialReports: true,
    canManagePayroll: false,
    canViewSensitiveSalaries: false,
    canManageForecasts: true,
    canUseAIAdvisor: true,
    canManageUsers: false,
    canViewAuditLogs: false,
    canModifyCompanySettings: false,
    isReadOnly: true,
  },
};

// Seed Authorized Company Users
const SEED_USERS = [
  {
    id: 'usr-admin-1',
    name: 'partner',
    email: 'partner@apextech.in',
    role: 'admin',
    designation: 'Chief Financial Officer & Managing Partner',
    department: 'Executive Finance',
    avatar: 'PA',
    salt: 'c4e3b7a1f8d2e9c0b1a4d6f8e2c5b7a9',
    passwordHash: '', // computed below
    status: 'Active',
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'usr-fin-2',
    name: 'Kavita Nair',
    email: 'kavita.nair@apextech.in',
    role: 'finance_manager',
    designation: 'Finance Controller & Legal Lead',
    department: 'Finance & Legal',
    avatar: 'KN',
    salt: 'd8e2a1b9c7f4e0b3a6d9c2e5f1b8a4c7',
    passwordHash: '',
    status: 'Active',
    lastLogin: new Date(Date.now() - 14400000).toISOString(),
    createdAt: '2024-02-01T10:30:00Z',
  },
  {
    id: 'usr-hr-3',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@apextech.in',
    role: 'hr_payroll_manager',
    designation: 'Corporate Talent & People Operations Lead',
    department: 'HR & People',
    avatar: 'VJ',
    salt: 'e9c0b1a4d6f8e2c5b7a9c4e3b7a1f8d2',
    passwordHash: '',
    status: 'Active',
    lastLogin: new Date(Date.now() - 28800000).toISOString(),
    createdAt: '2024-02-15T11:00:00Z',
  },
  {
    id: 'usr-view-4',
    name: 'Aditya Singhania',
    email: 'board.viewer@apextech.in',
    role: 'executive_viewer',
    designation: 'Non-Executive Board Director',
    department: 'Board of Directors',
    avatar: 'AS',
    salt: 'b7a9c4e3b7a1f8d2e9c0b1a4d6f8e2c5',
    passwordHash: '',
    status: 'Active',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: '2024-03-01T14:00:00Z',
  },
];

// Initialize password hashes for seed users
// Default passwords:
// partner@apextech.in      -> Finora@2026
// kavita.nair@apextech.in   -> Finance@2026
// vikram.joshi@apextech.in   -> Payroll@2026
// board.viewer@apextech.in  -> Viewer@2026
SEED_USERS[0].passwordHash = hashPassword('Finora@2026', SEED_USERS[0].salt);
SEED_USERS[1].passwordHash = hashPassword('Finance@2026', SEED_USERS[1].salt);
SEED_USERS[2].passwordHash = hashPassword('Payroll@2026', SEED_USERS[2].salt);
SEED_USERS[3].passwordHash = hashPassword('Viewer@2026', SEED_USERS[3].salt);

// In-Memory Database Stores (Scoped to Apex Technologies Pvt Ltd)
let companyUsers = [...SEED_USERS];
let activeSessions = new Map(); // token -> { user, expiresAt }
let auditLogs = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userEmail: 'partner@apextech.in',
    userName: 'partner',
    userRole: 'Administrator',
    action: 'SESSION_AUTHENTICATED',
    details: 'Successful corporate identity verification via password challenge',
    ipAddress: '10.243.226.182',
    status: 'SUCCESS',
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userEmail: 'kavita.nair@apextech.in',
    userName: 'Kavita Nair',
    userRole: 'Finance Manager',
    action: 'LEDGER_TRANSACTION_AUDIT',
    details: 'Audited monthly vendor settlement for Stripe Cloud Ingress',
    ipAddress: '10.243.226.184',
    status: 'SUCCESS',
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    userEmail: 'vikram.joshi@apextech.in',
    userName: 'Vikram Joshi',
    userRole: 'HR / Payroll Manager',
    action: 'PAYROLL_DISBURSEMENT_SCHEDULE',
    details: 'Authorized scheduled monthly payroll batch totaling ₹24.5 Lakhs',
    ipAddress: '10.243.226.190',
    status: 'SUCCESS',
  },
  {
    id: 'audit-004',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    userEmail: 'partner@apextech.in',
    userName: 'partner',
    userRole: 'Administrator',
    action: 'POLICY_THRESHOLD_UPDATE',
    details: 'Configured minimum statutory liquid cash reserve floor to ₹45.0 Lakhs',
    ipAddress: '10.243.226.182',
    status: 'SUCCESS',
  },
];

// Helper: record an audit log entry
export function recordAuditLog(user, action, details, status = 'SUCCESS', ip = '127.0.0.1') {
  const entry = {
    id: 'audit-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    userEmail: user?.email || 'unauthenticated',
    userName: user?.name || 'System / Anonymous',
    userRole: user?.role ? (ROLE_PERMISSIONS[user.role]?.roleName || user.role) : 'Public',
    action,
    details,
    ipAddress: ip,
    status,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 200) auditLogs.pop(); // keep last 200 entries
  return entry;
}

// Helper: parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.end(JSON.stringify(data));
}

// Helper: sanitize user object (never return passwordHash or salt)
function sanitizeUser(user) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

// Helper: authenticate bearer token
function authenticateRequest(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);
  if (!session) return null;

  // Check expiration (8 hours)
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return { token, user: session.user };
}

// Master API Request Handler
export async function handleApiRequest(req, res) {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.end();
    return;
  }

  // --- 1. AUTH: LOGIN (POST /api/auth/login) ---
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { email, password } = await parseJsonBody(req);

    if (!email || !password) {
      recordAuditLog({ email }, 'LOGIN_FAILED', 'Missing email or password credentials', 'FAILED', clientIp);
      return sendJson(res, 401, {
        error: 'Invalid work email or password. Please verify credentials with your IT administrator.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = companyUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user || user.status !== 'Active') {
      recordAuditLog({ email: cleanEmail }, 'LOGIN_FAILED', 'User does not exist or account is inactive', 'FAILED', clientIp);
      return sendJson(res, 401, {
        error: 'Invalid work email or password. Please verify credentials with your IT administrator.',
      });
    }

    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      recordAuditLog(user, 'LOGIN_FAILED', 'Password hash mismatch', 'FAILED', clientIp);
      return sendJson(res, 401, {
        error: 'Invalid work email or password. Please verify credentials with your IT administrator.',
      });
    }

    // Generate secure session token
    const token = 'finora_sec_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 8 * 3600 * 1000; // 8 hours
    user.lastLogin = new Date().toISOString();

    activeSessions.set(token, { user, expiresAt });
    recordAuditLog(user, 'LOGIN_SUCCESS', 'Authenticated successfully with corporate password', 'SUCCESS', clientIp);

    return sendJson(res, 200, {
      token,
      user: sanitizeUser(user),
      company: SINGLE_COMPANY,
      permissions: ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.executive_viewer,
    });
  }

  // --- 2. AUTH: CURRENT USER & SESSION (GET /api/auth/me) ---
  if (pathname === '/api/auth/me' && method === 'GET') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Session expired or unauthenticated. Please sign in.' });
    }

    return sendJson(res, 200, {
      user: sanitizeUser(auth.user),
      company: SINGLE_COMPANY,
      permissions: ROLE_PERMISSIONS[auth.user.role] || ROLE_PERMISSIONS.executive_viewer,
    });
  }

  // --- 3. AUTH: LOGOUT (POST /api/auth/logout) ---
  if (pathname === '/api/auth/logout' && method === 'POST') {
    const auth = authenticateRequest(req);
    if (auth) {
      activeSessions.delete(auth.token);
      recordAuditLog(auth.user, 'LOGOUT_SUCCESS', 'Explicit user sign-out and session invalidation', 'SUCCESS', clientIp);
    }
    return sendJson(res, 200, { message: 'Successfully logged out.' });
  }

  // --- 4. AUTH: FORGOT PASSWORD (POST /api/auth/forgot-password) ---
  if (pathname === '/api/auth/forgot-password' && method === 'POST') {
    const { email } = await parseJsonBody(req);
    recordAuditLog({ email }, 'PASSWORD_RESET_REQUEST', `Reset challenge requested for ${email}`, 'SUCCESS', clientIp);
    return sendJson(res, 200, {
      message: 'If this corporate email is registered with Apex Technologies, a password reset link has been dispatched to your corporate inbox.',
    });
  }

  // --- 5. COMPANY PROFILE (GET /api/company) ---
  if (pathname === '/api/company' && method === 'GET') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required to access company data.' });
    }
    return sendJson(res, 200, { company: SINGLE_COMPANY });
  }

  // --- 6. AUDIT LOGS (GET /api/audit-logs) ---
  if (pathname === '/api/audit-logs' && method === 'GET') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required.' });
    }

    const perms = ROLE_PERMISSIONS[auth.user.role];
    if (!perms || !perms.canViewAuditLogs) {
      recordAuditLog(auth.user, 'UNAUTHORIZED_ACCESS_ATTEMPT', 'Attempted to view audit logs without permission', 'DENIED', clientIp);
      return sendJson(res, 403, { error: 'Forbidden. You do not have permission to view corporate audit logs.' });
    }

    return sendJson(res, 200, { auditLogs });
  }

  // --- 7. USER MANAGEMENT (GET, POST /api/users) ---
  if (pathname === '/api/users' && method === 'GET') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required.' });
    }

    const perms = ROLE_PERMISSIONS[auth.user.role];
    if (!perms || !perms.canManageUsers) {
      return sendJson(res, 403, { error: 'Forbidden. Only Company Administrators can manage users.' });
    }

    return sendJson(res, 200, { users: companyUsers.map(sanitizeUser) });
  }

  if (pathname === '/api/users' && method === 'POST') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required.' });
    }

    const perms = ROLE_PERMISSIONS[auth.user.role];
    if (!perms || !perms.canManageUsers) {
      return sendJson(res, 403, { error: 'Forbidden. Only Company Administrators can add users.' });
    }

    const { name, email, role, designation, department } = await parseJsonBody(req);
    if (!name || !email || !role) {
      return sendJson(res, 400, { error: 'Name, corporate email, and role are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (companyUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return sendJson(res, 400, { error: 'User with this corporate email already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const defaultPassword = 'Apex@' + new Date().getFullYear();
    const newUser = {
      id: 'usr-' + Date.now().toString(36),
      name: name.trim(),
      email: cleanEmail,
      role: role in ROLE_PERMISSIONS ? role : 'executive_viewer',
      designation: designation || 'Corporate Associate',
      department: department || 'Finance & Operations',
      avatar: name.trim().slice(0, 2).toUpperCase(),
      salt,
      passwordHash: hashPassword(defaultPassword, salt),
      status: 'Active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };

    companyUsers.push(newUser);
    recordAuditLog(auth.user, 'USER_INVITED', `Created account for ${newUser.name} (${newUser.email}) with role ${newUser.role}`, 'SUCCESS', clientIp);

    return sendJson(res, 201, {
      user: sanitizeUser(newUser),
      temporaryPassword: defaultPassword,
    });
  }

  // --- 8. PAYROLL PERMISSION CHECK (GET /api/payroll/permissions-check) ---
  if (pathname === '/api/payroll/permissions-check' && method === 'GET') {
    const auth = authenticateRequest(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required.' });
    }

    const perms = ROLE_PERMISSIONS[auth.user.role];
    const allowed = Boolean(perms?.canViewSensitiveSalaries);

    if (!allowed) {
      recordAuditLog(auth.user, 'PAYROLL_ACCESS_BLOCKED', 'Attempted to inspect individual compensation roster without HR/Admin role', 'DENIED', clientIp);
    }

    return sendJson(res, 200, {
      allowed,
      role: auth.user.role,
      roleName: perms?.roleName || auth.user.role,
      message: allowed
        ? 'Access granted to compensation records.'
        : 'Access restricted: Individual employee compensation records are restricted to HR/Payroll Managers and Administrators.',
    });
  }

  // --- 9. RECORD AUDIT LOG FROM FRONTEND (POST /api/audit-logs) ---
  if (pathname === '/api/audit-logs' && method === 'POST') {
    const auth = authenticateRequest(req);
    const { action, details } = await parseJsonBody(req);
    const entry = recordAuditLog(auth?.user, action || 'GENERAL_ACTIVITY', details || '', 'SUCCESS', clientIp);
    return sendJson(res, 201, { auditLog: entry });
  }

  // Not Found
  return sendJson(res, 404, { error: `Endpoint ${method} ${pathname} not found.` });
}
