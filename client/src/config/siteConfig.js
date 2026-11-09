export const siteConfig = {
  brand: {
    name: 'FinXinfo',
    domain: 'finxinfo.com',
    tagline: 'Financial Clarity for Growing US Businesses',
    subtagline:
      'Certified QuickBooks ProAdvisors providing professional bookkeeping, payroll, financial reporting and tax services through trusted licensed US CPA partners.',
  },
  contact: {
    phone: '+1-888-843-3173',
    phoneRaw: '+18888433173',
    email: 'contact@finxinfo.com',
    address: '220 S Livermore Ave, #3250, Livermore, CA 94550',
    hours: 'Monday–Friday, 8 AM–7 PM EST',
  },
  trustStats: [
    {
      label: 'Certified QuickBooks ProAdvisors',
      value: 'Elite Tier',
      description: 'Intuit-certified specialists for Desktop & Online',
      icon: 'Award',
    },
    {
      label: 'Licensed US CPA Partners',
      value: 'All 50 States',
      description: 'Accredited federal & state tax compliance',
      icon: 'FileCheck',
    },
    {
      label: 'Secure Financial Data',
      value: '256-Bit SSL',
      description: 'Bank-grade encryption & confidentiality',
      icon: 'ShieldCheck',
    },
    {
      label: 'Nationwide Business Support',
      value: 'US-Based',
      description: 'Prompt communication in EST/CST/MST/PST',
      icon: 'MapPin',
    },
  ],
  services: [
    {
      id: 'bookkeeping',
      title: 'Bookkeeping Services',
      subtitle: 'Accurate, Day-to-Day Transaction Management',
      shortDesc:
        'Keep your books impeccably clean with daily transaction categorization, bank reconciliations, and audit-ready records.',
      features: [
        'Monthly & weekly bookkeeping',
        'Ledger management & chart of accounts',
        'Account & credit card reconciliation',
        'Automated bank feed monitoring',
        'Receipt and invoice matching',
      ],
      icon: 'BookOpenCheck',
      badge: 'Core Essential',
    },
    {
      id: 'quickbooks',
      title: 'QuickBooks Services',
      subtitle: 'Implementation, Cleanup & Migration',
      shortDesc:
        'Certified ProAdvisor support to properly structure QuickBooks Online or Desktop, fix historical errors, and train your staff.',
      features: [
        'QuickBooks Online & Desktop setup',
        'Historical bookkeeping cleanup & catch-up',
        'Seamless data migration & chart restructuring',
        'Third-party app integrations (Shopify, Stripe, Gusto)',
        'One-on-one ProAdvisor coaching & training',
      ],
      icon: 'Wrench',
      badge: 'Certified Experts',
    },
    {
      id: 'payroll',
      title: 'Payroll Services',
      subtitle: 'Compliant & Timely Employee Compensation',
      shortDesc:
        'Flawless payroll processing, tax withholding management, and tax form generation so your team is always paid on time.',
      features: [
        'Automated employee direct deposits',
        'W-2 and 1099 annual preparation & filing',
        'Federal, state & local payroll tax compliance',
        'Contractor tracking and documentation',
        'PTO, benefits, and deductions management',
      ],
      icon: 'Users',
      badge: 'Hassle-Free',
    },
    {
      id: 'tax-preparation',
      title: 'Tax Preparation',
      subtitle: 'Strategic Deduction Planning & Organization',
      shortDesc:
        'Year-round tax organization and strategic planning that ensures no write-off is overlooked and records are tax-ready.',
      features: [
        'Year-round tax planning support',
        'Business deduction optimization',
        'Pre-tax documentation assembly',
        'Depreciation schedule management',
        'Direct coordination with your licensed CPA',
      ],
      icon: 'Calculator',
      badge: 'Maximize Write-offs',
    },
    {
      id: 'tax-filing',
      title: 'Tax Filing Coordination',
      subtitle: 'Through Trusted Licensed US CPA Partners',
      shortDesc:
        'Seamless federal and state return preparation and filing executed through accredited, licensed US CPA partners.',
      features: [
        'Federal corporate (1120 / 1120S) returns',
        'Partnership (1065) & LLC returns',
        'Multi-state sales tax & income tax filing',
        'Schedule C individual business filings',
        'Direct CPA electronic e-filing with IRS & states',
      ],
      icon: 'Landmark',
      badge: 'CPA Backed',
    },
    {
      id: 'financial-reporting',
      title: 'Financial Reporting',
      subtitle: 'Actionable Insights for Growth',
      shortDesc:
        'Clear, executive-level reports that give you an accurate picture of cash flow, profitability, and financial trajectory.',
      features: [
        'Profit and Loss (P&L) statements',
        'Detailed Balance Sheets',
        'Statement of Cash Flows',
        'Custom KPI & performance dashboards',
        'Monthly variance & budget comparisons',
      ],
      icon: 'BarChart3',
      badge: 'Strategic Vision',
    },
  ],
  whyChooseUs: {
    heading: 'Precision Bookkeeping Backed by Licensed CPA Expertise',
    subheading:
      'We combine the day-to-day diligence of dedicated Certified QuickBooks ProAdvisors with the rigorous oversight and filing capabilities of licensed US CPA partners.',
    benefits: [
      {
        title: 'Dedicated QuickBooks ProAdvisors',
        desc: 'You are paired with experienced, certified ProAdvisors who master Intuit systems and understand your industry workflow.',
        icon: 'UserCheck',
      },
      {
        title: 'CPA Partner Tax Integration',
        desc: 'No more frantic year-end scramble. Your books flow seamlessly from our bookkeeping team into certified CPA tax filing.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Clear and Transparent Pricing',
        desc: 'Fixed, predictable monthly rates with zero hidden hourly fees or unexpected surprise billing at tax time.',
        icon: 'CircleDollarSign',
      },
      {
        title: 'Secure Financial Data Management',
        desc: 'SOC-compliant, 256-bit encrypted data protocols and strict confidentiality agreements safeguard your records.',
        icon: 'Lock',
      },
    ],
    comparisonTable: {
      headers: ['Features', 'FinXinfo', 'Traditional In-House'],
      rows: [
        {
          feature: 'QuickBooks Certified Expertise',
          us: 'Elite Certified ProAdvisors on staff',
          them: 'Varies; often requires costly training',
        },
        {
          feature: 'CPA Partner Tax Filing',
          us: 'Integrated with licensed US CPA partners',
          them: 'Must hire separate expensive CPA firm',
        },
        {
          feature: 'Predictable Monthly Cost',
          us: 'Flat transparent fee starting at $299/mo',
          them: '$4,500+/mo in salary, taxes, & software',
        },
        {
          feature: 'Financial Data Protection',
          us: 'Bank-level 256-bit encryption & strict NDA',
          them: 'Subject to local machine risks & employee turnover',
        },
        {
          feature: 'Flexible Business Support',
          us: 'Scales up or down with your revenue volume',
          them: 'Rigid hiring, severance, & vacancy gaps',
        },
      ],
    },
  },
  industries: [
    {
      title: 'Construction & Contractors',
      icon: 'HardHat',
      requirements:
        'Job costing, progress billing, WIP schedules, sub-contractor 1099 compliance, and workers comp audits.',
    },
    {
      title: 'Healthcare & Medical',
      icon: 'HeartPulse',
      requirements:
        'HIPAA-compliant bookkeeping, medical practice reconciliations, insurance receipt tracking, and multi-provider payroll.',
    },
    {
      title: 'Restaurants & Hospitality',
      icon: 'UtensilsCrossed',
      requirements:
        'Point-of-Sale (POS) integration (Toast, Square, Clover), food & liquor cost tracking, tip reporting, and prime cost analysis.',
    },
    {
      title: 'Real Estate & Property',
      icon: 'Building2',
      requirements:
        'Rent roll accounting, security deposit escrow tracking, property depreciation schedules, and 1031 exchange prep.',
    },
    {
      title: 'E-commerce & DTC',
      icon: 'ShoppingCart',
      requirements:
        'Multi-channel reconciliation (Shopify, Amazon, eBay), inventory COGS, multi-state economic nexus sales tax filing.',
    },
    {
      title: 'Professional Services',
      icon: 'Briefcase',
      requirements:
        'Time & billing reconciliation, trust account management (IOLTA for attorneys), retainer tracking, and consulting margins.',
    },
    {
      title: 'Retail & Franchises',
      icon: 'Store',
      requirements:
        'Multi-location consolidation, shrinkage and inventory valuation, merchant fee auditing, and cash drawer reconciliations.',
    },
    {
      title: 'Nonprofits & Charities',
      icon: 'HandHeart',
      requirements:
        'Fund accounting, restricted grant tracking, statement of functional expenses, and IRS Form 990 preparation support.',
    },
  ],
  whiteLabelCPA: {
    heading: 'White Label CPA & Accounting Firm Outsourcing',
    subheading:
      'Extend your firm’s capacity without extending your headcount. We provide invisible, high-caliber back-office bookkeeping and tax prep support under your brand.',
    features: [
      {
        title: '100% White Label Delivery',
        desc: 'Our staff works completely behind the scenes. Client deliverables, emails, and reports display your accounting firm’s branding.',
        icon: 'Ghost',
      },
      {
        title: 'Outsourced Bookkeeping',
        desc: 'Offload routine monthly reconciliations, payroll, and AP/AR so your senior partners can focus on high-margin advisory work.',
        icon: 'Layers',
      },
      {
        title: 'Payroll Processing Support',
        desc: 'Full-service payroll runs and filings managed accurately under your firm’s umbrella for multiple corporate clients.',
        icon: 'ReceiptCheck',
      },
      {
        title: 'Tax Preparation Support',
        desc: 'Thoroughly prepared workpapers, trial balance reconciliations, and tax schedule tie-outs ready for your review and sign-off.',
        icon: 'FileSpreadsheet',
      },
      {
        title: 'Dedicated Remote Staff',
        desc: 'Experienced accountants assigned specifically to your firm, trained on your standard operating procedures and software.',
        icon: 'UserCheck',
      },
      {
        title: 'NDA-Backed Confidentiality',
        desc: 'Ironclad non-disclosure and non-compete agreements guaranteeing client retention and complete data confidentiality.',
        icon: 'ShieldAlert',
      },
    ],
  },
  pricing: [
    {
      id: 'essential',
      name: 'Essential',
      price: '$299',
      billing: '/month',
      description: 'Ideal for early-stage businesses, consultants, and solo practitioners needing tidy, compliant books.',
      popular: false,
      features: [
        'Up to $25k Monthly Expenses',
        'Monthly Ledger Reconciliation',
        'QuickBooks Online Connection',
        'Dedicated ProAdvisor Support',
        'Annual CPA Partner Tax Filing',
        'Monthly Profit & Loss Statement',
        'Standard Email Support',
      ],
      cta: 'Get Started with Essential',
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$499',
      billing: '/month',
      description: 'Our most popular plan for expanding companies requiring active payroll, weekly reconciliation, and advisory.',
      popular: true,
      features: [
        'Up to $75k Monthly Expenses',
        'Weekly Ledger Reconciliation',
        'Full Payroll Processing (Up to 10 employees)',
        'Profit & Loss / Balance Sheet',
        'Dedicated ProAdvisor Team',
        'Annual CPA Partner Tax Filing',
        'Quarterly Tax Planning Review',
        'Priority Phone & Email Support',
      ],
      cta: 'Choose Growth Plan',
    },
    {
      id: 'scale',
      name: 'Scale & Tax',
      price: '$799',
      billing: '/month',
      description: 'Comprehensive financial operations for high-volume businesses, multi-entity organizations, and corporations.',
      popular: false,
      features: [
        'Custom / High Expense Volume',
        'Real-Time Continuous Reconciliation',
        'Complete Payroll Management (Unlimited)',
        'Executive Dashboard Reporting & Cash Flow',
        'Annual CPA Partner Tax Filing (Fed + Multi-State)',
        'Dedicated Senior Controller & ProAdvisor Lead',
        'Monthly Strategy Advisory Session',
        'Dedicated Slack & Direct Phone Line',
      ],
      cta: 'Scale Your Financials',
    },
  ],
  faqs: [
    {
      question: 'Is FinXinfo a CPA firm?',
      answer:
        'FinXinfo is a specialized financial services and bookkeeping company staffed by Certified QuickBooks ProAdvisors. We are not a CPA firm ourselves; however, we work in close integration with licensed, accredited US CPA partner firms who handle all formal tax preparation, certification, and federal/state tax filing.',
    },
    {
      question: 'Which versions of QuickBooks do you support?',
      answer:
        'We support all QuickBooks editions, including QuickBooks Online (Simple Start, Essentials, Plus, Advanced) and QuickBooks Desktop (Pro, Premier, Enterprise). Our ProAdvisors can also assist with migrating your historical files from Desktop to Online or vice-versa.',
    },
    {
      question: 'How do you handle financial data securely?',
      answer:
        'We employ bank-grade 256-bit SSL encryption for all file transfers and communications. We never store raw banking credentials, utilizing secure read-only bank feeds and multi-factor authentication (MFA). Furthermore, all team members are bound by strict NDAs and security protocols.',
    },
    {
      question: 'Can you help if my books are months behind?',
      answer:
        'Yes, historical catch-up and cleanup is one of our top specialties! Whether your bookkeeping is three months or three years behind, our ProAdvisors will systematically review your bank statements, categorize transactions, reconcile ledgers, and bring your financials completely up to date.',
    },
    {
      question: 'Do you offer white-label outsourcing for accounting firms?',
      answer:
        'Yes. We offer turnkey white-label back-office services for CPAs, EAs, and accounting practices across the United States. We handle the bookkeeping, payroll, and tax prep workpapers while your firm maintains direct client relationships under your own brand identity.',
    },
    {
      question: 'How can I get started?',
      answer:
        'Getting started is fast and simple: request a free consultation using our online booking form or call us directly at +1-888-843-3173. We will assess your transaction volume, software setup, and current records, then provide a clear, customized onboarding plan.',
    },
    {
      question: 'How does your pricing work?',
      answer:
        'Our pricing is transparent and flat-rate monthly, based on your business’s monthly expense volume and service tier. You will never receive surprising hourly invoices. You can upgrade, downgrade, or cancel at any time with 30 days notice.',
    },
  ],
};

