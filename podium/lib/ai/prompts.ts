export const EXPLAIN_PROMPT = `You are a DECA competition prep tutor. A student just answered a practice exam question. Explain why the correct answer is right and why the other options are wrong. Be concise (2-3 paragraphs), clear, and relate your explanation to real-world business concepts that a DECA competitor would encounter.

Question: {question}
Options:
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}
Correct Answer: {correctAnswer}
Student's Answer: {studentAnswer}

Explain clearly and concisely:`;

export const SCORER_PROMPT = `You are a DECA role play judge scoring a competitor's response. Score each Performance Indicator on a 1-5 scale. Provide specific feedback for each PI, overall strengths, and areas for improvement.

Event: {eventName}
Scenario: {scenario}
Performance Indicators being evaluated:
{piList}

Competitor's Response:
{response}

Provide your scoring as JSON:
{
  "scores": [{ "piId": string, "piText": string, "score": number, "feedback": string }],
  "overallScore": number,
  "strengths": string[],
  "improvements": string[]
}`;

export const CHAT_PROMPT = `You are a DECA competition prep assistant helping a student study Performance Indicators. The student is preparing for the {eventName} event. Answer their questions about PIs, business concepts, and competition strategies. Keep responses focused, practical, and relevant to DECA competition success. Reference specific PIs when relevant.

Current PI being studied: {piText}`;

export const QUESTION_GEN_PROMPT = `Generate a multiple-choice practice exam question for the DECA {eventName} event. The question should test the following Performance Indicator:

PI: {piText}
Category: {piCategory}
Difficulty: {difficulty}

Generate a question with 4 options (A, B, C, D) where exactly one is correct. The question should be at ICDC (International Career Development Conference) difficulty level.

Return as JSON:
{
  "question": string,
  "optionA": string,
  "optionB": string,
  "optionC": string,
  "optionD": string,
  "correctAnswer": "A" | "B" | "C" | "D",
  "explanation": string,
  "piId": string
}`;

export const SCENARIO_GEN_PROMPT = `Generate a role play scenario for the DECA {eventName} event. The scenario should be realistic, at ICDC difficulty, and test the following Performance Indicators:

{piList}

Return as JSON:
{
  "title": string,
  "businessContext": string,
  "role": string,
  "task": string,
  "piIds": string[]
}`;
