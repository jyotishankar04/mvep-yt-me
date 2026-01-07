import { Transporter } from "nodemailer";
import { InternalServerError } from "../../../middlewares/error-handler";

import { _env } from "../../../config/env";

class MailService {
  constructor(private readonly transporter: Transporter) {}

  async sendEmail(to: string | string[], subject: string, html: string) {
    try {
      const toEmail = Array.isArray(to)
        ? to.map((email) => email.trim())
        : to.trim();
      await this.transporter.sendMail({
        from: `<${_env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html,
      });
    } catch (error) {
      throw new InternalServerError("Error sending email");
    }
  }
}

export default MailService;
