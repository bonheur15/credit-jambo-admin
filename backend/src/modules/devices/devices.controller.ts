import type { FastifyRequest, FastifyReply } from "fastify";
import { getDevices, approveDevice } from "./devices.service";

export async function getDevicesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const devices = await getDevices();
  return reply.code(200).send(devices);
}

export async function approveDeviceHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const device = await approveDevice(id);
  return reply.code(200).send(device);
}