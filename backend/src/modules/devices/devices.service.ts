import { db } from '../../db/db';
import { devices, deviceVerifications } from './devices.schema';
import { eq, sql, desc } from 'drizzle-orm';

export async function getDevices() {
  const result = await db
    .select({
      id: devices.id,
      userId: devices.user_id,
      deviceId: devices.device_id,
      deviceMeta: devices.device_meta,
      registeredAt: devices.registered_at,
      createdBy: devices.created_by,
      status: db
        .select({ status: deviceVerifications.status })
        .from(deviceVerifications)
        .where(eq(deviceVerifications.device_id, devices.id))
        .orderBy(desc(deviceVerifications.created_at))
        .limit(1),
    })
    .from(devices);

  return result;
}

export async function approveDevice(deviceId: string) {
  const result = await db.insert(deviceVerifications).values({
    device_id: deviceId,
    status: 'VERIFIED',
  }).returning();
  return result[0];
}