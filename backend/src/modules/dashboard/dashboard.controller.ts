import { type FastifyRequest, type FastifyReply } from "fastify";
import { getDashboardOverview } from "./dashboard.service";

export async function getDashboardOverviewHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const overview = await getDashboardOverview();
  return reply.code(200).send(overview);
}
