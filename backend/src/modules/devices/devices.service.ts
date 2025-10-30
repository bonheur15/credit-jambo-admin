import { db } from '../../db/db';
import { devices } from './devices.schema';
import { deviceVerifications } from '../device_verifications/device_verifications.schema';
import { eq } from 'drizzle-orm';

export async function getDevices() {
  const result = await db.select().from(devices);
  return result;
}

export async function approveDevice(deviceId: string) {
  const result = await db.insert(deviceVerifications).values({
    device_id: deviceId,
    status: 'VERIFIED',
  }).returning();
  return result[0];
}