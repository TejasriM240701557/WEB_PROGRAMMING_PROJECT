import { COMPANIES } from '../utils/constants';
export { COMPANIES };

// Helper for dynamic relative dates
const getRelativeDate = (daysAgo, hoursAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const INITIAL_TRANSACTIONS = [
  // --- REVENUE INFLOWS (Current Month) ---
  {
    id: 'tx-rev-1',
    companyId: 'comp-1',
    type: 'revenue',
    title: 'FinTech Titan - Annual Enterprise SaaS Platform License',
    amount: 3250000, // ₹32.5 Lakhs
    category: 'enterprise_license',
    department: 'sales_marketing',
    date: getRelativeDate(3, 2),
    account: 'acc-hdfc',
    counterparty: 'Bharat FinServe Ltd',
    notes: 'Tier-1 Core Banking Engine Integration - Annual SLA Milestone',
    tags: ['Enterprise', 'Contractual', 'ARR'],
    status: 'completed'
  },
  {
    id: 'tx-rev-2',
    companyId: 'comp-1',
    type: 'revenue',
    title: 'Cloud MRR Subscriptions - Global Stripe Settlement',
    amount: 1820000, // ₹18.2 Lakhs
    category: 'saas_subscription',
    department: 'sales_marketing',
    date: getRelativeDate(7, 5),
    account: 'acc-stripe',
    counterparty: 'Stripe Global Merchant Services',
    notes: 'Recurring SaaS tier collections across 185 B2B clients',
    tags: ['Recurring', 'MRR', 'AutoRenew'],
    status: 'completed'
  },
  {
    id: 'tx-rev-3',
    companyId: 'comp-1',
    type: 'revenue',
    title: 'AI Microservices & Metered API Gateway Consumption',
    amount: 840000, // ₹8.4 Lakhs
    category: 'api_usage',
    department: 'engineering',
    date: getRelativeDate(11, 4),
    account: 'acc-razorpay',
    counterparty: 'HyperScale Logistics Group',
    notes: 'Over-quota inference requests billing cycle #28',
    tags: ['Metered', 'API', 'Consumption'],
    status: 'completed'
  },
  {
    id: 'tx-rev-4',
    companyId: 'comp-1',
    type: 'revenue',
    title: 'Implementation & Solution Architecture Retainer',
    amount: 650000, // ₹6.5 Lakhs
    category: 'professional_services',
    department: 'operations',
    date: getRelativeDate(18, 1),
    account: 'acc-hdfc',
    counterparty: 'Nexus Capital Partners',
    notes: 'Custom security compliance deployment sprint',
    tags: ['Services', 'OneOff'],
    status: 'completed'
  },

  // --- OPERATING EXPENSES (Current Month) ---
  {
    id: 'tx-exp-1',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'AWS Mumbai & Singapore GPU Cloud Compute Infrastructure',
    amount: 485000, // ₹4.85 Lakhs
    category: 'cloud_infrastructure',
    department: 'engineering',
    date: getRelativeDate(2, 6),
    account: 'acc-hdfc',
    counterparty: 'Amazon Web Services India',
    notes: 'Elastic Kubernetes cluster & dedicated H100 inference instances',
    tags: ['Infrastructure', 'Cloud', 'Essential'],
    status: 'completed'
  },
  {
    id: 'tx-exp-2',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Corporate HQ WeWork CyberHub Facilities & Utilities',
    amount: 320000, // ₹3.2 Lakhs
    category: 'office_rent',
    department: 'operations',
    date: getRelativeDate(4, 3),
    account: 'acc-hdfc',
    counterparty: 'WeWork India Management',
    notes: 'Dedicated 45-desk tech wing monthly lease and utilities',
    tags: ['Facilities', 'FixedCost'],
    status: 'completed'
  },
  {
    id: 'tx-exp-3',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Google & LinkedIn Paid Enterprise Performance Marketing',
    amount: 410000, // ₹4.1 Lakhs
    category: 'marketing_acquisition',
    department: 'sales_marketing',
    date: getRelativeDate(8, 7),
    account: 'acc-hdfc',
    counterparty: 'Google Ads & LinkedIn Corporate',
    notes: 'B2B FinTech lead acquisition & retargeting campaign',
    tags: ['Marketing', 'Discretionary', 'CAC'],
    status: 'completed'
  },
  {
    id: 'tx-exp-4',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Enterprise Software Tooling (Datadog, GitHub, Slack, Linear)',
    amount: 195000, // ₹1.95 Lakhs
    category: 'software_tools',
    department: 'engineering',
    date: getRelativeDate(12, 5),
    account: 'acc-hdfc',
    counterparty: 'Enterprise Software Aggregator',
    notes: 'Developer toolchains and observability telemetry stack',
    tags: ['SaaS', 'DevOps'],
    status: 'completed'
  },
  {
    id: 'tx-exp-5',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Statutory Corporate Audit & Legal Governance Retainer',
    amount: 160000, // ₹1.6 Lakhs
    category: 'legal_compliance',
    department: 'finance_legal',
    date: getRelativeDate(16, 2),
    account: 'acc-hdfc',
    counterparty: 'Shardul Amarchand & Co',
    notes: 'Quarterly compliance filing and ISO 27001 audit support',
    tags: ['Compliance', 'Legal'],
    status: 'completed'
  },
  {
    id: 'tx-exp-6',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Executive Client Summit & Strategic Travel',
    amount: 125000, // ₹1.25 Lakhs
    category: 'travel_business',
    department: 'sales_marketing',
    date: getRelativeDate(20, 9),
    account: 'acc-hdfc',
    counterparty: 'Corporate Travel Management',
    notes: 'Executive keynote presentation at Mumbai FinTech Conclave',
    tags: ['Travel', 'Sales'],
    status: 'completed'
  },

  // --- PAYROLL EXPENSE (Monthly Consolidated) ---
  {
    id: 'tx-pay-1',
    companyId: 'comp-1',
    type: 'payroll_expense',
    title: 'Consolidated Monthly Corporate Payroll & Provident Fund',
    amount: 2450000, // ₹24.5 Lakhs
    category: 'salaries_wages',
    department: 'hr_payroll',
    date: getRelativeDate(5, 10),
    account: 'acc-hdfc',
    counterparty: 'Corporate Payroll Disbursal Node',
    notes: 'Disbursement across 22 engineering, product, sales, and operations personnel',
    tags: ['Payroll', 'Salaries', 'Statutory'],
    status: 'completed'
  },

  // --- TAX PAYMENTS ---
  {
    id: 'tx-tax-1',
    companyId: 'comp-1',
    type: 'tax_payment',
    title: 'Quarterly Advance Corporate Income Tax Remittance',
    amount: 450000, // ₹4.5 Lakhs
    category: 'tax_statutory',
    department: 'finance_legal',
    date: getRelativeDate(14, 2),
    account: 'acc-hdfc',
    counterparty: 'Income Tax Department (CBDT)',
    notes: 'Q3 Advance Corporate Tax installment Challan 280',
    tags: ['Statutory', 'Taxes'],
    status: 'completed'
  },

  // --- INVESTMENT ASSETS (Balance Sheet Capital Asset, NOT OPEX!) ---
  {
    id: 'tx-inv-1',
    companyId: 'comp-1',
    type: 'investment_purchase',
    title: 'Government of India 91-Day Treasury Bills (T-Bills) Tranche',
    amount: 1500000, // ₹15.0 Lakhs
    category: 'treasury_bonds',
    department: 'finance_legal',
    date: getRelativeDate(10, 4),
    account: 'acc-icici',
    counterparty: 'Reserve Bank of India (RBI NDS-OM)',
    notes: 'Short-term sovereign yield reserve placement @ 6.85% annualized',
    tags: ['Treasury', 'CapitalAsset', 'Sovereign'],
    status: 'completed'
  },

  // --- INVESTMENT YIELDS (Non-Operating Inflow) ---
  {
    id: 'tx-proc-1',
    companyId: 'comp-1',
    type: 'investment_proceeds',
    title: 'Overnight Liquid Debt Fund Dividend Reinvestment Yield',
    amount: 98000, // ₹98,000
    category: 'liquid_fund',
    department: 'finance_legal',
    date: getRelativeDate(6, 1),
    account: 'acc-icici',
    counterparty: 'ICICI Prudential Asset Management',
    notes: 'Monthly accrued cash distribution from liquidity reserves',
    tags: ['Yield', 'NonOperating'],
    status: 'completed'
  },

  // --- PREVIOUS MONTH DATA (For historical MoM analysis) ---
  {
    id: 'tx-prev-rev',
    companyId: 'comp-1',
    type: 'revenue',
    title: 'Previous Month Consolidated B2B SaaS Revenue',
    amount: 5850000, // ₹58.5 Lakhs
    category: 'enterprise_license',
    department: 'sales_marketing',
    date: getRelativeDate(35),
    account: 'acc-hdfc',
    counterparty: 'Consolidated Clients',
    notes: 'Prior monthly close aggregate',
    tags: ['Historical'],
    status: 'completed'
  },
  {
    id: 'tx-prev-exp',
    companyId: 'comp-1',
    type: 'operating_expense',
    title: 'Previous Month Consolidated Operating Expenses',
    amount: 1580000, // ₹15.8 Lakhs
    category: 'cloud_infrastructure',
    department: 'engineering',
    date: getRelativeDate(36),
    account: 'acc-hdfc',
    counterparty: 'Various Vendors',
    notes: 'Prior monthly opex close',
    tags: ['Historical'],
    status: 'completed'
  },
  {
    id: 'tx-prev-pay',
    companyId: 'comp-1',
    type: 'payroll_expense',
    title: 'Previous Month Payroll Disbursal',
    amount: 2320000, // ₹23.2 Lakhs
    category: 'salaries_wages',
    department: 'hr_payroll',
    date: getRelativeDate(37),
    account: 'acc-hdfc',
    counterparty: 'Employees',
    notes: 'Prior month salary disbursal',
    tags: ['Historical'],
    status: 'completed'
  },
];

export const INITIAL_INVESTMENTS = [
  {
    id: 'inv-1',
    companyId: 'comp-1',
    name: 'Government of India 91-Day Treasury Bills',
    category: 'Sovereign Debt',
    investedAmount: 4000000, // ₹40 Lakhs
    currentValue: 4240000,   // ₹42.4 Lakhs
    realizedReturns: 140000, // ₹1.4 Lakhs
    unrealizedGains: 240000, // ₹2.4 Lakhs
    yieldRate: 6.85,
    riskLevel: 'Ultra Low (AAA)',
    maturityDate: '2027-01-15',
    status: 'Active',
    allocationPercent: 44.5,
    notes: 'Backed directly by Sovereign Guarantee. Maximum safety for working capital buffer.'
  },
  {
    id: 'inv-2',
    companyId: 'comp-1',
    name: 'ICICI Prudential Overnight Institutional Liquid Fund',
    category: 'Debt Mutual Fund',
    investedAmount: 2500000, // ₹25 Lakhs
    currentValue: 2615000,   // ₹26.15 Lakhs
    realizedReturns: 98000,
    unrealizedGains: 115000,
    yieldRate: 6.25,
    riskLevel: 'Low (T+1 Liquidity)',
    maturityDate: 'Open-Ended',
    status: 'Active',
    allocationPercent: 27.8,
    notes: 'Immediate T+1 business day withdrawal window. Covers 1.5 months of emergency OPEX.'
  },
  {
    id: 'inv-3',
    companyId: 'comp-1',
    name: 'FinTech AI Patent & Strategic IP Co-Development',
    category: 'Alternative IP Asset',
    investedAmount: 1800000, // ₹18 Lakhs
    currentValue: 2250000,   // ₹22.5 Lakhs
    realizedReturns: 0,
    unrealizedGains: 450000, // +25%
    yieldRate: 25.0,
    riskLevel: 'Medium-High',
    maturityDate: '2028-06-30',
    status: 'Active',
    allocationPercent: 24.1,
    notes: 'Proprietary algorithmic IP co-owned with IIT Madras Research Park.'
  },
  {
    id: 'inv-4',
    companyId: 'comp-1',
    name: 'Series-A High-Yield Convertible Tech Note',
    category: 'Venture Debt',
    investedAmount: 500000, // ₹5 Lakhs
    currentValue: 535000,   // ₹5.35 Lakhs
    realizedReturns: 15000,
    unrealizedGains: 35000,
    yieldRate: 11.5,
    riskLevel: 'High',
    maturityDate: '2027-11-20',
    status: 'Active',
    allocationPercent: 5.6,
    notes: 'B2B supply chain infrastructure syndicate note with 11.5% coupon.'
  }
];

export const INITIAL_INVESTMENT_OPPORTUNITIES = [
  {
    id: 'opp-1',
    name: 'North American Enterprise Sales & Marketing Hub',
    category: 'Market Expansion',
    proposedAmount: 3000000,       // ₹30 Lakhs
    expectedAnnualRevenue: 7500000, // ₹75 Lakhs
    expectedAnnualCost: 1800000,   // ₹18 Lakhs
    expectedUsefulLifeYears: 3,
    expectedPaybackMonths: 7.5,
    projectedROI: 146.5,
    riskLevel: 'Medium',
    confidenceScore: 85,
    description: 'Hire 2 Senior Account Executives in New York and run targeted Gartner and Forrester campaigns.',
    status: 'Recommended with Buffer',
    keyBenefit: 'Unlocks $USD-denominated contracts with 3x higher gross margin profiles.'
  },
  {
    id: 'opp-2',
    name: 'In-House Private AI GPU Cluster & Local Weights Infrastructure',
    category: 'Technology & Automation',
    proposedAmount: 4200000,       // ₹42 Lakhs
    expectedAnnualRevenue: 2800000, // ₹28 Lakhs (Direct compute resale)
    expectedAnnualCost: 450000,    // ₹4.5 Lakhs power & datacenter
    expectedUsefulLifeYears: 4,
    expectedPaybackMonths: 11.2,
    projectedROI: 122.8,
    riskLevel: 'Low-Medium',
    confidenceScore: 92,
    description: 'Procure 4x NVIDIA L40S server clusters to replace recurring cloud inference bills from AWS.',
    status: 'High Cost-Benefit',
    keyBenefit: 'Saves ₹3.8 Lakhs/month in recurring third-party cloud API costs indefinitely.'
  },
  {
    id: 'opp-3',
    name: 'Automated 24/7 Agentic Support & Solution Engineering Pod',
    category: 'Operational Efficiency',
    proposedAmount: 1200000,       // ₹12 Lakhs
    expectedAnnualRevenue: 1500000, // Reduced client churn
    expectedAnnualCost: 180000,
    expectedUsefulLifeYears: 2,
    expectedPaybackMonths: 5.8,
    projectedROI: 185.0,
    riskLevel: 'Low',
    confidenceScore: 89,
    description: 'Deploy fine-tuned agentic autonomous workflows for Tier-1 incident triage and client SLA delivery.',
    status: 'Immediate Quick-Win',
    keyBenefit: 'Improves Net Revenue Retention (NRR) from 104% to 118%.'
  }
];

export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Aditya Sen',
    designation: 'Principal Solutions Architect',
    department: 'engineering',
    joiningDate: '2022-04-15',
    baseSalary: 280000, // ₹2.8 Lakhs / month
    allowances: 35000,
    deductions: 45000, // TDS & PF
    netSalary: 270000,
    employerOverhead: 42000,
    status: 'Active'
  },
  {
    id: 'EMP-002',
    name: 'Neha Chawla',
    designation: 'Head of Enterprise Sales',
    department: 'sales_marketing',
    joiningDate: '2022-08-01',
    baseSalary: 250000,
    allowances: 40000,
    deductions: 38000,
    netSalary: 252000,
    employerOverhead: 36000,
    status: 'Active'
  },
  {
    id: 'EMP-003',
    name: 'Rohan Mehra',
    designation: 'Lead Distributed Systems Engineer',
    department: 'engineering',
    joiningDate: '2023-01-10',
    baseSalary: 220000,
    allowances: 25000,
    deductions: 32000,
    netSalary: 213000,
    employerOverhead: 30000,
    status: 'Active'
  },
  {
    id: 'EMP-004',
    name: 'Pooja Varma',
    designation: 'Senior Product Manager',
    department: 'product_design',
    joiningDate: '2023-03-15',
    baseSalary: 195000,
    allowances: 20000,
    deductions: 28000,
    netSalary: 187000,
    employerOverhead: 25000,
    status: 'Active'
  },
  {
    id: 'EMP-005',
    name: 'Kavita Nair',
    designation: 'Finance Controller & Legal Lead',
    department: 'finance_legal',
    joiningDate: '2022-06-20',
    baseSalary: 185000,
    allowances: 20000,
    deductions: 26000,
    netSalary: 179000,
    employerOverhead: 24000,
    status: 'Active'
  },
  {
    id: 'EMP-006',
    name: 'Siddharth Iyer',
    designation: 'Lead Frontend Systems Engineer',
    department: 'engineering',
    joiningDate: '2023-07-01',
    baseSalary: 175000,
    allowances: 18000,
    deductions: 24000,
    netSalary: 169000,
    employerOverhead: 22000,
    status: 'Active'
  },
  {
    id: 'EMP-007',
    name: 'Ananya Roy',
    designation: 'Senior DevOps & Security Specialist',
    department: 'engineering',
    joiningDate: '2023-09-15',
    baseSalary: 165000,
    allowances: 16000,
    deductions: 22000,
    netSalary: 159000,
    employerOverhead: 21000,
    status: 'Active'
  },
  {
    id: 'EMP-008',
    name: 'Vikram Joshi',
    designation: 'Corporate Talent & People Operations Lead',
    department: 'hr_payroll',
    joiningDate: '2022-11-10',
    baseSalary: 145000,
    allowances: 15000,
    deductions: 19000,
    netSalary: 141000,
    employerOverhead: 18000,
    status: 'Active'
  },
  {
    id: 'EMP-009',
    name: 'Deepak Sharma',
    designation: 'Enterprise Account Executive',
    department: 'sales_marketing',
    joiningDate: '2024-02-01',
    baseSalary: 140000,
    allowances: 15000,
    deductions: 18000,
    netSalary: 137000,
    employerOverhead: 18000,
    status: 'Active'
  },
  {
    id: 'EMP-010',
    name: 'Sneha Patel',
    designation: 'Full Stack Engineer II',
    department: 'engineering',
    joiningDate: '2024-04-10',
    baseSalary: 130000,
    allowances: 14000,
    deductions: 16000,
    netSalary: 128000,
    employerOverhead: 16000,
    status: 'Active'
  }
];

export const INITIAL_DEPARTMENT_BUDGETS = {
  engineering: 1800000,     // ₹18.0 Lakhs
  sales_marketing: 1200000, // ₹12.0 Lakhs
  operations: 650000,       // ₹6.5 Lakhs
  hr_payroll: 2800000,      // ₹28.0 Lakhs
  finance_legal: 450000,    // ₹4.5 Lakhs
  product_design: 500000,   // ₹5.0 Lakhs
};

export const INITIAL_USER_PROFILE = {
  name: 'partner',
  handle: '@partner_finora',
  email: 'partner@finora.nexus',
  role: 'Chief Financial Officer & Partner',
  currency: 'INR',
  activeCompanyId: 'comp-1',
  minimumReserveMonths: 3.5, // 3.5 months runway minimum policy
  minimumReserveAmount: 4500000, // ₹45.0 Lakhs minimum cash reserve threshold
  compactSidebar: false,
  hideBalance: false,
  soundEffects: true,
  reducedMotion: false,
};

export const INITIAL_CORPORATE_NOTIFICATIONS = [
  {
    id: 'notif-corp-1',
    title: 'Cash Runway Status: 8.4 Months Available',
    message: 'Healthy liquidity buffer of ₹1.06 Cr across operating and treasury reserves.',
    type: 'success',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-corp-2',
    title: 'Department Budget Alert: Sales & Marketing',
    message: 'Sales & Marketing spent ₹4.1 Lakhs on performance ads (68% of monthly allocation).',
    type: 'warning',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 'notif-corp-3',
    title: 'Treasury Yield Notice: T-Bills Accrual',
    message: 'RBI 91-Day T-Bills accrued +₹1.4 Lakhs in sovereign realized yield.',
    type: 'info',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-corp-4',
    title: 'Upcoming Payroll Cycle: ₹24.5L Scheduled',
    message: 'Monthly employee compensation disbursement scheduled in 5 days.',
    type: 'info',
    time: '2 days ago',
    read: true,
  },
];
