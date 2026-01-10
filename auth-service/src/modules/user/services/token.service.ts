import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { TOKEN_CONFIG, TokenPurpose, TokenPayload } from "../types/token.types";

export class TokenService {
  /* -------------------- GENERATE -------------------- */

  generateToken<T extends TokenPayload>(
    payload: T,
    purpose: TokenPurpose,
  ): string {
    const config = TOKEN_CONFIG[purpose];
    return jwt.sign(
      {
        ...payload,
        purpose,
      },
      config.secret,
      {
        expiresIn: config.expiresIn,
      },
    );
  }

  /* -------------------- VERIFY -------------------- */

  verifyToken<T extends TokenPayload>(token: string, purpose: TokenPurpose): T {
    const config = TOKEN_CONFIG[purpose];
    const decoded = jwt.verify(token, config.secret) as JwtPayload & T;
    this.assertPurpose(decoded, purpose);

    return decoded;
  }

  /* -------------------- DECODE (NO VERIFY) -------------------- */

  decodeToken<T extends JwtPayload>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }

  /* -------------------- SECURITY HELPERS -------------------- */

  private assertPurpose(
    payload: JwtPayload & { purpose?: TokenPurpose },
    expected: TokenPurpose,
  ) {
    if (!payload.purpose || payload.purpose !== expected) {
      throw new Error("Invalid token purpose");
    }
  }

  getExpiry(token: string): Date | null {
    const decoded = jwt.decode(token) as JwtPayload | null;
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }

  isExpired(token: string): boolean {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }
}
