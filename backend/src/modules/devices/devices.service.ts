import { db } from '../../db/db';
import { devices, deviceVerifications } from './devices.schema';
import { eq, sql, desc, asc } from 'drizzle-orm';

export async function getDevices() {
  const latestDeviceVerifications = db
    .select({
      id: deviceVerifications.id,
      deviceId: deviceVerifications.device_id,
      status: deviceVerifications.status,
      createdAt: deviceVerifications.created_at,
    })
    .from(deviceVerifications)
    .orderBy(desc(deviceVerifications.created_at))
    .as('latest_device_verifications');

  const result = await db
    .select({
      id: devices.id,
      userId: devices.user_id,
      deviceId: devices.device_id,
      deviceMeta: devices.device_meta,
      registeredAt: devices.registered_at,
      createdBy: devices.created_by,
      status: latestDeviceVerifications.status,
    })
    .from(devices)
    .leftJoin(
      latestDeviceVerifications,
      eq(devices.id, latestDeviceVerifications.deviceId),
    );

  return result;
}

export async function approveDevice(deviceId: string) {
  const result = await db.insert(deviceVerifications).values({
    device_id: deviceId,
    status: 'VERIFIED',
  }).returning();
  return result[0];
}