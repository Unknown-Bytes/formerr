import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { form, section, question, option, response, answer } from '@/db/schema';

// Database Models
export type Form = InferSelectModel<typeof form>;
export type NewForm = InferInsertModel<typeof form>;
export type Section = InferSelectModel<typeof section>;
export type NewSection = InferInsertModel<typeof section>;
export type Question = InferSelectModel<typeof question>;
export type NewQuestion = InferInsertModel<typeof question>;
export type Option = InferSelectModel<typeof option>;
export type NewOption = InferInsertModel<typeof option>;
export type Response = InferSelectModel<typeof response>;
export type NewResponse = InferInsertModel<typeof response>;
export type Answer = InferSelectModel<typeof answer>;
export type NewAnswer = InferInsertModel<typeof answer>;

// Extended Types for Frontend
export type FormWithRelations = Form & {
  sections: (Section & {
    questions: (Question & {
      options: Option[];
    })[];
  })[];
  _count: {
    responses: number;
    views: number;
  };
};

export type QuestionWithOptions = Question & {
  options: Option[];
};

export type SectionWithQuestions = Section & {
  questions: QuestionWithOptions[];
};

// Form Creation Types
export type CreateFormData = {
  title: string;
  description?: string;
  isPrivate: boolean;
  maxResponses: number;
  allowedEmails: string[];
  thankYouMessage?: string;
  redirectUrl?: string;
  emailNotifications: boolean;
  webhookUrl?: string;
  passwordProtected: boolean;
  formPassword?: string;
  ownerId: string;
};

export type CreateSectionData = {
  title: string;
  description?: string;
  order: number;
  formId: string;
};

export type CreateQuestionData = {
  title: string;
  description?: string;
  type: string;
  required: boolean;
  order: number;
  sectionId: string;
  options?: { label: string; order: number }[];
};

// Analytics Types
export type FormStats = {
  views: number;
  responses: number;
  conversionRate: number;
  avgCompletionTime: string;
  dailyResponses: { date: string; responses: number }[];
};