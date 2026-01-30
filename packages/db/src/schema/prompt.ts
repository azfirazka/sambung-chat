import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, index, jsonb, integer } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { generateULID } from '../utils/ulid';

export const prompts = pgTable(
  'prompts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => generateULID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    content: text('content').notNull(),
    variables: jsonb('variables').$type<string[]>().default([]).notNull(),
    category: text('category').default('general'),
    isPublic: boolean('is_public').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('prompt_user_id_idx').on(table.userId),
    index('prompt_category_idx').on(table.category),
    index('prompt_is_public_idx').on(table.isPublic),
  ]
);

export const promptVersions = pgTable(
  'prompt_versions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => generateULID()),
    promptId: text('prompt_id')
      .notNull()
      .references(() => prompts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    content: text('content').notNull(),
    variables: jsonb('variables').$type<string[]>().default([]).notNull(),
    category: text('category').notNull(),
    versionNumber: integer('version_number').notNull(),
    changeReason: text('change_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('prompt_version_prompt_id_idx').on(table.promptId),
    index('prompt_version_user_id_idx').on(table.userId),
  ]
);

export const promptRelations = relations(prompts, ({ one, many }) => ({
  user: one(user, {
    fields: [prompts.userId],
    references: [user.id],
  }),
  versions: many(promptVersions),
}));

export const promptVersionRelations = relations(promptVersions, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptVersions.promptId],
    references: [prompts.id],
  }),
  user: one(user, {
    fields: [promptVersions.userId],
    references: [user.id],
  }),
}));
