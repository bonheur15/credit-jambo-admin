import { type FastifyRequest, type FastifyReply } from "fastify";
import {
  findUserByEmail,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  getUsers,
  getUser,
} from "./users.service";
import { type CreateUserInput } from "./users.service";
import { hash, verify } from "../../utils/hash";
import { SignJWT, jwtVerify } from "jose";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

export async function loginHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const { email, password_hash } = request.body;

  const user = await findUserByEmail(email);

  if (!user || user.role !== "admin") {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await verify(password_hash, user.salt, user.password_hash);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const alg = "HS256";

  const jwt = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("1m") // Short-lived access token
    .sign(secret);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token valid for 7 days

  const { refreshToken } = await createRefreshToken({
    user_id: user.id,
    expires_at: expiresAt,
  });

  return reply.code(200).send({ jwt, refresh_token: refreshToken });
}

export async function refreshTokenHandler(
  request: FastifyRequest<{ Body: { refresh_token: string } }>,
  reply: FastifyReply,
) {
  const { refresh_token } = request.body;

  const storedRefreshToken = await findRefreshToken(refresh_token);
  if (!storedRefreshToken || storedRefreshToken.expires_at < new Date()) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Revoke the old refresh token (append-only)
  await revokeRefreshToken(storedRefreshToken.id);

  const user = await findUserById(storedRefreshToken.user_id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  const newJwt = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("15m") // Short-lived access token
    .sign(secret);

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7); // New refresh token valid for 7 days

  const { refreshToken: newRefreshToken } = await createRefreshToken({
    user_id: user.id,
    expires_at: newExpiresAt,
  });

  return reply.code(200).send({ jwt: newJwt, refresh_token: newRefreshToken });
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await getUsers();
  return reply.code(200).send(users);
}

export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const user = await getUser(id);
  return reply.code(200).send(user);
}
