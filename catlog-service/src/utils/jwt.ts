import jwt from "jsonwebtoken";
import { _env } from "../config";

export interface AccessTokenPayload {
  id: string;
  email?: string;
  role: string;
  [key: string]: any;
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, _env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

