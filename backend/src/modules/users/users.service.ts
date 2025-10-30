import { db } from "../../db/db";
import { users, refreshTokens } from "./users.schema";
import { accounts } from "../accounts/accounts.schema";
import { account_balance_snapshots } from "../account_balance_snapshots/account_balance_snapshots.schema";
import { eq, and, isNull, desc } from "drizzle-orm";
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
  data: Omit<CreateRefreshTokenInput, "token_hash" | "device_id">,
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
      const latestSnapshot = await db
        .select()
        .from(account_balance_snapshots)
        .where(eq(account_balance_snapshots.account_id, account.id))
        .orderBy(desc(account_balance_snapshots.created_at))
        .limit(1);

      return {
        ...account,
        balance: latestSnapshot[0]?.balance ?? 0,
      };
    }),
  );

  return { ...user, accounts: accountsWithBalances };
}