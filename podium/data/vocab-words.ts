export interface VocabWord {
  id: string;
  term: string;
  definition: string;
  example: string;
  cluster: string;
  eventId: string;
}

export const VOCAB_WORDS: VocabWord[] = [
  // Finance cluster
  { id: "v-bal-sheet", term: "Balance Sheet", definition: "A financial statement that reports a company's assets, liabilities, and shareholders' equity at a specific point in time.", example: "The company's balance sheet showed $5M in assets and $2M in liabilities.", cluster: "finance", eventId: "bfs" },
  { id: "v-roi", term: "Return on Investment (ROI)", definition: "A performance measure used to evaluate the efficiency of an investment, calculated as net profit divided by cost of investment.", example: "The marketing campaign had an ROI of 250%, generating $25K from a $10K investment.", cluster: "finance", eventId: "bfs" },
  { id: "v-liquidity", term: "Liquidity", definition: "The ease with which an asset can be converted into cash without affecting its market price.", example: "Cash and treasury bills are considered highly liquid assets.", cluster: "finance", eventId: "bfs" },
  { id: "v-depreciation", term: "Depreciation", definition: "The reduction in value of an asset over time due to wear and tear, age, or obsolescence.", example: "The company depreciated its delivery trucks over a 5-year period.", cluster: "finance", eventId: "act" },
  { id: "v-accrual", term: "Accrual Accounting", definition: "An accounting method that records revenue and expenses when they are earned or incurred, regardless of when cash is exchanged.", example: "Under accrual accounting, the sale was recorded in March even though payment wasn't received until April.", cluster: "finance", eventId: "act" },
  { id: "v-equity", term: "Equity", definition: "The value of an ownership interest in a business, calculated as total assets minus total liabilities.", example: "The owner's equity in the business was $500,000 after paying off all debts.", cluster: "finance", eventId: "bfs" },
  { id: "v-dividend", term: "Dividend", definition: "A distribution of a portion of a company's earnings to its shareholders.", example: "The board declared a quarterly dividend of $0.50 per share.", cluster: "finance", eventId: "bfs" },
  { id: "v-amortization", term: "Amortization", definition: "The process of spreading the cost of an intangible asset over its useful life, or the gradual repayment of a loan.", example: "The patent's cost was amortized over its 20-year useful life.", cluster: "finance", eventId: "act" },

  // Marketing cluster
  { id: "v-market-seg", term: "Market Segmentation", definition: "The process of dividing a broad market into distinct subgroups of consumers who have common needs or characteristics.", example: "The company segmented its market by age, income, and lifestyle preferences.", cluster: "marketing", eventId: "sem" },
  { id: "v-brand-equity", term: "Brand Equity", definition: "The commercial value that derives from consumer perception of the brand name rather than the product itself.", example: "Nike's brand equity allows it to charge premium prices for athletic wear.", cluster: "marketing", eventId: "mcs" },
  { id: "v-cpa", term: "Cost Per Acquisition (CPA)", definition: "The total cost of acquiring one paying customer through a specific campaign or channel.", example: "The social media campaign achieved a CPA of $15, well below the $25 target.", cluster: "marketing", eventId: "mcs" },
  { id: "v-pos", term: "Point of Sale (POS)", definition: "The time and place where a retail transaction is completed, or the system used to process such transactions.", example: "The new POS system reduced checkout time by 40%.", cluster: "marketing", eventId: "rms" },
  { id: "v-markup", term: "Markup", definition: "The amount added to the cost price of goods to cover overhead and profit.", example: "The retailer applied a 60% markup on the wholesale price of $50, setting the retail price at $80.", cluster: "marketing", eventId: "rms" },
  { id: "v-demographics", term: "Demographics", definition: "Statistical characteristics of a population, such as age, gender, income, and education, used to identify markets.", example: "The target demographics for the product were women aged 25-34 with household incomes over $75K.", cluster: "marketing", eventId: "sem" },
  { id: "v-conversion", term: "Conversion Rate", definition: "The percentage of visitors or prospects who take a desired action, such as making a purchase.", example: "The website redesign improved the conversion rate from 2% to 4.5%.", cluster: "marketing", eventId: "mcs" },
  { id: "v-omnichannel", term: "Omnichannel Marketing", definition: "A customer-centric approach that provides a seamless shopping experience across all channels and touchpoints.", example: "The retailer's omnichannel strategy let customers buy online and return in-store.", cluster: "marketing", eventId: "rms" },

  // Entrepreneurship cluster
  { id: "v-value-prop", term: "Value Proposition", definition: "A statement that summarizes why a consumer should buy a product or use a service, describing the unique benefits offered.", example: "Their value proposition was 'Fresh meals delivered in 30 minutes or less, using only local ingredients.'", cluster: "entrepreneurship", eventId: "ent" },
  { id: "v-pivot", term: "Pivot", definition: "A structured course correction designed to test a new fundamental hypothesis about the product, strategy, or engine of growth.", example: "After poor initial sales, the startup pivoted from B2C to B2B, targeting small businesses instead.", cluster: "entrepreneurship", eventId: "ent" },
  { id: "v-bootstrapping", term: "Bootstrapping", definition: "Building a company from personal finances or operating revenues without external investment.", example: "She bootstrapped her bakery with $5,000 in savings and reinvested all profits for the first two years.", cluster: "entrepreneurship", eventId: "ent" },
  { id: "v-burn-rate", term: "Burn Rate", definition: "The rate at which a company spends its cash reserves before generating positive cash flow.", example: "With a monthly burn rate of $50K and $300K in the bank, they had six months of runway.", cluster: "entrepreneurship", eventId: "ent" },
  { id: "v-scalability", term: "Scalability", definition: "The ability of a business to grow and manage increased demand without a proportional increase in costs.", example: "The SaaS model was highly scalable — serving 10,000 users cost only slightly more than serving 1,000.", cluster: "entrepreneurship", eventId: "ent" },
  { id: "v-mvp", term: "Minimum Viable Product (MVP)", definition: "A product with just enough features to satisfy early customers and provide feedback for future development.", example: "They launched an MVP with only three core features to test market demand before building the full product.", cluster: "entrepreneurship", eventId: "ent" },
];
