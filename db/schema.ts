import { pgTable, uuid, integer, text, uniqueIndex, primaryKey, jsonb } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(), // PK como UUID gerado automaticamente
  githubId: integer('github_id').notNull().unique(), // UNIQUE
  email: text('email').notNull().unique(), // UNIQUE
  username: text('username').notNull(), // NOT NULL
  name: text('name').notNull()
}, (table) => {
  return {
    // Criando um índice no `githubId`
    githubIdIdx: uniqueIndex('github_id_index').on(table.githubId),
  };
});

export const form = pgTable('form', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => user.id),
  title: text('title').notNull(),
  description: text('description'),
  isPublic: integer('is_public').default(1),
  status: text('status').notNull().default('draft'), // draft, active, paused, archived
  expireAt: integer('expire_at'),
  allowAnonymous: integer('allow_anonymous').default(1),
  customThankYou: text('custom_thank_you'),
  customConfirmationPage: text('custom_confirmation_page'),
  redirectUrl: text('redirect_url'),
  passwordProtected: integer('password_protected').default(0),
  formPassword: text('form_password'),
  emailNotifications: integer('email_notifications').default(1),
  webhookUrl: text('webhook_url'),
  publishedAt: integer('published_at'),
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updated_at').default(Math.floor(Date.now() / 1000))
});

export const section = pgTable('section', {
  id: uuid('id').defaultRandom().primaryKey(), 
  formId: uuid('form_id').notNull().references(() => form.id),
  title: text('title').notNull(), 
  description: text('description'),
  order: integer('order').notNull()
});

export const response = pgTable('response', {
  id: uuid('id').defaultRandom().primaryKey(), 
  formId: uuid('form_id').notNull().references(() => form.id),
  userId: uuid('user_id').references(() => user.id),
  submittedAt: integer('submitted_at').default(Math.floor(Date.now() / 1000))
});

export const answer = pgTable('answer', {
  id: uuid('id').defaultRandom().primaryKey(), 
  responseId: uuid('response_id').notNull().references(() => response.id),
  questionId: uuid('question_id').notNull().references(() => question.id),
  optionId: uuid('option_id').references(() => option.id),
  answer: text('answer')
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(), // PK como UUID gerado automaticamente
  userId: uuid('user_id').notNull().references(() => user.id), // Foreign key para `user(id)`
  expiresAt: integer('expires_at').notNull(), // NOT NULL
});

export const question = pgTable('question', {
  id: uuid('id').defaultRandom().primaryKey(), 
  sectionId: uuid('section_id').notNull().references(() => section.id),
  label: text('label').notNull(), 
  type: text('type').notNull(), // short-text, paragraph, multiple-choice-single, multiple-choice-multiple, dropdown, date, time, datetime, rating
  required: integer('required').default(1),
  order: integer('order').notNull()
});

// A tabela "options" permanecerá como está:
export const option = pgTable('option', {
  id: uuid('id').defaultRandom().primaryKey(), 
  questionId: uuid('question_id').notNull().references(() => question.id),
  label: text('label').notNull()
});

// Analytics table for form events
export const formAnalytics = pgTable('form_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull().references(() => form.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(), // view, share, submit, etc.
  eventData: jsonb('event_data'), // JSON data specific to the event
  timestamp: integer('timestamp').notNull().default(Math.floor(Date.now() / 1000))
});
