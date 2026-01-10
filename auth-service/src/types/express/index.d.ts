import { UserRole } from "../../generated/prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  isVerified: boolean;
  sessionId: string;
  deviceId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
