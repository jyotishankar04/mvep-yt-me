// src/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

import authRoutes from "./modules/user/routes/auth.routes";
import { _env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { logger } from "./config/logger";

export function createServer() {
  const app = express();

  /**
   * --------------------
   * Security middlewares
   * --------------------
   */

  // Secure HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:5173",
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  /**
   * --------------------
   * Body & cookies
   * --------------------
   */

  // Parse JSON body
  app.use(express.json({ limit: "10kb" }));

  // Parse cookies (for refresh tokens later)
  app.use(cookieParser());

  /**
   * --------------------
   * Logging (Pino)
   * --------------------
   */

  app.use(
    pinoHttp({
      logger,

      customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },

      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },

      customSuccessMessage(req, res) {
        return `${req.method} ${req.url} → ${res.statusCode}`;
      },

      customErrorMessage(req, res, err) {
        return `${req.method} ${req.url} → ${res.statusCode} | ${err.message}`;
      },
    }),
  );

  /**
   * --------------------
   * Rate limiting
   * --------------------
   */

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 1000, // max requests per IP
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter);

  /**
   * --------------------
   * Routes
   * --------------------
   */

  app.use("/api/auth", authRoutes);

  /**
   * --------------------
   * Health check
   * --------------------
   */

  app.get("/health", (_, res) => {
    res.status(200).json({
      status: "ok",
      service: "auth-service",
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * --------------------
   * Global error handler
   * --------------------
   */

  app.use(errorHandler);

  return app;
}
