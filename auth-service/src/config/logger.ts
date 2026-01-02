import pino from "pino";
import { _env } from "./env";

export const logger = pino({
  level: _env.NODE_ENV === "production" ? "info" : "debug",

  // redact sensitive fields
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true,
  },

  transport:
    _env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: false,
          },
        }
      : undefined,
});
