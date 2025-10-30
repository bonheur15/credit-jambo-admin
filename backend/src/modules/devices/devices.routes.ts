import { type FastifyInstance } from "fastify";
import {
  getDevicesHandler,
  approveDeviceHandler,
} from "./devices.controller";

export async function devicesRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        summary: "Get all devices",
        description: "Returns a list of all devices.",
        tags: ["Devices"],
        response: {
          200: {
            description: "A list of devices",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                user_id: { type: "string" },
                device_id: { type: "string" },
                device_meta: { type: "object" },
                registered_at: { type: "string" },
                created_by: { type: "string" },
              },
            },
          },
        },
      },
    },
    getDevicesHandler,
  );

  server.put(
    "/:id/approve",
    {
      schema: {
        summary: "Approve a device",
        description: "Approves a device for a user.",
        tags: ["Devices"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Device approved successfully",
            type: "object",
            properties: {
              id: { type: "string" },
              device_id: { type: "string" },
              status: { type: "string" },
            },
          },
        },
      },
    },
    approveDeviceHandler,
  );
}