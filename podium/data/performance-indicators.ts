export interface PerformanceIndicator {
  id: string;
  eventId: string;
  cluster: string;
  code: string;
  text: string;
  category: string;
  difficulty: "high" | "medium" | "low";
}

// PIs for the top 10 most popular events
// Source: DECA Inc. official PI documents
// NOTE: These are placeholder PIs — replace with actual PIs from official DECA documents
// The structure and format is correct; content must be sourced from deca.org

export const PERFORMANCE_INDICATORS: PerformanceIndicator[] = [
  // BFS — Business Finance Series (Finance cluster)
  { id: "bfs-01", eventId: "bfs", cluster: "finance", code: "BFS-01", text: "Explain the nature of business finance", category: "Financial Analysis", difficulty: "high" },
  { id: "bfs-02", eventId: "bfs", cluster: "finance", code: "BFS-02", text: "Explain the role of finance in business", category: "Financial Analysis", difficulty: "high" },
  { id: "bfs-03", eventId: "bfs", cluster: "finance", code: "BFS-03", text: "Describe the nature of budgets", category: "Financial Analysis", difficulty: "medium" },
  { id: "bfs-04", eventId: "bfs", cluster: "finance", code: "BFS-04", text: "Explain the nature of financial statements", category: "Accounting", difficulty: "high" },
  { id: "bfs-05", eventId: "bfs", cluster: "finance", code: "BFS-05", text: "Describe the nature of income statements", category: "Accounting", difficulty: "high" },
  { id: "bfs-06", eventId: "bfs", cluster: "finance", code: "BFS-06", text: "Describe the nature of balance sheets", category: "Accounting", difficulty: "medium" },
  { id: "bfs-07", eventId: "bfs", cluster: "finance", code: "BFS-07", text: "Explain the nature of cash flow statements", category: "Accounting", difficulty: "medium" },
  { id: "bfs-08", eventId: "bfs", cluster: "finance", code: "BFS-08", text: "Describe sources of funding for business", category: "Banking", difficulty: "medium" },
  { id: "bfs-09", eventId: "bfs", cluster: "finance", code: "BFS-09", text: "Explain the time value of money", category: "Banking", difficulty: "low" },
  { id: "bfs-10", eventId: "bfs", cluster: "finance", code: "BFS-10", text: "Explain types of investments", category: "Securities", difficulty: "low" },

  // ENT — Entrepreneurship Series
  { id: "ent-01", eventId: "ent", cluster: "entrepreneurship", code: "ENT-01", text: "Describe the nature of entrepreneurship", category: "Entrepreneurial Concepts", difficulty: "high" },
  { id: "ent-02", eventId: "ent", cluster: "entrepreneurship", code: "ENT-02", text: "Explain the concept of risk management", category: "Risk Management", difficulty: "high" },
  { id: "ent-03", eventId: "ent", cluster: "entrepreneurship", code: "ENT-03", text: "Describe factors that affect business risk", category: "Risk Management", difficulty: "medium" },
  { id: "ent-04", eventId: "ent", cluster: "entrepreneurship", code: "ENT-04", text: "Explain the nature of business plans", category: "Business Planning", difficulty: "high" },
  { id: "ent-05", eventId: "ent", cluster: "entrepreneurship", code: "ENT-05", text: "Describe the components of a business plan", category: "Business Planning", difficulty: "medium" },
  { id: "ent-06", eventId: "ent", cluster: "entrepreneurship", code: "ENT-06", text: "Explain methods used to generate product/service ideas", category: "Product Development", difficulty: "medium" },
  { id: "ent-07", eventId: "ent", cluster: "entrepreneurship", code: "ENT-07", text: "Explain the concept of market identification", category: "Market Analysis", difficulty: "low" },
  { id: "ent-08", eventId: "ent", cluster: "entrepreneurship", code: "ENT-08", text: "Describe marketing functions and channels", category: "Marketing", difficulty: "medium" },
  { id: "ent-09", eventId: "ent", cluster: "entrepreneurship", code: "ENT-09", text: "Explain the concept of financial planning", category: "Finance", difficulty: "low" },
  { id: "ent-10", eventId: "ent", cluster: "entrepreneurship", code: "ENT-10", text: "Describe startup costs and funding options", category: "Finance", difficulty: "low" },

  // SEM — Sports and Entertainment Marketing Series
  { id: "sem-01", eventId: "sem", cluster: "marketing", code: "SEM-01", text: "Explain the nature of sports/entertainment marketing", category: "Industry Foundations", difficulty: "high" },
  { id: "sem-02", eventId: "sem", cluster: "marketing", code: "SEM-02", text: "Describe the concept of marketing mix in SEM", category: "Marketing Strategy", difficulty: "high" },
  { id: "sem-03", eventId: "sem", cluster: "marketing", code: "SEM-03", text: "Explain pricing strategies for events and venues", category: "Pricing", difficulty: "medium" },
  { id: "sem-04", eventId: "sem", cluster: "marketing", code: "SEM-04", text: "Describe sponsorship in sports/entertainment", category: "Sponsorship", difficulty: "high" },
  { id: "sem-05", eventId: "sem", cluster: "marketing", code: "SEM-05", text: "Explain the nature of endorsements", category: "Sponsorship", difficulty: "medium" },
  { id: "sem-06", eventId: "sem", cluster: "marketing", code: "SEM-06", text: "Describe event marketing strategies", category: "Event Management", difficulty: "medium" },
  { id: "sem-07", eventId: "sem", cluster: "marketing", code: "SEM-07", text: "Explain ticket distribution and sales methods", category: "Revenue", difficulty: "low" },
  { id: "sem-08", eventId: "sem", cluster: "marketing", code: "SEM-08", text: "Describe promotional strategies for events", category: "Promotion", difficulty: "medium" },
  { id: "sem-09", eventId: "sem", cluster: "marketing", code: "SEM-09", text: "Explain the role of media in SEM", category: "Media", difficulty: "low" },
  { id: "sem-10", eventId: "sem", cluster: "marketing", code: "SEM-10", text: "Describe licensing in sports/entertainment", category: "Licensing", difficulty: "low" },

  // HLM — Hotel and Lodging Management Series
  { id: "hlm-01", eventId: "hlm", cluster: "hospitality", code: "HLM-01", text: "Explain the nature of the lodging industry", category: "Industry Foundations", difficulty: "high" },
  { id: "hlm-02", eventId: "hlm", cluster: "hospitality", code: "HLM-02", text: "Describe front office operations", category: "Operations", difficulty: "high" },
  { id: "hlm-03", eventId: "hlm", cluster: "hospitality", code: "HLM-03", text: "Explain housekeeping management procedures", category: "Operations", difficulty: "medium" },
  { id: "hlm-04", eventId: "hlm", cluster: "hospitality", code: "HLM-04", text: "Describe revenue management in lodging", category: "Revenue", difficulty: "high" },
  { id: "hlm-05", eventId: "hlm", cluster: "hospitality", code: "HLM-05", text: "Explain food and beverage management", category: "F&B", difficulty: "medium" },
  { id: "hlm-06", eventId: "hlm", cluster: "hospitality", code: "HLM-06", text: "Describe safety and security procedures", category: "Safety", difficulty: "medium" },
  { id: "hlm-07", eventId: "hlm", cluster: "hospitality", code: "HLM-07", text: "Explain guest service management", category: "Guest Services", difficulty: "low" },
  { id: "hlm-08", eventId: "hlm", cluster: "hospitality", code: "HLM-08", text: "Describe human resources in lodging", category: "HR", difficulty: "low" },

  // ACT — Accounting Applications Series
  { id: "act-01", eventId: "act", cluster: "finance", code: "ACT-01", text: "Explain the nature of accounting", category: "Accounting Foundations", difficulty: "high" },
  { id: "act-02", eventId: "act", cluster: "finance", code: "ACT-02", text: "Describe the accounting cycle", category: "Accounting Cycle", difficulty: "high" },
  { id: "act-03", eventId: "act", cluster: "finance", code: "ACT-03", text: "Explain journal entries and ledgers", category: "Accounting Cycle", difficulty: "high" },
  { id: "act-04", eventId: "act", cluster: "finance", code: "ACT-04", text: "Describe trial balance procedures", category: "Accounting Cycle", difficulty: "medium" },
  { id: "act-05", eventId: "act", cluster: "finance", code: "ACT-05", text: "Explain adjusting entries", category: "Accounting Cycle", difficulty: "medium" },
  { id: "act-06", eventId: "act", cluster: "finance", code: "ACT-06", text: "Describe payroll accounting procedures", category: "Payroll", difficulty: "medium" },
  { id: "act-07", eventId: "act", cluster: "finance", code: "ACT-07", text: "Explain inventory accounting methods", category: "Inventory", difficulty: "low" },
  { id: "act-08", eventId: "act", cluster: "finance", code: "ACT-08", text: "Describe depreciation methods", category: "Assets", difficulty: "low" },

  // MCS — Marketing Communications Series
  { id: "mcs-01", eventId: "mcs", cluster: "marketing", code: "MCS-01", text: "Explain the nature of marketing communications", category: "Foundations", difficulty: "high" },
  { id: "mcs-02", eventId: "mcs", cluster: "marketing", code: "MCS-02", text: "Describe the promotional mix", category: "Promotion", difficulty: "high" },
  { id: "mcs-03", eventId: "mcs", cluster: "marketing", code: "MCS-03", text: "Explain advertising strategies and media", category: "Advertising", difficulty: "high" },
  { id: "mcs-04", eventId: "mcs", cluster: "marketing", code: "MCS-04", text: "Describe public relations activities", category: "Public Relations", difficulty: "medium" },
  { id: "mcs-05", eventId: "mcs", cluster: "marketing", code: "MCS-05", text: "Explain digital marketing strategies", category: "Digital", difficulty: "medium" },
  { id: "mcs-06", eventId: "mcs", cluster: "marketing", code: "MCS-06", text: "Describe social media marketing", category: "Digital", difficulty: "medium" },
  { id: "mcs-07", eventId: "mcs", cluster: "marketing", code: "MCS-07", text: "Explain visual merchandising techniques", category: "Visual", difficulty: "low" },
  { id: "mcs-08", eventId: "mcs", cluster: "marketing", code: "MCS-08", text: "Describe branding strategies", category: "Branding", difficulty: "low" },

  // HRM — Human Resources Management Series
  { id: "hrm-01", eventId: "hrm", cluster: "business-mgmt", code: "HRM-01", text: "Explain the nature of human resources management", category: "HR Foundations", difficulty: "high" },
  { id: "hrm-02", eventId: "hrm", cluster: "business-mgmt", code: "HRM-02", text: "Describe recruiting and hiring processes", category: "Talent Acquisition", difficulty: "high" },
  { id: "hrm-03", eventId: "hrm", cluster: "business-mgmt", code: "HRM-03", text: "Explain employee training and development", category: "Development", difficulty: "high" },
  { id: "hrm-04", eventId: "hrm", cluster: "business-mgmt", code: "HRM-04", text: "Describe performance management systems", category: "Performance", difficulty: "medium" },
  { id: "hrm-05", eventId: "hrm", cluster: "business-mgmt", code: "HRM-05", text: "Explain compensation and benefits", category: "Compensation", difficulty: "medium" },
  { id: "hrm-06", eventId: "hrm", cluster: "business-mgmt", code: "HRM-06", text: "Describe labor relations and employment law", category: "Legal", difficulty: "medium" },
  { id: "hrm-07", eventId: "hrm", cluster: "business-mgmt", code: "HRM-07", text: "Explain workplace safety regulations", category: "Safety", difficulty: "low" },
  { id: "hrm-08", eventId: "hrm", cluster: "business-mgmt", code: "HRM-08", text: "Describe employee engagement strategies", category: "Engagement", difficulty: "low" },

  // RMS — Retail Merchandising Series
  { id: "rms-01", eventId: "rms", cluster: "marketing", code: "RMS-01", text: "Explain the nature of retailing", category: "Retail Foundations", difficulty: "high" },
  { id: "rms-02", eventId: "rms", cluster: "marketing", code: "RMS-02", text: "Describe buying and merchandising principles", category: "Buying", difficulty: "high" },
  { id: "rms-03", eventId: "rms", cluster: "marketing", code: "RMS-03", text: "Explain inventory management in retail", category: "Inventory", difficulty: "high" },
  { id: "rms-04", eventId: "rms", cluster: "marketing", code: "RMS-04", text: "Describe visual merchandising and store layout", category: "Visual", difficulty: "medium" },
  { id: "rms-05", eventId: "rms", cluster: "marketing", code: "RMS-05", text: "Explain customer service in retail settings", category: "Customer Service", difficulty: "medium" },
  { id: "rms-06", eventId: "rms", cluster: "marketing", code: "RMS-06", text: "Describe retail pricing strategies", category: "Pricing", difficulty: "medium" },
  { id: "rms-07", eventId: "rms", cluster: "marketing", code: "RMS-07", text: "Explain retail promotions and advertising", category: "Promotion", difficulty: "low" },
  { id: "rms-08", eventId: "rms", cluster: "marketing", code: "RMS-08", text: "Describe e-commerce and omnichannel retailing", category: "E-Commerce", difficulty: "low" },

  // PFL — Personal Financial Literacy
  { id: "pfl-01", eventId: "pfl", cluster: "personal-finance", code: "PFL-01", text: "Explain personal financial planning", category: "Planning", difficulty: "high" },
  { id: "pfl-02", eventId: "pfl", cluster: "personal-finance", code: "PFL-02", text: "Describe budgeting and money management", category: "Budgeting", difficulty: "high" },
  { id: "pfl-03", eventId: "pfl", cluster: "personal-finance", code: "PFL-03", text: "Explain the nature of credit and debt", category: "Credit", difficulty: "high" },
  { id: "pfl-04", eventId: "pfl", cluster: "personal-finance", code: "PFL-04", text: "Describe savings and investment options", category: "Investing", difficulty: "medium" },
  { id: "pfl-05", eventId: "pfl", cluster: "personal-finance", code: "PFL-05", text: "Explain insurance and risk management", category: "Insurance", difficulty: "medium" },
  { id: "pfl-06", eventId: "pfl", cluster: "personal-finance", code: "PFL-06", text: "Describe tax planning and filing", category: "Taxes", difficulty: "medium" },
  { id: "pfl-07", eventId: "pfl", cluster: "personal-finance", code: "PFL-07", text: "Explain consumer rights and responsibilities", category: "Consumer", difficulty: "low" },
  { id: "pfl-08", eventId: "pfl", cluster: "personal-finance", code: "PFL-08", text: "Describe housing and major purchase decisions", category: "Major Purchases", difficulty: "low" },
];
