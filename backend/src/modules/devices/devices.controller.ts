import type { FastifyRequest, FastifyReply } from "fastify";
import { getDevices, approveDevice } from "./devices.service";

export async function getDevicesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const devices = await getDevices();
  const formattedDevices = devices.map((device) => ({
    ...device,
    status: device.status.length > 0 ? device.status[0].status : null,
  }));
  return reply.code(200).send(formattedDevices);
}

export async function approveDeviceHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const device = await approveDevice(id);
  return reply.code(200).send(device);
}