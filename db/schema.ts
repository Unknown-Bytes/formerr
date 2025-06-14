import { pgTable, uuid, integer, text, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(), // PK como UUID gerado automaticamente
  githubId: integer('github_id').notNull().unique(), // UNIQUE
  email: text('email').notNull().unique(), // UNIQUE
  username: text('username').notNull(), // NOT NULL
}, (table) => {
  return {
    // Criando um índice no `githubId`
    githubIdIdx: uniqueIndex('github_id_index').on(table.githubId),
  };
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(), // PK como UUID gerado automaticamente
  userId: uuid('user_id').notNull().references(() => user.id), // Foreign key para `user(id)`
  expiresAt: integer('expires_at').notNull(), // NOT NULL
});