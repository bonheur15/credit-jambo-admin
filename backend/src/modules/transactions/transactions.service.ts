import { db } from '../../db/db';
import { transactions } from './transactions.schema';
import { eq, desc } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertTransactionSchema = createInsertSchema(transactions);

export type CreateTransactionInput = z.infer<typeof insertTransactionSchema>;

export async function createTransaction(data: CreateTransactionInput) {
  const result = await db.insert(transactions).values(data).returning();
  return result[0];
}

export async function findTransactionsByAccountId(accountId: string, limit?: number) {
  const result = await db.select().from(transactions).where(eq(transactions.account_id, accountId)).orderBy(desc(transactions.created_at)).limit(limit);
  return result;
}

export async function getAllTransactions() {
  const result = await db.select().from(transactions).orderBy(desc(transactions.created_at));
  return result;
}