import { db } from "../../db/db";
import { users, refreshTokens } from "./users.schema";
import { accounts } from "../accounts/accounts.schema";
import { transactions } from "../transactions/transactions.schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createHash } from "crypto";
import { randomBytes } from "crypto";

const insertUserSchema = createInsertSchema(users);
const insertRefreshTokenSchema = createInsertSchema(refreshTokens);

export type CreateUserInput = z.infer<typeof insertUserSchema>;
export type CreateRefreshTokenInput = z.infer<typeof insertRefreshTokenSchema>;

export async function createUser(data: CreateUserInput) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function findUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function findUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function createRefreshToken(
  data: Omit<CreateRefreshTokenInput, "token_hash">,
) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const result = await db
    .insert(refreshTokens)
    .values({
      ...data,
      token_hash: tokenHash,
    })
    .returning();
  return { refreshToken: token, dbEntry: result[0] };
}

export async function findRefreshToken(token: string) {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const result = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token_hash, tokenHash),
        isNull(refreshTokens.revoked_at),
      ),
    );
  return result[0];
}

export async function revokeRefreshToken(id: string) {
  const result = await db
    .update(refreshTokens)
    .set({
      revoked_at: new Date(),
    })
    .where(eq(refreshTokens.id, id))
    .returning();
  return result[0];
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function getUser(id: string) {
  const user = await findUserById(id);
  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.user_id, id));

  const accountsWithBalances = await Promise.all(
    userAccounts.map(async (account) => {
      const [balanceResult] = await db
        .select({
          balance: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'DEPOSIT' THEN ${transactions.amount} WHEN ${transactions.type} = 'WITHDRAWAL' THEN -${transactions.amount} ELSE 0 END), 0)`,
        })
        .from(transactions)
        .where(eq(transactions.account_id, account.id));

      return {
        ...account,
        balance: balanceResult?.balance,
      };
    }),
  );

  return { ...user, accounts: accountsWithBalances };
}
