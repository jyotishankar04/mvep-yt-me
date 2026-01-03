import { DeviceType, PrismaClient, SessionStatus } from "../generated/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const REFRESH_TOKEN_DAYS = 7;

export class SessionService {
  constructor(private readonly prisma: PrismaClient) {}

  /* -------------------- SESSION -------------------- */

  async createSession(input: {
    userId: string;
    deviceId: string;
    deviceType: DeviceType;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const session = await this.prisma.userSession.create({
      data: {
        userId: input.userId,
        status: SessionStatus.ACTIVE,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    await this.prisma.deviceSession.create({
      data: {
        userSessionId: session.id,
        deviceId: input.deviceId,
        deviceType: input.deviceType,
        ipAddress: input.ipAddress ?? "",
        userAgent: input.userAgent ?? "",
        isTrusted: false,
      },
    });

    return session;
  }

  /* -------------------- VALIDATE SESSION + DEVICE -------------------- */
  async isSessionValid(sessionId: string, deviceId: string) {
    // 🔧 CHANGED: Fetch device session directly (more efficient & safer)
    const deviceSession = await this.prisma.deviceSession.findFirst({
      where: {
        userSessionId: sessionId,
        deviceId,
      },
      include: {
        userSession: true,
      },
    });

    if (
      !deviceSession ||
      deviceSession.userSession?.status !== SessionStatus.ACTIVE
    ) {
      return false;
    }

    // 🔧 ADDED: Update last activity timestamp
    await this.prisma.deviceSession.update({
      where: { id: deviceSession.id },
      data: { lastActiveAt: new Date() },
    });

    return true;
  }
  /* -------------------- REVOKE FULL SESSION -------------------- */

  async revokeSession(sessionId: string) {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { status: SessionStatus.REVOKED },
    });

    // unchanged
    await this.prisma.refreshToken.deleteMany({
      where: { sessionId },
    });

    // unchanged
    await this.prisma.deviceSession.deleteMany({
      where: { userSessionId: sessionId },
    });
  }
  /* -------------------- REVOKE SINGLE DEVICE -------------------- */

  async revokeDeviceSession(sessionId: string, deviceId: string) {
    // 🔧 CHANGED: scoped by sessionId (prevents cross-user revocation)
    await this.prisma.deviceSession.deleteMany({
      where: {
        userSessionId: sessionId,
        deviceId,
      },
    });
  }

  /* -------------------- REFRESH TOKEN -------------------- */

  async createRefreshToken(sessionId: string): Promise<string> {
    // 🔧 CHANGED: introduce tokenId for O(1) lookup
    const tokenId = randomBytes(16).toString("hex");
    const secret = randomBytes(32).toString("hex");

    const hash = await bcrypt.hash(secret, 10);

    await this.prisma.refreshToken.create({
      data: {
        tokenId,
        sessionId,
        tokenHash: hash,
        expiresAt: new Date(
          Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });

    // 🔧 CHANGED: raw token now includes tokenId
    return `${tokenId}.${secret}`;
  }

  async rotateRefreshToken(oldRawToken: string) {
    // 🔧 CHANGED: split tokenId + secret
    const [tokenId, secret] = oldRawToken.split(".");
    if (!tokenId || !secret) {
      throw new Error("Invalid refresh token format");
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenId },
    });

    if (
      !token ||
      token.expiresAt < new Date() ||
      !(await bcrypt.compare(secret, token.tokenHash))
    ) {
      throw new Error("Invalid refresh token");
    }

    // 🔥 delete old token
    await this.prisma.refreshToken.delete({
      where: { id: token.id },
    });

    // 🔁 issue new refresh token
    const newRefreshToken = await this.createRefreshToken(token.sessionId);

    return {
      sessionId: token.sessionId,
      refreshToken: newRefreshToken,
    };
  }
  // CLean up
  async cleanupExpiredRefreshTokens() {
    // 🔧 ADDED: prevents DB bloat
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  async getSessionById(sessionId: string) {
    return this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });
  }
}
