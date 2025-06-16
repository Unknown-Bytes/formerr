import { pgTable, uuid, integer, text, uniqueIndex, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: integer('github_id').notNull().unique(),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
  return {
    githubIdIdx: uniqueIndex('github_id_index').on(table.githubId),
  };
});

export const form = pgTable('form', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull(), // Removed foreign key reference
  title: text('title').notNull(),
  description: text('description'),
  
  // Configurações de visibilidade e acesso
  isPrivate: boolean('is_private').default(false),
  maxResponses: integer('max_responses').default(0),
  allowedEmails: text('allowed_emails').array(),
  
  // Configurações avançadas
  passwordProtected: boolean('password_protected').default(false),
  formPassword: text('form_password'),
  expiresAt: timestamp('expires_at'),
  
  // Configurações de resposta
  thankYouMessage: text('thank_you_message').default('Obrigado por responder nosso formulário!'),
  redirectUrl: text('redirect_url'),
  allowAnonymous: boolean('allow_anonymous').default(true),
  
  // Configurações de notificações
  emailNotifications: boolean('email_notifications').default(true),
  webhookUrl: text('webhook_url'),
  
  // Status do formulário
  status: text('status').notNull().default('draft'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at'),
});

export const section = pgTable('section', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull(), // Removed foreign key reference
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const question = pgTable('question', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectionId: uuid('section_id').notNull(), // Removed foreign key reference
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  required: boolean('required').default(false),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const option = pgTable('option', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').notNull(), // Removed foreign key reference
  label: text('label').notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

export const response = pgTable('response', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull(), // Removed foreign key reference
  userId: uuid('user_id'), // Removed foreign key reference
  
  // Metadados da resposta
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  completionTime: integer('completion_time'),
  
  // Timestamps
  startedAt: timestamp('started_at').defaultNow(),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const answer = pgTable('answer', {
  id: uuid('id').defaultRandom().primaryKey(),
  responseId: uuid('response_id').notNull(), // Removed foreign key reference
  questionId: uuid('question_id').notNull(), // Removed foreign key reference
  optionId: uuid('option_id'), // Removed foreign key reference
  textAnswer: text('text_answer'),
  createdAt: timestamp('created_at').defaultNow()
});

// Nova tabela para analytics/estatísticas
export const formAnalytics = pgTable('form_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull(), // Removed foreign key reference
  date: text('date').notNull(),
  views: integer('views').default(0),
  startedResponses: integer('started_responses').default(0),
  completedResponses: integer('completed_responses').default(0),
  avgCompletionTime: integer('avg_completion_time').default(0),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    formDateIdx: uniqueIndex('form_date_idx').on(table.formId, table.date),
  };
});

// Tabela para compartilhamentos/links únicos
export const formShare = pgTable('form_share', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull(), // Removed foreign key reference
  shareToken: text('share_token').notNull().unique(),
  type: text('type').notNull(),
  expiresAt: timestamp('expires_at'),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  createdBy: uuid('created_by').notNull(), // Removed foreign key reference
  createdAt: timestamp('created_at').defaultNow()
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(), // Removed foreign key reference
  expiresAt: integer('expires_at').notNull(),
});

// Keep relations for Drizzle query API (these are just for TypeScript, not database constraints)
export const userRelations = relations(user, ({ many }) => ({
  forms: many(form),
  sessions: many(session),
}));

export const formRelations = relations(form, ({ one, many }) => ({
  owner: one(user, {
    fields: [form.ownerId],
    references: [user.id],
  }),
  sections: many(section),
  responses: many(response),
  analytics: many(formAnalytics),
  shares: many(formShare),
}));

export const sectionRelations = relations(section, ({ one, many }) => ({
  form: one(form, {
    fields: [section.formId],
    references: [form.id],
  }),
  questions: many(question),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  section: one(section, {
    fields: [question.sectionId],
    references: [section.id],
  }),
  options: many(option),
  answers: many(answer),
}));

export const optionRelations = relations(option, ({ one, many }) => ({
  question: one(question, {
    fields: [option.questionId],
    references: [question.id],
  }),
  answers: many(answer),
}));

export const responseRelations = relations(response, ({ one, many }) => ({
  form: one(form, {
    fields: [response.formId],
    references: [form.id],
  }),
  user: one(user, {
    fields: [response.userId],
    references: [user.id],
  }),
  answers: many(answer),
}));

export const answerRelations = relations(answer, ({ one }) => ({
  response: one(response, {
    fields: [answer.responseId],
    references: [response.id],
  }),
  question: one(question, {
    fields: [answer.questionId],
    references: [question.id],
  }),
  option: one(option, {
    fields: [answer.optionId],
    references: [option.id],
  }),
}));

export const formAnalyticsRelations = relations(formAnalytics, ({ one }) => ({
  form: one(form, {
    fields: [formAnalytics.formId],
    references: [form.id],
  }),
}));

export const formShareRelations = relations(formShare, ({ one }) => ({
  form: one(form, {
    fields: [formShare.formId],
    references: [form.id],
  }),
  creator: one(user, {
    fields: [formShare.createdBy],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));