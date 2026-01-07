// src/utils/device.ts
import { DeviceType } from "../../../generated/prisma";
import crypto from "crypto";

export function generateDeviceId(input: {
  userAgent?: string;
  ipAddress?: string;
}) {
  const raw = `${input.userAgent ?? ""}|${input.ipAddress ?? ""}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function detectDeviceType(userAgent?: string): DeviceType {
  if (!userAgent) return DeviceType.WEB;

  const ua = userAgent.toLowerCase();

  if (ua.includes("android") || ua.includes("iphone") || ua.includes("ipod")) {
    return DeviceType.MOBILE;
  }

  if (ua.includes("ipad") || ua.includes("tablet")) {
    return DeviceType.TABLET;
  }

  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("linux")
  ) {
    return DeviceType.DESKTOP;
  }

  return DeviceType.WEB;
}
