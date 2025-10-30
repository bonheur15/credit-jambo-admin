import { pgTable, text, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

export const devices = pgTable('devices', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id),
  device_id: text('device_id').notNull(),
  device_meta: jsonb('device_meta'),
  registered_at: timestamp('registered_at').defaultNow(),
  created_by: text('created_by'),
});

export const deviceVerifications = pgTable('device_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  device_id: uuid('device_id').references(() => devices.id).notNull(),
  admin_id: uuid('admin_id').references(() => users.id),
  status: text('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  note: text('note'),
});