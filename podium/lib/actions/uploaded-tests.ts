"use server";

export interface UploadedQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  questionNumber?: number;
}

export interface UploadedTest {
  id: string;
  name: string;
  createdAt: string;
  questionCount: number;
}
