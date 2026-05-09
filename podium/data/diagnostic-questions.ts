export interface EventWeights {
  soloBonus?: number
  teamBonus?: number
  examBonus?: number
  noExamBonus?: number
  clusters?: Partial<Record<string, number>>
  categories?: Partial<Record<string, number>>
  shortInterviewBonus?: number
  longPrepBonus?: number
}

export interface DiagnosticOption {
  id: string
  label: string
  weights: EventWeights
}

export interface DiagnosticQuestion {
  id: string
  question: string
  options: DiagnosticOption[]
}

export interface DiagnosticAnswer {
  questionId: string
  optionId: string
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    question: "Do you prefer working alone, with a partner, or a small team?",
    options: [
      { id: "solo", label: "Alone", weights: { soloBonus: 4 } },
      { id: "partner", label: "With a partner (2 people)", weights: { teamBonus: 3 } },
      { id: "team", label: "Small team (up to 3)", weights: { teamBonus: 4 } },
    ],
  },
  {
    id: "q2",
    question: "How comfortable are you with a written multiple-choice exam?",
    options: [
      { id: "love_exam", label: "I love exams — they're where I shine", weights: { examBonus: 4 } },
      { id: "neutral_exam", label: "Neutral — I can do either", weights: { examBonus: 1, noExamBonus: 1 } },
      { id: "skip_exam", label: "I'd rather skip the written exam", weights: { noExamBonus: 4 } },
    ],
  },
  {
    id: "q3",
    question: "Which industry excites you most?",
    options: [
      { id: "finance", label: "Finance & Accounting", weights: { clusters: { finance: 5 } } },
      { id: "marketing", label: "Marketing & Sales", weights: { clusters: { marketing: 5 } } },
      { id: "business-mgmt", label: "Business Management & Admin", weights: { clusters: { "business-mgmt": 5 } } },
      { id: "hospitality", label: "Hospitality & Tourism", weights: { clusters: { hospitality: 5 } } },
      { id: "entrepreneurship", label: "Entrepreneurship & Innovation", weights: { clusters: { entrepreneurship: 5 } } },
      { id: "personal-finance", label: "Personal Finance & Investing", weights: { clusters: { "personal-finance": 5 } } },
    ],
  },
  {
    id: "q4",
    question: "What type of work do you enjoy most?",
    options: [
      {
        id: "numbers",
        label: "Analyzing numbers and data",
        weights: { clusters: { finance: 2, "personal-finance": 1 } },
      },
      {
        id: "creative",
        label: "Creative campaigns and strategy",
        weights: { clusters: { marketing: 2, entrepreneurship: 1 } },
      },
      {
        id: "research",
        label: "Researching a real business problem in depth",
        weights: { categories: { "Project Management": 3, "Business Operations Research": 3 } },
      },
      {
        id: "pressure",
        label: "Presenting quick solutions under pressure",
        weights: { categories: { "Individual Series": 2, "Team Decision Making": 2 }, shortInterviewBonus: 1 },
      },
    ],
  },
  {
    id: "q5",
    question: "How do you perform under time pressure?",
    options: [
      { id: "thrive", label: "I thrive — pressure brings out my best", weights: { shortInterviewBonus: 3 } },
      { id: "okay", label: "It's okay — I manage fine", weights: {} },
      { id: "more_time", label: "I prefer more time to prepare and think", weights: { longPrepBonus: 3 } },
    ],
  },
  {
    id: "q6",
    question: "What's your strongest skill?",
    options: [
      {
        id: "math",
        label: "Math and financial analysis",
        weights: { clusters: { finance: 2, "personal-finance": 1 } },
      },
      {
        id: "writing",
        label: "Writing and communication",
        weights: { categories: { "Project Management": 2, "Business Operations Research": 2 } },
      },
      {
        id: "creativity",
        label: "Creativity and design thinking",
        weights: { clusters: { marketing: 2, entrepreneurship: 1 } },
      },
      {
        id: "leadership",
        label: "Leadership and people management",
        weights: { clusters: { "business-mgmt": 2, hospitality: 1 } },
      },
    ],
  },
  {
    id: "q7",
    question: "During prep time, do you prefer to take notes or think it through mentally?",
    options: [
      {
        id: "notes",
        label: "Take notes — I like to organize on paper",
        weights: { longPrepBonus: 2, examBonus: 1 },
      },
      {
        id: "think",
        label: "Think it through — I work best mentally",
        weights: { shortInterviewBonus: 1 },
      },
      { id: "both", label: "Both equally", weights: {} },
    ],
  },
  {
    id: "q8",
    question: "What kind of competition format appeals to you?",
    options: [
      {
        id: "roleplay",
        label: "Role play — simulate a real business scenario with a judge",
        weights: { categories: { "Individual Series": 3 } },
      },
      {
        id: "research_project",
        label: "Research project — write a detailed written entry",
        weights: { categories: { "Project Management": 4, "Business Operations Research": 3 } },
      },
      {
        id: "team_decision",
        label: "Team decision making — solve a case study with teammates",
        weights: { categories: { "Team Decision Making": 4 } },
      },
    ],
  },
  {
    id: "q9",
    question: "How do you feel about presenting your ideas to judges?",
    options: [
      {
        id: "love_presenting",
        label: "I love it — I'm confident in front of people",
        weights: { categories: { "Individual Series": 2, "Team Decision Making": 1 } },
      },
      { id: "nervous_ok", label: "A little nervous, but I can handle it", weights: {} },
      {
        id: "very_anxious",
        label: "Very anxious — I prefer written or research formats",
        weights: { categories: { "Project Management": 2, "Business Operations Research": 2 }, longPrepBonus: 1 },
      },
    ],
  },
]
