import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { _env } from "./env";

const transporter = nodemailer.createTransport({
  host: _env.MAIL_HOST,
  port: Number(_env.MAIL_PORT),
  auth:
    _env.NODE_ENV === "production"
      ? {
          user: _env.MAIL_USER,
          pass: _env.MAIL_PASS,
        }
      : undefined,
});

export default transporter;
