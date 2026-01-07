import { _env } from "../../../config/env";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export const TOKEN_PURPOSE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "reset_password",
  EMAIL_VERIFICATION: "email_verification",
  FORGOT_PASSWORD: "forgot_password",
  REGISTER: "register",
} as const;

export type TokenPurpose = (typeof TOKEN_PURPOSE)[keyof typeof TOKEN_PURPOSE];
export const TOKEN_CONFIG: Record<
  TokenPurpose,
  {
    secret: Secret;
    expiresIn: StringValue | number;
  }
> = {
  access: {
    secret: _env.JWT_ACCESS_SECRET,
    expiresIn: "1h",
  },
  refresh: {
    secret: _env.JWT_REFRESH_SECRET,
    expiresIn: "7d",
  },
  reset_password: {
    secret: _env.JWT_ACCESS_SECRET,
    expiresIn: "15m",
  },
  email_verification: {
    secret: _env.JWT_ACCESS_SECRET,
    expiresIn: "15m",
  },
  forgot_password: {
    secret: _env.JWT_ACCESS_SECRET,
    expiresIn: "15m",
  },
  register: {
    secret: _env.JWT_ACCESS_SECRET,
    expiresIn: "15m",
  },
};

export type TokenPayload = {
  sub: string; // userId
  email?: string;
  role?: string;
} & Record<string, any>;
