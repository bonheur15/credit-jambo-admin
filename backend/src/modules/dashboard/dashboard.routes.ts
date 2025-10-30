import { type FastifyInstance } from "fastify";
import { getDashboardOverviewHandler } from "./dashboard.controller";

export async function dashboardRoutes(server: FastifyInstance) {
  server.get(
    "/overview",
    {
      schema: {
        summary: "Get dashboard overview",
        description: "Returns a summary of data for the admin dashboard.",
        tags: ["Dashboard"],
        response: {
          200: {
            description: "Dashboard overview",
            type: "object",
            properties: {
              totalUsers: { type: "number" },
              totalDevices: { type: "number" },
              totalTransactions: { type: "number" },
              totalTransactionVolume: { type: "number" },
              recentTransactions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    type: { type: "string" },
                    amount: { type: "number" },
                    created_at: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    getDashboardOverviewHandler,
  );
}
