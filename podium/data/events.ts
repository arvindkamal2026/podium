export interface DECAEvent {
  id: string;
  name: string;
  code: string;
  cluster: string;
  category: string;
  participants: string;
  prepTimeMins: number;
  interviewTimeMins: number;
  hasExam: boolean;
  overview: string;
  officialPiPdfUrl: string;
  officialSampleExamUrl: string;
  officialGuidelinesUrl: string;
}

export const DECA_EVENTS: DECAEvent[] = [
  {
    id: "act",
    name: "Accounting Applications Series",
    code: "ACT",
    cluster: "finance",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests knowledge of accounting principles and their application in real-world business scenarios through a written exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-Guidelines.pdf",
  },
  {
    id: "aam",
    name: "Apparel and Accessories Marketing Series",
    code: "AAM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Challenges participants to demonstrate marketing skills in the apparel and accessories industry through an exam and role play scenario.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-Guidelines.pdf",
  },
  {
    id: "asm",
    name: "Automotive Services Marketing Series",
    code: "ASM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Evaluates participants' ability to apply marketing concepts within the automotive services industry through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-Guidelines.pdf",
  },
  {
    id: "bfs",
    name: "Business Finance Series",
    code: "BFS",
    cluster: "finance",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Assesses participants' understanding of financial management, investment, and business finance concepts through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-Guidelines.pdf",
  },
  {
    id: "ebg",
    name: "Business Growth Plan",
    code: "EBG",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to develop a comprehensive plan for expanding an existing business, including market analysis and growth strategies.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-EBG-Guidelines.pdf",
  },
  {
    id: "bltdm",
    name: "Business Law and Ethics Team Decision Making",
    code: "BLTDM",
    cluster: "business-mgmt",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Challenges two-person teams to analyze a business law or ethics case study and propose solutions in a timed decision-making scenario.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-Guidelines.pdf",
  },
  {
    id: "bsm",
    name: "Business Services Marketing Series",
    code: "BSM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants' knowledge of marketing strategies specific to the business services industry through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-Guidelines.pdf",
  },
  {
    id: "bor",
    name: "Business Services Operations Research",
    code: "BOR",
    cluster: "business-mgmt",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Requires participants to research and present solutions to a real business services operations challenge using data-driven analysis.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-Guidelines.pdf",
  },
  {
    id: "pmbs",
    name: "Business Solutions Project",
    code: "PMBS",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to identify a business problem and develop, implement, and evaluate a practical solution project.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMBS-Guidelines.pdf",
  },
  {
    id: "bmor",
    name: "Buying and Merchandising Operations Research",
    code: "BMOR",
    cluster: "business-mgmt",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Requires participants to research and analyze a buying or merchandising operations problem and present evidence-based recommendations.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-Guidelines.pdf",
  },
  {
    id: "btdm",
    name: "Buying and Merchandising Team Decision Making",
    code: "BTDM",
    cluster: "business-mgmt",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests two-person teams' ability to analyze buying and merchandising case studies and develop strategic recommendations under time pressure.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-Guidelines.pdf",
  },
  {
    id: "pmcd",
    name: "Career Development Project",
    code: "PMCD",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Engages participants in creating and executing a project that helps members develop professional and career-readiness skills.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCD-Guidelines.pdf",
  },
  {
    id: "pmca",
    name: "Community Awareness Project",
    code: "PMCA",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to design and implement a project that raises awareness of a community issue or local cause.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCA-Guidelines.pdf",
  },
  {
    id: "pmcg",
    name: "Community Giving Project",
    code: "PMCG",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to plan and execute a fundraising or community service project that benefits a local nonprofit or cause.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCG-Guidelines.pdf",
  },
  {
    id: "ent",
    name: "Entrepreneurship Series",
    code: "ENT",
    cluster: "entrepreneurship",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Evaluates participants' entrepreneurial knowledge and ability to apply business startup concepts through an exam and role play scenario.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-Guidelines.pdf",
  },
  {
    id: "etdm",
    name: "Entrepreneurship Team Decision Making",
    code: "ETDM",
    cluster: "entrepreneurship",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests two-person teams on their ability to collaboratively solve an entrepreneurship case study and present actionable recommendations.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-Guidelines.pdf",
  },
  {
    id: "for",
    name: "Finance Operations Research",
    code: "FOR",
    cluster: "finance",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Requires participants to investigate a finance operations problem within a real organization and present data-supported solutions.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-Guidelines.pdf",
  },
  {
    id: "fce",
    name: "Financial Consulting",
    code: "FCE",
    cluster: "finance",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Assesses participants' ability to provide professional financial consulting advice in a simulated client interaction role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-Guidelines.pdf",
  },
  {
    id: "pmfl",
    name: "Financial Literacy Project",
    code: "PMFL",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to develop and deliver a project that teaches financial literacy skills to a target audience in their community.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMFL-Guidelines.pdf",
  },
  {
    id: "ftdm",
    name: "Financial Services Team Decision Making",
    code: "FTDM",
    cluster: "finance",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Challenges two-person teams to analyze a financial services case study and recommend strategic solutions in a timed presentation.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-Guidelines.pdf",
  },
  {
    id: "fms",
    name: "Food Marketing Series",
    code: "FMS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants' knowledge of marketing principles applied to the food industry through a written exam and role play scenario.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-Guidelines.pdf",
  },
  {
    id: "efb",
    name: "Franchise Business Plan",
    code: "EFB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to create a comprehensive business plan for launching a new franchise location, including financial projections.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-EFB-Guidelines.pdf",
  },
  {
    id: "htdm",
    name: "Hospitality Services Team Decision Making",
    code: "HTDM",
    cluster: "hospitality",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests two-person teams' ability to analyze hospitality services case studies and develop strategic responses under time constraints.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-Guidelines.pdf",
  },
  {
    id: "htor",
    name: "Hospitality and Tourism Operations Research",
    code: "HTOR",
    cluster: "hospitality",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Requires participants to research an operational challenge within the hospitality and tourism industry and present findings with recommendations.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-Guidelines.pdf",
  },
  {
    id: "htps",
    name: "Hospitality and Tourism Professional Selling",
    code: "HTPS",
    cluster: "hospitality",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 20,
    hasExam: true,
    overview:
      "Assesses participants' ability to execute a professional sales presentation for a hospitality or tourism product or service.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-Guidelines.pdf",
  },
  {
    id: "hlm",
    name: "Hotel and Lodging Management Series",
    code: "HLM",
    cluster: "hospitality",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Evaluates participants' knowledge of hotel and lodging management principles through a written exam and realistic role play scenario.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-Guidelines.pdf",
  },
  {
    id: "hrm",
    name: "Human Resources Management Series",
    code: "HRM",
    cluster: "business-mgmt",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants' understanding of human resources management practices including staffing, training, and employee relations.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-Guidelines.pdf",
  },
  {
    id: "eib",
    name: "Independent Business Plan",
    code: "EIB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to develop a full business plan for a new independent business venture, from concept through financial projections.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-EIB-Guidelines.pdf",
  },
  {
    id: "eip",
    name: "Innovation Plan",
    code: "EIP",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to identify an unmet need and create a detailed plan for an innovative product, service, or process solution.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-EIP-Guidelines.pdf",
  },
  {
    id: "imce",
    name: "Integrated Marketing Campaign-Event",
    code: "IMCE",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to develop a comprehensive, multi-channel marketing campaign plan promoting a specific event.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCE-Guidelines.pdf",
  },
  {
    id: "imcp",
    name: "Integrated Marketing Campaign-Product",
    code: "IMCP",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to design an integrated marketing campaign across multiple channels for a consumer product.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCP-Guidelines.pdf",
  },
  {
    id: "imcs",
    name: "Integrated Marketing Campaign-Service",
    code: "IMCS",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to create an integrated multi-channel marketing campaign for a service-based business or organization.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCS-Guidelines.pdf",
  },
  {
    id: "ibp",
    name: "International Business Plan",
    code: "IBP",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to create a strategic plan for entering an international market with a product or service, addressing global business considerations.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-IBP-Guidelines.pdf",
  },
  {
    id: "mcs",
    name: "Marketing Communications Series",
    code: "MCS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants' proficiency in marketing communications strategies including advertising, public relations, and digital media.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-Guidelines.pdf",
  },
  {
    id: "mtdm",
    name: "Marketing Management Team Decision Making",
    code: "MTDM",
    cluster: "marketing",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Challenges two-person teams to collaboratively analyze a marketing management case and develop strategic recommendations within a time limit.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-Guidelines.pdf",
  },
  {
    id: "pfl",
    name: "Personal Financial Literacy",
    code: "PFL",
    cluster: "personal-finance",
    category: "Personal Financial Literacy",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Assesses participants' knowledge of personal finance topics including budgeting, saving, investing, and managing credit through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-Guidelines.pdf",
  },
  {
    id: "pbm",
    name: "Principles of Business Management and Administration",
    code: "PBM",
    cluster: "business-mgmt",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Introduces participants to foundational business management and administration concepts through an introductory exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-Guidelines.pdf",
  },
  {
    id: "pen",
    name: "Principles of Entrepreneurship",
    code: "PEN",
    cluster: "entrepreneurship",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Introduces participants to core entrepreneurship concepts, including opportunity recognition and basic business planning, through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-Guidelines.pdf",
  },
  {
    id: "pfn",
    name: "Principles of Finance",
    code: "PFN",
    cluster: "finance",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests foundational knowledge of finance concepts including basic accounting, financial statements, and investment principles.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-Guidelines.pdf",
  },
  {
    id: "pht",
    name: "Principles of Hospitality and Tourism",
    code: "PHT",
    cluster: "hospitality",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Introduces participants to the foundational concepts of the hospitality and tourism industry through an introductory exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-Guidelines.pdf",
  },
  {
    id: "pmk",
    name: "Principles of Marketing",
    code: "PMK",
    cluster: "marketing",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants on introductory marketing concepts including the four Ps, market research, and consumer behavior fundamentals.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-Guidelines.pdf",
  },
  {
    id: "pse",
    name: "Professional Selling",
    code: "PSE",
    cluster: "marketing",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 20,
    hasExam: true,
    overview:
      "Assesses participants' ability to conduct a professional sales presentation, demonstrating prospecting, needs assessment, and closing skills.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-Guidelines.pdf",
  },
  {
    id: "qsrm",
    name: "Quick Serve Restaurant Management Series",
    code: "QSRM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants' knowledge of operations, marketing, and management principles specific to the quick service restaurant industry.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-Guidelines.pdf",
  },
  {
    id: "rfsm",
    name: "Restaurant and Food Service Management Series",
    code: "RFSM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Evaluates participants' knowledge of restaurant and food service management, covering operations, marketing, and customer service.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-Guidelines.pdf",
  },
  {
    id: "rms",
    name: "Retail Merchandising Series",
    code: "RMS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests participants on retail merchandising concepts including product placement, inventory management, and visual merchandising strategies.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-Guidelines.pdf",
  },
  {
    id: "pmsp",
    name: "Sales Project",
    code: "PMSP",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Challenges participants to plan and execute a sales project for a product or service, tracking results and presenting outcomes.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-PMSP-Guidelines.pdf",
  },
  {
    id: "seor",
    name: "Sports and Entertainment Marketing Operations Research",
    code: "SEOR",
    cluster: "marketing",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Requires participants to research an operations challenge within a sports or entertainment marketing organization and propose solutions.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-Guidelines.pdf",
  },
  {
    id: "sem",
    name: "Sports and Entertainment Marketing Series",
    code: "SEM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Evaluates participants' ability to apply marketing principles within the sports and entertainment industry through an exam and role play.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-Guidelines.pdf",
  },
  {
    id: "stdm",
    name: "Sports and Entertainment Marketing Team Decision Making",
    code: "STDM",
    cluster: "marketing",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Tests two-person teams on their ability to analyze a sports or entertainment marketing case and present strategic recommendations.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-Guidelines.pdf",
  },
  {
    id: "esb",
    name: "Start-Up Business Plan",
    code: "ESB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview:
      "Requires participants to develop a concise business plan for a new start-up venture, covering concept, market, and initial financials.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-ESB-Guidelines.pdf",
  },
  {
    id: "smg",
    name: "Stock Market Game",
    code: "SMG",
    cluster: "finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Challenges participants to manage a virtual stock portfolio over a set period, demonstrating investment research and decision-making skills.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-SMG-Guidelines.pdf",
  },
  {
    id: "ttdm",
    name: "Travel and Tourism Team Decision Making",
    code: "TTDM",
    cluster: "hospitality",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview:
      "Challenges two-person teams to analyze a travel and tourism case study and deliver strategic recommendations to a panel of judges.",
    officialPiPdfUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-PIs.pdf",
    officialSampleExamUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-Sample-Exam.pdf",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-Guidelines.pdf",
  },
  {
    id: "vbcac",
    name: "Virtual Business Challenge-Accounting",
    code: "VBCAC",
    cluster: "finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Challenges participants to apply accounting knowledge in a simulated virtual business environment to maximize performance metrics.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCAC-Guidelines.pdf",
  },
  {
    id: "vbcen",
    name: "Virtual Business Challenge-Entrepreneurship",
    code: "VBCEN",
    cluster: "entrepreneurship",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Requires participants to apply entrepreneurship concepts in a virtual business simulation, making decisions to grow a startup.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCEN-Guidelines.pdf",
  },
  {
    id: "vbcfa",
    name: "Virtual Business Challenge-Fashion",
    code: "VBCFA",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Tests participants' ability to manage a virtual fashion retail business, applying merchandising and marketing strategies to drive sales.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCFA-Guidelines.pdf",
  },
  {
    id: "vbchm",
    name: "Virtual Business Challenge-Hotel Management",
    code: "VBCHM",
    cluster: "hospitality",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Challenges participants to manage a virtual hotel, making operational and marketing decisions to optimize occupancy and revenue.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCHM-Guidelines.pdf",
  },
  {
    id: "vbcpf",
    name: "Virtual Business Challenge-Personal Finance",
    code: "VBCPF",
    cluster: "personal-finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Tests participants' personal finance decision-making skills in a virtual simulation covering budgeting, saving, and investing.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCPF-Guidelines.pdf",
  },
  {
    id: "vbcrs",
    name: "Virtual Business Challenge-Restaurant",
    code: "VBCRS",
    cluster: "hospitality",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Requires participants to operate a virtual restaurant, making management and marketing decisions to maximize profitability.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCRS-Guidelines.pdf",
  },
  {
    id: "vbcrt",
    name: "Virtual Business Challenge-Retail",
    code: "VBCRT",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Challenges participants to manage a virtual retail store, applying merchandising and marketing strategies to drive performance.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCRT-Guidelines.pdf",
  },
  {
    id: "vbcsp",
    name: "Virtual Business Challenge-Sports",
    code: "VBCSP",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview:
      "Tests participants' ability to manage a virtual sports franchise, applying marketing and business management decisions to achieve success.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl:
      "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCSP-Guidelines.pdf",
  },
];
