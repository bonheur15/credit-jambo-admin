import { db } from "../../db/db";
import { users } from "../users/users.schema";
import { devices } from "../devices/devices.schema";
import { transactions } from "../transactions/transactions.schema";
import { sql } from "drizzle-orm";

export async function getDashboardOverview() {
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalDevices = await db.select({ count: sql<number>`count(*)` }).from(devices);
  const totalTransactions = await db.select({ count: sql<number>`count(*)` }).from(transactions);
  const totalTransactionVolume = await db.select({ sum: sql<number>`sum(amount)` }).from(transactions);
  const recentTransactions = await db.select().from(transactions).orderBy(transactions.created_at).limit(10);

  return {
    totalUsers: totalUsers[0].count,
    totalDevices: totalDevices[0].count,
    totalTransactions: totalTransactions[0].count,
    totalTransactionVolume: totalTransactionVolume[0].sum,
    recentTransactions,
  };
}
