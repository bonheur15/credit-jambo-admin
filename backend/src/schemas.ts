
import { buildJsonSchemas } from "./utils/buildJsonSchemas";
import { createInsertSchema } from "drizzle-zod";
import { accounts } from "./modules/accounts/accounts.schema";

import { devices } from "./modules/devices/devices.schema";
import { transactions } from "./modules/transactions/transactions.schema";
import { users } from "./modules/users/users.schema";

const insertAccountSchema = createInsertSchema(accounts);

const insertDeviceSchema = createInsertSchema(devices);
const insertTransactionSchema = createInsertSchema(transactions);
const insertUserSchema = createInsertSchema(users);

export const { schemas, $ref } = buildJsonSchemas({
  accounts: insertAccountSchema,
  devices: insertDeviceSchema,
  transactions: insertTransactionSchema,
  users: insertUserSchema,
});
