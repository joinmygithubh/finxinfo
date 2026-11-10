/**
 * FinXinfo Official Backend Pricing Catalog
 *
 * Enforces server-side validated amounts. The frontend NEVER dictates payable amounts.
 */
const PRICING_CATALOG = {
  // Monthly Subscription / Retainer Plans
  'essential': {
    id: 'essential',
    name: 'Essential Plan',
    category: 'plan',
    amount: 299.00,
    currency: 'INR',
    description: 'Up to $25k monthly expenses, monthly ledger reconciliation & CPA tax filing.',
  },
  'growth': {
    id: 'growth',
    name: 'Growth Plan',
    category: 'plan',
    amount: 499.00,
    currency: 'INR',
    description: 'Up to $75k expenses, weekly reconciliation, payroll for 10 employees & CPA tax.',
  },
  'scale': {
    id: 'scale',
    name: 'Scale & Tax Plan',
    category: 'plan',
    amount: 799.00,
    currency: 'INR',
    description: 'High-volume continuous reconciliation, unlimited payroll & multi-state tax filing.',
  },

  // Specialized Direct Services
  'bookkeeping': {
    id: 'bookkeeping',
    name: 'Bookkeeping Services',
    category: 'service',
    amount: 299.00,
    currency: 'INR',
    description: 'Monthly & weekly transaction management, reconciliation and audit-ready records.',
  },
  'quickbooks': {
    id: 'quickbooks',
    name: 'QuickBooks Cleanup & Optimization',
    category: 'service',
    amount: 449.00,
    currency: 'INR',
    description: 'Diagnostic chart of accounts review, backlog catch-up and historical cleanup.',
  },
  'cpa-tax': {
    id: 'cpa-tax',
    name: 'CPA Partner Tax Filing',
    category: 'service',
    amount: 699.00,
    currency: 'INR',
    description: 'Accredited US CPA federal & multi-state corporate and LLC tax returns.',
  },
  'payroll': {
    id: 'payroll',
    name: 'Payroll Processing & Compliance',
    category: 'service',
    amount: 199.00,
    currency: 'INR',
    description: 'W-2/1099 compliance, direct deposits and federal payroll tax filings.',
  },
  'financial-reporting': {
    id: 'financial-reporting',
    name: 'Financial Reporting & Advisory',
    category: 'service',
    amount: 349.00,
    currency: 'INR',
    description: 'P&L, Balance Sheets, Cash Flow statements and executive KPI performance reviews.',
  },
};

/**
 * Resolve and validate service or plan from catalog
 * @param {string} itemKey - e.g. 'essential', 'growth', 'bookkeeping'
 * @returns {object|null}
 */
const getCatalogItem = (itemKey) => {
  if (!itemKey) return null;
  const normalizedKey = itemKey.toString().trim().toLowerCase();
  return PRICING_CATALOG[normalizedKey] || null;
};

module.exports = {
  PRICING_CATALOG,
  getCatalogItem,
};

