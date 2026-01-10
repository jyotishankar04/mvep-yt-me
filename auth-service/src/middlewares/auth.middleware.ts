import { NextFunction, Request, Response } from "express";
import { TokenService } from "../modules/user/services/token.service";
import { SessionService } from "../modules/user/services/user.session.service";
import { UserRole } from "../generated/prisma";
import { cookieTypes } from "../modules/user/utils/cookie";
import { TOKEN_PURPOSE } from "../modules/user/types/token.types";

export const authMiddleware =
  (tokenService: TokenService, sessionService: SessionService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies[cookieTypes.accessToken];
      if (!token) {
        throw new Error("Unauthorized");
      }

      const payload = tokenService.verifyToken(token, TOKEN_PURPOSE.ACCESS);

      const valid = await sessionService.isSessionValid(
        payload.sessionId,
        payload.deviceId,
      );

      if (!valid) {
        throw new Error("Session expired");
      }

      req.user = {
        id: payload.id,
        deviceId: payload.deviceId,
        email: payload.email!,
        name: payload.name!,
        role: payload.role! as UserRole,
        isVerified: payload.isVerified!,
        sessionId: payload.sessionId,
      };

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
