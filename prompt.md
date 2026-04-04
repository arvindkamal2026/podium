PODIUM — Master Build Prompt

Project Overview
Build "Podium" — a full-stack DECA prep web app built by a competitor, for competitors. Think of it as the DECA version of OnePrep.xyz. The goal is to eliminate guesswork before competition by giving every DECA member a personalized dashboard, AI-powered role play coaching, PI mastery tracking, vocab flashcards, and AI-generated practice exams — all tied to their specific event. The app is public-facing, free to use, and designed to look and feel like a legitimate professional product — not a school project.

Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + Shadcn/ui
- Database + Auth: firebase (email/password + Google OAuth)
- AI: Anthropic Claude API (claude-sonnet-4-6)
- Font: Geist by Vercel — install via npm install geist, use GeistSans variable font. No Google Fonts needed.
- Deployment: Vercel

Design System
Theme: Dark mode only

- Background: #0f0f0f
- Surface cards: #161616
- Border: #2a2a2a
- Primary accent: #3b82f6 (electric blue)
- Secondary accent: #f59e0b (gold — achievements + streaks)
- Success/Mastered: #22c55e (green)
- Warning/Learning: #f59e0b (yellow)
- Danger/Untested: #ef4444 (red)
- Body text: #f0f0f0
- Muted text: #a0a0a0
  Typography — Geist throughout:
- Headings: Geist Black (900) — letter-spacing: -0.03em
- Subheadings: Geist Bold (700)
- Labels / caps: Geist SemiBold (600) — letter-spacing: +0.06em
- Body: Geist Regular (400)
- Captions: Geist Light (300)
  Layout: Fixed top nav + left sidebar (220px) for all app pages. Marketing landing page is full-width with no sidebar.
  Aesthetic reference: OnePrep.xyz — clean, modern, card-based, confident. Every page must have a clear "what do I do next" action. Nothing should look like a school project.

Environment Variables
NEXT_PUBLIC_firebase_URL=
NEXT_PUBLIC_firebase_ANON_KEY=
firebase_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=

Database Schema (firebase)
users id, name, school, cluster, event_id, competition_date, competition_level (districts/state/icdc), streak, last_active, created_at
events id, name, code, cluster, category, participants, prep_time_mins, interview_time_mins, has_exam, overview, official_pi_pdf_url, official_sample_exam_url, official_guidelines_url
performance_indicators id, event_id, cluster, code, text, category, difficulty (high/medium/low frequency)
pi_progress id, user_id, pi_id, times_tested, times_correct, mastery_status (untested/learning/mastered), last_tested
vocab_words id, cluster, term, definition, example_sentence
vocab_progress id, user_id, vocab_id, times_seen, times_correct, mastery_status, last_seen
practice_exams id, cluster, event_id, question, option_a, option_b, option_c, option_d, correct_answer, pi_id, difficulty, explanation
exam_attempts id, user_id, event_id, score, total_questions, date_taken, time_spent_secs
exam_answers id, attempt_id, question_id, user_answer, is_correct, pi_id
roleplay_scenarios id, event_id, cluster, title, scenario_text, topic_area, year, source (ai_generated / official_inspired), pi_ids (array)
roleplay_attempts id, user_id, scenario_id, user_response, overall_score, pi_scores (JSON), ai_feedback (JSON), date_taken
streaks id, user_id, current_streak, longest_streak, last_activity_date

Data Setup
Create a /data folder in the project root with subfolders per cluster:
/data
/marketing
/finance
/business-mgmt
/hospitality
/entrepreneurship
/personal-finance
PDFs dropped into these folders (vocab lists, supplementary materials) will be parsed by a seeding script on first run and loaded into the database. PI data and event data should be hardcoded in /data/seed.ts since PIs come from official DECA documents and won't change often.

Events Seed Data
Seed the events table with all 59 official DECA competitive events:
Name Code Category
Accounting Applications Series ACT Individual Series
Apparel and Accessories Marketing Series AAM Individual Series
Automotive Services Marketing Series ASM Individual Series
Business Finance Series BFS Individual Series
Business Growth Plan EBG Entrepreneurship
Business Law and Ethics Team Decision Making BLTDM Team Decision Making
Business Services Marketing Series BSM Individual Series
Business Services Operations Research BOR Business Operations Research
Business Solutions Project PMBS Project Management
Buying and Merchandising Operations Research BMOR Business Operations Research
Buying and Merchandising Team Decision Making BTDM Team Decision Making
Career Development Project PMCD Project Management
Community Awareness Project PMCA Project Management
Community Giving Project PMCG Project Management
Entrepreneurship Series ENT Individual Series
Entrepreneurship Team Decision Making ETDM Team Decision Making
Finance Operations Research FOR Business Operations Research
Financial Consulting FCE Professional Selling and Consulting
Financial Literacy Project PMFL Project Management
Financial Services Team Decision Making FTDM Team Decision Making
Food Marketing Series FMS Individual Series
Franchise Business Plan EFB Entrepreneurship
Hospitality Services Team Decision Making HTDM Team Decision Making
Hospitality and Tourism Operations Research HTOR Business Operations Research
Hospitality and Tourism Professional Selling HTPS Professional Selling and Consulting
Hotel and Lodging Management Series HLM Individual Series
Human Resources Management Series HRM Individual Series
Independent Business Plan EIB Entrepreneurship
Innovation Plan EIP Entrepreneurship
Integrated Marketing Campaign-Event IMCE Integrated Marketing Campaign
Integrated Marketing Campaign-Product IMCP Integrated Marketing Campaign
Integrated Marketing Campaign-Service IMCS Integrated Marketing Campaign
International Business Plan IBP Entrepreneurship
Marketing Communications Series MCS Individual Series
Marketing Management Team Decision Making MTDM Team Decision Making
Personal Financial Literacy PFL Personal Financial Literacy
Principles of Business Management and Administration PBM Principles of Business Administration
Principles of Entrepreneurship PEN Principles of Business Administration
Principles of Finance PFN Principles of Business Administration
Principles of Hospitality and Tourism PHT Principles of Business Administration
Principles of Marketing PMK Principles of Business Administration
Professional Selling PSE Professional Selling and Consulting
Quick Serve Restaurant Management Series QSRM Individual Series
Restaurant and Food Service Management Series RFSM Individual Series
Retail Merchandising Series RMS Individual Series
Sales Project PMSP Project Management
Sports and Entertainment Marketing Operations Research SEOR Business Operations Research
Sports and Entertainment Marketing Series SEM Individual Series
Sports and Entertainment Marketing Team Decision Making STDM Team Decision Making
Start-Up Business Plan ESB Entrepreneurship
Stock Market Game SMG Online Events
Travel and Tourism Team Decision Making TTDM Team Decision Making
Virtual Business Challenge-Accounting VBCAC Online Events
Virtual Business Challenge-Entrepreneurship VBCEN Online Events
Virtual Business Challenge-Fashion VBCFA Online Events
Virtual Business Challenge-Hotel Management VBCHM Online Events
Virtual Business Challenge-Personal Finance VBCPF Online Events
Virtual Business Challenge-Restaurant VBCRS Online Events
Virtual Business Challenge-Retail VBCRT Online Events
Virtual Business Challenge-Sports VBCSP Online Events
Each event also needs these fields seeded: cluster, participants (1 / 2 / 1-3), has_exam (boolean), official_pi_pdf_url, official_sample_exam_url, official_guidelines_url — all linking directly to deca.org. Never host DECA PDFs locally.

Onboarding Flow
First-time login triggers a 4-step onboarding modal before the user reaches their dashboard. All responses saved to the users table.
Step 1 — Personal info Fields: First name, Last name, School name Headline: "Let's set up your profile"
Step 2 — Cluster selection Headline: "Which career cluster are you in?" Display as a 2x3 grid of large clickable icon cards:

- ￼
-  Business Management & Administration
- ￼
-  Entrepreneurship
- ￼
-  Finance
- ￼
-  Hospitality & Tourism
- ￼
-  Marketing
- ￼
-  Personal Financial Literacy
  Step 3 — Event selection Headline: "Which event are you competing in?" Show a filtered list of events based on the cluster selected in Step 2. Display event code + full name. User selects one primary event.
  Step 4 — Competition date Headline: "When is your next competition?" Date picker + competition level selector: Districts / State / ICDC This powers the countdown timer on the dashboard.
  On completion → redirect to dashboard with welcome message: "You're all set, [first name]. Let's get you to the podium."

Pages

1. Landing Page ( / )
   Public-facing marketing page. Full-width, no sidebar.
   Sections in order:

- Nav: Logo (Podium), links (Features, Events, About), CTA button "Get Started Free"
- Hero: Headline: "Your DECA edge starts here." Subheadline: "The only free platform built for DECA competitors — PI tracking, AI role play coaching, vocab flashcards, and practice exams for every event." Two CTAs: "Get Started Free" + "See How It Works"
- Stats bar: "59 events covered · 200+ PIs tracked · AI-powered role play coaching · 100% free"
- Feature highlights (3 cards):
  - ￼
  -  PI Tracker — "Know exactly which PIs you've mastered and which need work. Zero guesswork before competition."
  - ￼
  -  AI Role Play Coach — "Get scored on every PI after every practice. Specific feedback, not generic advice."
  - ￼
  -  Practice Exams — "ICDC-difficulty questions generated for your specific event, with AI explanations on every wrong answer."
- How it works (3 steps): Create account → Select your event → Start practicing
- Cluster grid: All 6 clusters with event counts
- Social proof: Placeholder testimonial cards (3 slots with dummy data)
- Final CTA banner: "Built by a DECA competitor. Free for every DECA competitor." + "Get Started Free" button
- Footer: Links + legal disclaimer (see Legal section below)

2. Dashboard ( /home )
   Personalized to the user's specific event from day one.
   Components:

- Competition countdown: Large prominent display — "47 days until Districts" based on entered competition date. Geist Black, electric blue color.
- PI Mastery ring: Circular progress chart — "12 of 43 PIs mastered" for their specific event. Green = mastered, yellow = learning, red = untested.
- Streak tracker: Current streak in days, longest streak, last active date.
- Quick action cards (3): Practice Exam / Role Play Coach / Study Vocab — each links directly to that feature filtered to the user's event.
- Recent activity feed: Last 5 sessions (exam attempts, role play sessions, vocab sessions) with scores and dates.
- Weekly goal: "Complete 3 practice sessions this week" with a progress bar. Resets every Monday.

3. Events Hub ( /events )
   Browse all 59 DECA events.

- Filter bar: by cluster, by category (Individual Series, TDM, Prepared, Entrepreneurship, Online)
- Each event shown as a card: event name, code badge, cluster color tag, category badge, participant count
- User's own event is pinned to the top and highlighted with a "Your Event" badge
- Clicking any event card navigates to its detail page

4. Event Detail Page ( /events/[slug] )
   One page per event. The complete hub for that event.
   Sections:

- Header: Event name, code, cluster badge, category badge, format grid (participants, prep time, interview time, exam)
- PI List: Every PI for this event as interactive cards. Each card shows: PI text, category, difficulty badge (high/medium/low frequency), and mastery status for logged-in users (untested/learning/mastered). Below the PI list: "Performance Indicators sourced from DECA Inc.'s official guidelines. [View official PDF →]" linking to deca.org.
- Strategy Tips: 5–8 original, event-specific tips written from scratch. Not copied from DECA.
- Official Resources: Links only — never hosted locally:
  - Official Guidelines PDF (deca.org)
  - Official Sample Role Play PDF (deca.org)
  - Official Exam Blueprint PDF (deca.org)
- Quick action buttons: Practice Exam / Role Play Coach / Study Vocab — all pre-filtered to this event

5. Vocab Flashcards ( /vocab )

- Filter by cluster or specific event
- Three study modes: Flashcard (flip animation) / Multiple Choice / Type the Answer
- Progress tracked per word via vocab_progress table: unseen / learning / mastered
- Progress bar per cluster showing percentage mastered
- Spaced repetition — words marked incorrect are shown more frequently
- Citation footer on every page: "Vocabulary aligned with DECA Inc. curriculum standards."

6. Exam Practice ( /exams )
   Legal note: All questions are 100% original AI-generated content. Never reproduce official DECA exam questions verbatim. Label all exams: "Podium Practice Exam — ICDC Difficulty. Original content, not affiliated with DECA Inc."
   Flow:

- User selects their event → timed exam launches (100 questions, 90 minutes — matching ICDC format)
- Multiple choice A/B/C/D
- Each question tagged to a specific PI in the database
- On wrong answer: AI explanation via Claude API — why the correct answer is right, why the user's answer is wrong, using cluster domain knowledge. Under 100 words. Conversational tone.
- On completion: score + breakdown by PI category showing which areas are weak
- Results saved to exam_attempts + exam_answers tables
- PI progress table auto-updated based on answers — a PI moves toward "mastered" as the user answers it correctly repeatedly
- Bottom of results page: "Want to see an official sample exam? [View DECA's official sample →]" linking to deca.org

7. Role Play Coach ( /roleplay )
   Flow:

- User selects their event → random scenario served from roleplay_scenarios table
- Scenario displayed with: business context, user's role, what the judge wants
- 30-minute countdown timer matching real competition format
- Large text area for user to type their full response
- Submit → Claude API scores the response
  AI scoring prompt: Given this DECA [event name] scenario and the user's response, score the response on each of the following PIs (list them) on a 1–5 scale with specific written feedback per PI. Also score: professionalism (1–5), structure (1–5), and clarity (1–5). Return a JSON object with: pi_scores (object — PI code as key, score and feedback string as values), overall_score (0–100), strengths (array of strings), improvements (array of strings), summary (string, 2–3 sentences).
  Results displayed as a scorecard:
- Each PI row: score (1–5 stars) + written feedback
- Color coded: 4–5 = green, 3 = yellow, 1–2 = red
- Overall score out of 100
- Strengths section + What to Improve section
- Scores saved to roleplay_attempts, PI progress updated
  Legal note: All scenarios are original AI-generated content modeled after DECA format. Not verbatim copies of official DECA role plays. Label: "Podium practice scenario — modeled after DECA [event name] format. Not affiliated with DECA Inc." Link to official sample at bottom: "See an official DECA sample role play → [deca.org]"

8. PI Tracker ( /pi-tracker )
   The hero feature. A full command center for the user's event PIs.
   Layout:

- Summary bar at top: Total PIs · Mastered (green) · Learning (yellow) · Untested (red) · Overall mastery %
- Radial/circular mastery chart — visual representation of overall PI mastery
- Filter bar: Filter by mastery status / PI category / keyword search
- PI list: Every PI for the user's event as a row/card showing:
  - PI text
  - Category/domain badge
  - Mastery badge: 
  - ￼
  -  Untested / 
  - ￼
  -  Learning / 
  - ￼
  -  Mastered
  - Times tested (exams + role plays combined)
  - Times correct
  - Last tested date
  - "Practice this PI" button → launches a 5-question mini-exam targeting only that PI
- Mastery logic: A PI becomes "Learning" after being tested once. It becomes "Mastered" after being answered correctly 3+ times. It drops back to "Learning" if answered incorrectly after mastery.
- Export button: "Download my PI report" → generates a PDF summary of all PI statuses
- Citation at bottom: "Performance Indicators sourced from DECA Inc.'s official guidelines. [View official PDF →]"

9. Profile + Settings ( /profile )

- Edit name, school, cluster, event, competition date
- View streak history and all-time stats
- Account settings: email, password change
- Danger zone: delete account (with confirmation)

AI Features (Claude API — claude-sonnet-4-6)

1. Exam wrong-answer explainer Triggered on every incorrect answer. Prompt: given the question, correct answer, user's answer, and the PI it tests — explain in under 100 words why the correct answer is right and why the user's answer is wrong using [cluster] domain knowledge. Conversational, not robotic. No bullet points.
2. Role play scorer Triggered on role play submission. Full JSON response (see Role Play Coach section above for exact prompt structure).
3. PI study assistant A floating chat widget available on the PI Tracker and Event Detail pages. System prompt: "You are a DECA competition coach helping a student prepare for [event name] in the [cluster] cluster. Be specific, practical, and concise. When asked about a PI, explain it clearly and give a real example of how it shows up in a role play scenario." User can ask things like "explain this PI", "give me an example of PI X in a role play", "what's a common mistake on this PI."
4. AI question generation (seeding route) Admin-only route at /api/admin/generate-questions. When called, uses Claude to generate 100 original practice questions per event. Prompt: "Generate 100 original multiple choice questions for DECA's [event name] event at ICDC difficulty level. Each question must test one of these PIs: [list]. For each question return: question (string), option_a, option_b, option_c, option_d, correct_answer (a/b/c/d), pi_id, difficulty (easy/medium/hard), explanation (string, under 100 words). Return as a valid JSON array only. These are entirely original questions — do not reproduce any official DECA exam content."
5. AI role play scenario generation (seeding route) Admin-only route at /api/admin/generate-scenarios. Prompt: "Generate 10 original role play scenarios for DECA's [event name] event. Each scenario should follow the standard DECA format: business context, participant roles, and a specific task the judge wants addressed. Each scenario must be tied to at least 2 of these PIs: [list]. Return as a JSON array with: title, scenario_text, topic_area, pi_ids. These are entirely original scenarios — do not reproduce official DECA role play content."

Legal + Attribution Rules
Enforce these rules throughout the entire codebase — in UI labels, footer text, and code comments:

1. Never host DECA PDFs locally. Always link directly to deca.org.
2. All exam questions are original AI-generated content. Never reproduce official DECA exam questions. Label every practice exam: "Podium Practice Exam — ICDC Difficulty. Original content, not affiliated with DECA Inc."
3. All role play scenarios are original AI-generated content. Label every scenario: "Podium practice scenario — modeled after DECA [event name] format. Not affiliated with DECA Inc."
4. PI lists are always cited. Every page displaying PIs must show: "Performance Indicators sourced from DECA Inc.'s official guidelines. [View official PDF →]"
5. Vocab is always cited. Every vocab page must show: "Vocabulary aligned with DECA Inc. curriculum standards."
6. Sitewide footer on every page: "Podium is an independent student-built prep platform. Not affiliated with or endorsed by DECA Inc. DECA® is a registered trademark of DECA Inc."

First Run — Build Order
Build in this exact order:

1. Scaffold Next.js 14 app with Tailwind + Shadcn/ui + Geist font
2. Set up firebase — run all schema migrations
3. Set up auth (signup, login, Google OAuth, protected routes)
4. Build onboarding flow (4 steps, saves to users table)
5. Seed events table with all 59 events
6. Seed PI table for at least the 10 most popular events to start
7. Build Dashboard ( /home )
8. Build PI Tracker ( /pi-tracker )
9. Build Events Hub ( /events ) + Event Detail pages ( /events/[slug] )
10. Build Exam Practice ( /exams ) + AI wrong-answer explainer
11. Build Role Play Coach ( /roleplay ) + AI scorer
12. Build Vocab Flashcards ( /vocab )
13. Build Profile + Settings ( /profile )
14. Run AI seeding routes to generate questions and scenarios for all events
15. Build Landing page ( / ) last∞
16. Deploy to Vercel
∞