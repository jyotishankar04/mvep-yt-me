import {
  DeviceType,
  PrismaClient,
  SessionStatus,
} from "../../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const REFRESH_TOKEN_DAYS = 7;

export class SessionService {
  constructor(private readonly prisma: PrismaClient) {}

  /* -------------------- SESSION -------------------- */

  async createSession(input: {
    sellerId: string;
    deviceId: string;
    deviceType: DeviceType;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const session = await this.prisma.sellerSession.create({
      data: {
        sellerId: input.sellerId,
        status: SessionStatus.ACTIVE,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    await this.prisma.deviceSession.create({
      data: {
        sellerSessionId: session.id,
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
        sellerSessionId: sessionId,
        deviceId,
      },
      include: {
        sellerSession: true,
      },
    });

    if (
      !deviceSession ||
      deviceSession.sellerSession?.status !== SessionStatus.ACTIVE
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
    await this.prisma.sellerSession.update({
      where: { id: sessionId },
      data: { status: SessionStatus.REVOKED },
    });

    // unchanged
    await this.prisma.refreshToken.deleteMany({
      where: { sessionId },
    });

    // unchanged
    await this.prisma.deviceSession.deleteMany({
      where: { sellerSessionId: sessionId },
    });
  }
  /* -------------------- REVOKE SINGLE DEVICE -------------------- */

  async revokeDeviceSession(sessionId: string, deviceId: string) {
    // 🔧 CHANGED: scoped by sessionId (prevents cross-user revocation)
    await this.prisma.deviceSession.deleteMany({
      where: {
        sellerSessionId: sessionId,
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

  async getSessionByRefreshToken(refreshToken: string) {
    console.log("Raw refresh token:", refreshToken);
    const [tokenId, secret] = refreshToken.split(".");
    console.log("TokenId:", tokenId, "Secret length:", secret?.length);

    if (!tokenId || !secret) {
      console.log("Missing tokenId or secret");
      throw new Error("Invalid refresh token format");
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenId },
    });

    console.log("Found token in DB:", !!token);
    if (token) {
      console.log("Token expiresAt:", token.expiresAt);
      console.log("Current time:", new Date());
      console.log("Is expired?", token.expiresAt < new Date());

      // Test the bcrypt compare
      const isValid = await bcrypt.compare(secret, token.tokenHash);
      console.log("Bcrypt compare result:", isValid);
    }

    if (
      !token ||
      token.expiresAt < new Date() ||
      !(await bcrypt.compare(secret, token.tokenHash))
    ) {
      throw new Error("Invalid refresh token");
    }

    const session = await this.prisma.sellerSession.findUnique({
      where: { id: token.sessionId },
    });
    if (!session) {
      throw new Error("Invalid session");
    }

    return session;
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
    return this.prisma.sellerSession.findUnique({
      where: { id: sessionId },
    });
  }
}
