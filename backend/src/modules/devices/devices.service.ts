import { db } from "../../db/db";
import { devices, deviceVerifications } from "./devices.schema";
import { eq, desc } from "drizzle-orm";

export async function getDevices() {
  const result = await db
    .select({
      id: devices.id,
      user_id: devices.user_id,
      device_id: devices.device_id,
      device_meta: devices.device_meta,
      registered_at: devices.registered_at,
      created_by: devices.created_by,
      status: deviceVerifications.status,
    })
    .from(devices)
    .leftJoin(
      deviceVerifications,
      eq(devices.id, deviceVerifications.device_id),
    )
    .orderBy(desc(deviceVerifications.created_at));

  return result.map((device) => ({
    id: device.id,
    user_id: device.user_id,
    device_id: device.device_id,
    device_meta: device.device_meta,
    registered_at: device.registered_at,
    created_by: device.created_by,
    status: device.status ?? "PENDING",
  }));
}

export async function approveDevice(deviceId: string) {
  const result = await db
    .insert(deviceVerifications)
    .values({
      device_id: deviceId,
      status: "VERIFIED",
    })
    .returning();
  return result[0];
}
