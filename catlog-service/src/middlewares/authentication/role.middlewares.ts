// middlewares/role.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { AuthError, ForbiddenError } from "../error-handler";

// Define role hierarchy (higher number = more permissions)
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  SELLER: "SELLER"
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role hierarchy map for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ADMIN]: 3,
  [ROLES.SELLER]: 2,
  [ROLES.USER]: 1
};

// Single role check
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role.toUpperCase() as UserRole)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
};

// Role hierarchy check (minimum role level)
export const requireMinRole = (minRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthError("Authentication required"));
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role as UserRole] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[minRole];

    if (userRoleLevel < requiredRoleLevel) {
      return next(new ForbiddenError(`Minimum ${minRole} role required`));
    }

    next();
  };
};

