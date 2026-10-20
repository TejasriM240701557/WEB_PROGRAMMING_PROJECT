export const SINGLE_COMPANY = {
  id: 'comp-1',
  name: 'Apex Technologies Pvt Ltd',
  legalName: 'Apex Technologies Private Limited',
  industry: 'Enterprise Cloud & AI Solutions',
  incorporationYear: 2022,
  cin: 'U72900KA2021PTC148901',
  pan: 'AABCA1234F',
  gstin: '29AABCA1234F1Z5',
  baseCurrency: 'INR',
  currencySymbol: '₹',
  fiscalYearStart: 'April',
  activeTier: 'Enterprise Growth Tier',
};

// Internal company reference (single-company architecture)
export const COMPANIES = [SINGLE_COMPANY];

export const TRANSACTION_TYPES = {
  revenue: {
    id: 'revenue',
    label: 'Revenue / Inflow',
    color: '#22D3EE', // Cyan
    sign: '+',
    isOperating: true,
    isPnlRevenue: true,
  },
  operating_expense: {
    id: 'operating_expense',
    label: 'Operating Expense (OPEX)',
    color: '#FF4FD8', // Pink
    sign: '-',
    isOperating: true,
    isPnlExpense: true,
  },
  payroll_expense: {
    id: 'payroll_expense',
    label: 'Payroll & Compensation',
    color: '#A855F7', // Violet
    sign: '-',
    isOperating: true,
    isPnlExpense: true,
  },
  investment_purchase: {
    id: 'investment_purchase',
    label: 'Investment Capital Outlay',
    color: '#38BDF8', // Sky
    sign: '-',
    isOperating: false,
    isPnlExpense: false, // Asset acquisition, not OPEX!
  },
  investment_proceeds: {
    id: 'investment_proceeds',
    label: 'Investment Yield / Proceeds',
    color: '#5CFFB2', // Mint
    sign: '+',
    isOperating: false,
    isPnlRevenue: false, // Non-operating return
  },
  loan_proceeds: {
    id: 'loan_proceeds',
    label: 'Debt / Loan Proceeds',
    color: '#34D399',
    sign: '+',
    isOperating: false,
    isPnlRevenue: false, // Financing liability
  },
  loan_repayment: {
    id: 'loan_repayment',
    label: 'Debt Service / Loan Repayment',
    color: '#F43F5E',
    sign: '-',
    isOperating: false,
    isPnlExpense: false, // Principal reduction (interest is OPEX)
  },
  tax_payment: {
    id: 'tax_payment',
    label: 'Corporate Tax / Statutory',
    color: '#FBBF24',
    sign: '-',
    isOperating: true,
    isPnlExpense: true,
  },
  other_income: {
    id: 'other_income',
    label: 'Other Non-Operating Income',
    color: '#5CFFB2',
    sign: '+',
    isOperating: false,
    isPnlRevenue: false,
  },
  other_expense: {
    id: 'other_expense',
    label: 'Other Miscellaneous Expense',
    color: '#94A3B8',
    sign: '-',
    isOperating: true,
    isPnlExpense: true,
  },
};

export const DEPARTMENTS = [
  { id: 'engineering', name: 'Engineering & Technology', code: 'ENG', color: '#22D3EE' },
  { id: 'sales_marketing', name: 'Sales & Marketing', code: 'S&M', color: '#FF4FD8' },
  { id: 'operations', name: 'Operations & Facilities', code: 'OPS', color: '#5CFFB2' },
  { id: 'hr_payroll', name: 'Human Resources & Talent', code: 'HR', color: '#A855F7' },
  { id: 'finance_legal', name: 'Finance, Legal & Governance', code: 'FIN', color: '#FBBF24' },
  { id: 'product_design', name: 'Product & Design', code: 'PRD', color: '#38BDF8' },
];

export const CATEGORIES = {
  // Revenue Categories
  saas_subscription: {
    id: 'saas_subscription',
    name: 'SaaS Recurring Subscriptions',
    department: 'sales_marketing',
    icon: 'Layers',
    color: '#22D3EE',
    type: 'revenue',
  },
  enterprise_license: {
    id: 'enterprise_license',
    name: 'Enterprise Contracts & SLA',
    department: 'sales_marketing',
    icon: 'Building2',
    color: '#5CFFB2',
    type: 'revenue',
  },
  professional_services: {
    id: 'professional_services',
    name: 'Consulting & Implementation Services',
    department: 'operations',
    icon: 'Briefcase',
    color: '#A855F7',
    type: 'revenue',
  },
  api_usage: {
    id: 'api_usage',
    name: 'Metered API Consumption',
    department: 'engineering',
    icon: 'Cpu',
    color: '#38BDF8',
    type: 'revenue',
  },

  // Operating Expense Categories
  salaries_wages: {
    id: 'salaries_wages',
    name: 'Salaries & Base Compensation',
    department: 'hr_payroll',
    icon: 'Users',
    color: '#A855F7',
    type: 'payroll_expense',
  },
  cloud_infrastructure: {
    id: 'cloud_infrastructure',
    name: 'Cloud Compute & Data Centers',
    department: 'engineering',
    icon: 'Server',
    color: '#22D3EE',
    type: 'operating_expense',
  },
  software_tools: {
    id: 'software_tools',
    name: 'Software Licences & DevOps Tooling',
    department: 'engineering',
    icon: 'Code',
    color: '#38BDF8',
    type: 'operating_expense',
  },
  marketing_acquisition: {
    id: 'marketing_acquisition',
    name: 'Paid Acquisition & Brand Campaigns',
    department: 'sales_marketing',
    icon: 'Megaphone',
    color: '#FF4FD8',
    type: 'operating_expense',
  },
  office_rent: {
    id: 'office_rent',
    name: 'Corporate Facilities & Co-working',
    department: 'operations',
    icon: 'Building',
    color: '#FBBF24',
    type: 'operating_expense',
  },
  legal_compliance: {
    id: 'legal_compliance',
    name: 'Audit, Regulatory & Legal Counsel',
    department: 'finance_legal',
    icon: 'ShieldCheck',
    color: '#34D399',
    type: 'operating_expense',
  },
  travel_business: {
    id: 'travel_business',
    name: 'Executive & Client Business Travel',
    department: 'sales_marketing',
    icon: 'Plane',
    color: '#FB7185',
    type: 'operating_expense',
  },
  tax_statutory: {
    id: 'tax_statutory',
    name: 'Advance Tax & Statutory Remittance',
    department: 'finance_legal',
    icon: 'Receipt',
    color: '#FBBF24',
    type: 'tax_payment',
  },

  // Capital / Investments
  treasury_bonds: {
    id: 'treasury_bonds',
    name: 'Sovereign Treasury Bonds & Bills',
    department: 'finance_legal',
    icon: 'TrendingUp',
    color: '#5CFFB2',
    type: 'investment_purchase',
  },
  tech_equity: {
    id: 'tech_equity',
    name: 'Tech Strategic Equity & Seed IP',
    department: 'finance_legal',
    icon: 'Sparkles',
    color: '#A855F7',
    type: 'investment_purchase',
  },
  liquid_fund: {
    id: 'liquid_fund',
    name: 'Overnight Liquid Debt Fund',
    department: 'finance_legal',
    icon: 'Coins',
    color: '#22D3EE',
    type: 'investment_purchase',
  },
};

export const CORPORATE_ACCOUNTS = [
  { id: 'acc-hdfc', name: 'HDFC Corporate Current (A/C ...4819)', balance: 4850000, type: 'Operating' },
  { id: 'acc-icici', name: 'ICICI Treasury Liquidity Reserve', balance: 3500000, type: 'Reserve' },
  { id: 'acc-razorpay', name: 'Razorpay PG Settlement Node', balance: 820000, type: 'Gateway' },
  { id: 'acc-stripe', name: 'Stripe International USD Float', balance: 1450000, type: 'Foreign Float' },
];

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1, isBase: true },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0116 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0108 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0092 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.0155 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 0.0425 },
};

export const DEFAULT_DEPARTMENT_BUDGETS = {
  engineering: 1800000,     // ₹18 Lakhs / month
  sales_marketing: 1200000, // ₹12 Lakhs / month
  operations: 650000,       // ₹6.5 Lakhs / month
  hr_payroll: 2800000,      // ₹28 Lakhs / month (Salaries + Benefits)
  finance_legal: 450000,    // ₹4.5 Lakhs / month
  product_design: 500000,   // ₹5 Lakhs / month
};
