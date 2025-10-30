import { type FastifyInstance } from "fastify";
import {
  loginHandler,
  refreshTokenHandler,
  getUsersHandler,
  getUserHandler,
} from "./users.controller";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./users.schema";
import { z } from "zod";

const loginSchema = createInsertSchema(users, {
  email: z.string().email(),
  password_hash: z.string().min(8),
});

export async function usersRoutes(server: FastifyInstance) {
  server.post(
    "/login",
    {
      schema: {
        summary: "Login a user",
        description: "Authenticates a user and returns a JWT token.",
        tags: ["Users"],
        body: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password_hash: { type: "string", minLength: 8 },
          },
          required: ["email", "password_hash"],
        },
        response: {
          200: {
            description: "Login successful, JWT token returned",
            type: "object",
            properties: {
              jwt: { type: "string" },
              refresh_token: { type: "string" },
            },
          },
        },
      },
    },
    loginHandler,
  );

  server.post(
    "/refresh-token",
    {
      schema: {
        summary: "Refresh JWT token",
        description: "Refreshes an expired JWT token using a refresh token.",
        tags: ["Users"],
        body: {
          type: "object",
          properties: {
            refresh_token: { type: "string" },
          },
          required: ["refresh_token"],
        },
        response: {
          200: {
            description: "Token refreshed successfully",
            type: "object",
            properties: {
              jwt: { type: "string" },
              refresh_token: { type: "string" },
            },
          },
        },
      },
    },
    refreshTokenHandler,
  );

  server.get(
    "/",
    {
      schema: {
        summary: "Get all users",
        description: "Returns a list of all users.",
        tags: ["Users"],
        response: {
          200: {
            description: "A list of users",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                created_at: { type: "string" },
              },
            },
          },
        },
      },
    },
    getUsersHandler,
  );

  server.get(
    "/:id",
    {
      schema: {
        summary: "Get a user by ID",
        description: "Returns a single user, including their accounts and balances.",
        tags: ["Users"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            description: "User details",
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              created_at: { type: "string" },
              accounts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    currency: { type: "string" },
                    balance: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    getUserHandler,
  );
}